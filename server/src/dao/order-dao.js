'use strict';

import db from '../db';
import dayjs from 'dayjs';

/**
 * add an order
 * @param orderClient
 * @returns id of the order
 */
export function insertOrder(orderClient) {
  return new Promise((resolve, reject) => {
    const insertReqQuery = `INSERT INTO Request(ref_client, status,date) VALUES (?, ?,?)`;
    db.run(
      insertReqQuery,
      [orderClient.clientID, "pending", dayjs().format('YYYY-MM-DD HH:MM')],

      function (err) {
        if (err) {
          reject(err);
          return;
        }

        const OrderID = this.lastID;

        orderClient.order.map((product, index) => {
          const insertProdQuery = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (?,?,?)`;

          db.run(insertProdQuery, [OrderID, product.id, product.quantity], function (err) {
            if (err) {
              reject(err);
              return;
            }

            const updateQuery = `UPDATE Product SET quantity=quantity-? WHERE id=?`;

            db.run(updateQuery, [product.quantity, product.id], function (err) {
              if (err) {
                reject(err);
                return;
              }

              // When the last product is inserted resolve the promise
              if (orderClient.order.length === index + 1) {
                checkBalanceAndSetStatus(OrderID)
                  .then(() => resolve(OrderID))
                  .catch((err) => reject(err));                
              }
            });
          });
        });
      }
    );
  });
}

/**
 * Computes an order's total amount to be paid, eventually taking into
 * account delivery fees.
 * 
 * @param {int} orderID: the order's unique ID 
 */
export function computeOrderTotal(orderID) {
  return new Promise(async (resolve, reject) => {
    // Extra fee for delivery at home amounts to 10 euros
    const deliveryFee = 10.0;

    const sql = `
        SELECT SUM(P.price * PR.quantity) AS totalAmount
        FROM client C, request R, product_request PR, product P
        WHERE R.id = ?
          AND PR.ref_request = R.id
          AND PR.ref_product = P.id
          AND R.ref_client = C.ref_user;
      `;

    db.all(sql, [orderID], async (err, rows) => {
      if (err) {
        reject(err);
      }

      if (!rows) {
        reject("order not found");
      }

      const order = rows[0];
      try {
        // Check whether the order has to be delivered at home or not
        const delivery = await getDeliveryByRequestId(orderID);

        /*
          Note: the condition for the following if statement was written to make it 
          compatible with both the old and new versions of the database for the current sprint (#4).

          If the old database is used, the "deliveryAtHome" field will be undefined, and no delivery
            fee will be added to the total amount.
          If the new database is used, the field will be defined and will either be a "true" or "false"
            string.
        */
        if (delivery 
            && delivery.deliveryAtHome != undefined 
            && (delivery.deliveryAtHome === "true")) {
          resolve(order.totalAmount + deliveryFee);
        }
        else {
          resolve(order.totalAmount);
        }
      }
      catch(err) {
        reject(err);
      }
    }); 
  });
}

/**
 * This function checks if a client's balance is enough to pay for
 * the given order and changes the order's status to:
 * - "confirmed", if the client has enough balance;
 * - "pendinc_canc", if the balance is insufficient
 * The function also updates the client's balance if it is sufficient.
 * 
 * @param {int} orderID: the unique ID of the order  
 */
export function checkBalanceAndSetStatus(orderID) {
  return new Promise((resolve, reject) => {
    // Get the client's ID and balance for the given order
    const sql = `
        SELECT DISTINCT C.ref_user AS clientID, C.balance AS clientBalance
        FROM client C, request R
        WHERE R.id = ?
          AND R.ref_client = C.ref_user;
      `;

    db.all(sql, [orderID], async function (err, rows) {
      if (err) {
        reject(err);
      }

      if (rows == undefined || rows.length == 0 || !rows) {
        reject("error: no order found");
      }

      // Get client info and the total amount to pay for the order
      const clientInfo = rows[0];
      let orderTotal = 0.0;
      
      try {
        orderTotal = await computeOrderTotal(orderID);
      }
      catch (err) {
        reject(err);
      }

      // Check whether the client's balance is enough to pay for the order
      if (clientInfo.clientBalance >= orderTotal) {
        // Decrease the client's balance and set the order's status to "confirmed"
        const sql_balance = `
            UPDATE client
            SET balance = balance - ?
            WHERE ref_user = ?;
          `;
        const sql_order = `
          UPDATE request
          SET status = 'confirmed'
          WHERE id = ?;
          `;

        db.serialize(() => {
          db.run(sql_balance, [orderTotal, clientInfo.clientID], (err) => {
            if (err) {
              reject(err);
            }
          });
          db.run(sql_order, [orderID], (err) => {
            if (err) {
              reject(err);
            }          
          });
        }); 
        resolve("confirmed");
      }
      else {
        // Set the order's status to "pending_canc" and do not decrease the client's balance
        const sql_order = `
          UPDATE request
          SET status = 'pending_canc'
          WHERE id = ?;
          `;

        db.run(sql_order, [orderID], (err) => {
            if (err) {
              reject(err);
            }            
          });

        resolve("pending_canc");
      }
    });
  });
}

/**
 * Retrive all orders.
 * If `clientId` is specified the query selects only orders of a specific client.
 *
 * @param {number} clientId - User id on the database [default=-1].
 * @returns {Promise<Array>}
 */
export function getOrders(clientId = -1) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT r.id, u.email, r.date, r.status
                    FROM Request r, Client c, User u
            WHERE r.ref_client = c.ref_user AND c.ref_user = u.id`;
    let deps = [];
    if (clientId !== -1) {
      sql += ` AND u.id = ?`;
      deps.push(clientId);
    }
    db.all(sql, deps, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const orders = rows.map((p) => ({
        orderId: p.id,
        email: p.email,
        date: p.date,
        status: p.status,
      }));
      resolve(orders);
    });
  });
}

/**
 *
 * @param orderId
 * @returns id of the order with it = orderId
 */
export function getOrder(orderId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT r.id
            FROM Request r
            WHERE r.id = ?`;
    db.get(sql, [orderId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows.id);
    });
  });
}

/**
 * Make an order with the product corrently on basket.
 *
 * @param {number} clientId - User id on the database.
 * @returns {Promise<number>} Request id of th current order.
 */
export function insertOrderFromBasket(clientId, date) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Request(ref_client, status, date) VALUES(?, ?, ?)';
    db.run(sql, [clientId, 'pending', date], function (err) {
      err ? reject(err) : resolve(this.lastID);
    });
  });
}

/**
 * Insert informations of the ordered product.
 *
 * @param {number} requestId - Request id on the database.
 * @param {number} productId - Product id on the database.
 * @param {number} quantity - Product quantity to order.
 * @returns {Promise<null>}
 */
export function insertProductRequest(requestId, productId, quantity) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Product_Request(ref_request, ref_product, quantity) VALUES(?, ?, ?)';
    db.run(sql, [requestId, productId, quantity], (err) => (err ? reject(err) : resolve(null)));
  });
}

/**
 * Retrive one order from `orderId`.
 * If `clientId` is specified the query selects only orders of a specific client.
 *
 * @param {number} orderId - Order id on the database.
 * @param {number} clientId - User id on the database [default=-1].
 * @returns {Promise<object>}
 */
export function getOrderById(orderId, clientId = -1) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT r.id, u.email, r.status, r.date, c.address, u.username, u.name, u.surname, u.role, u.phone
                  FROM Request r, Client c, User u
                  WHERE r.ref_client = c.ref_user AND c.ref_user = u.id
                    AND r.id=?`;

    const sql2 = `SELECT pd.name, pr.quantity, p.price, pd.unit
                  FROM Request r, Product_Request pr, Product p, Prod_descriptor pd
                  WHERE r.id = pr.ref_request 
                    AND pr.ref_product = p.id 
                    AND p.ref_prod_descriptor = pd.id
                    AND r.id=?`;

    const sql3 = `SELECT d.address, d.date, d.startTime, d.endTime
                  FROM Delivery d
                  WHERE d.ref_request= ? `

    let deps = [orderId];
    if (clientId !== -1) {
      sql += ` AND u.id = ?`;
      deps.push(clientId);
    }

    db.get(sql, deps, function (err, row) {
      if (err) {
        reject(err);
        return;
      }

      let productsPromise = new Promise((resolve, reject) => {
        db.all(sql2, orderId, (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          const products = rows.map((p) => ({
            name: p.name,
            quantity: p.quantity,
            price: p.price,
            unit: p.unit,
          }));
          resolve(products);
        });
      });

      productsPromise.then((products) => {
        const order = {
          orderId: row.id,
          date: row.date,
          status: row.status,
          email: row.email,
          username: row.username,
          role: row.role,
          name: row.name,
          surname: row.surname,
          phone: row.phone,
          address: row.address,
          products: products,
        };
        db.get(sql3, [orderId], function (err, row) {
          if (err) {
            reject(err);
            return;
          }
          if (row == undefined) {
            resolve(order);
            return;
          }
          order.delivery = { address: row.address, date: row.date, time: row.time };
          resolve(order);
        });
      });
    });
  });
}

export function setOrderStatus(orderId, status) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Request
                  SET status = ?
                  WHERE id = ?`;
    db.run(sql, [status, orderId], (err) => {
      if (err) {
        reject(err);
        return;
      }
    });
    resolve(orderId);
  });
}

/**
 * Schedule bag delivery for the order with `orderId`.
 * @param {number} orderId - Order id on the database.
 * @param {object} delivery - {address,date,time}.
 * @returns {Promise<object>}
 */
export function scheduleOrderDeliver(orderId, delivery) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Delivery(ref_request, address, date, startTime, endTime, deliveryAtHome) VALUES(?, ?, ?, ?, ?, ?)';
    db.run(sql, [orderId, delivery.address, delivery.date, delivery.startTime, delivery.endTime, delivery.typeDelivery === "home" ? "true" : "false"], (err) =>
      err ? reject(err) : resolve(orderId)
    );
  });
}

/**
 *
 * @param {Date} currentDate current date needed to get only the unretrieved orders of the last month
 * @returns all the unretrieved orders
 */
 export function getUnretrievedOrders(currentDate) {
  return new Promise((resolve, reject) => {

    // Convert currentDate into a format readable by SQLite
    let endDate = dayjs(currentDate).format('YYYY-MM-DD');
    endDate = endDate + ' 00:00';

    //Start date corresponds to the first day of the current month
    //We want to get the unretrieved the orders of the last month
    const month = dayjs(currentDate).get("month"); 
    const year = dayjs(currentDate).get("year");
    const startDateString = "" + year + "-" + month + "-" + "01";
    let startDate = dayjs(startDateString, 'YYYY-MM-DD');
    startDate = startDate + ' 00:00';

    const sql = `SELECT *
            FROM Request r
            WHERE r.status = 'unretrieved'
            AND r.date >= DATE(?) AND r.date <= DATE(?)`;
    db.get(sql, [startDate, endDate], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

/**
 * Returns the DB tuple associated with a given order. Can also
 * return an "undefined" object in case there's no delivery associated
 * with it.
 * 
 * @param {int} requestId: the order's unique ID 
 * @returns {Promise}
 * - resolved promise containing the tuple, if the operation is successful
 * - rejected promise otherwise
 */
function getDeliveryByRequestId(requestId) {
  return new Promise((resolve, reject) => {
    const sql = `
                  SELECT d.ref_request
                  FROM Delivery d
                  WHERE d.ref_request = ?;
                  `;

    db.get(sql, [requestId], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}
