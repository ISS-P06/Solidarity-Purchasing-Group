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
      [orderClient.clientID, 'pending', dayjs().format('YYYY-MM-DD HH:MM')],

      function () {
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
              if (orderClient.order.length === index + 1) {
                resolve(OrderID);
              } else {
                reject();
              }
            });
          });
        });
      }
    );
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
 * @param {object} basket - User's basket.
 * @param {number} balance - Current balance on user's wallet.
 * @returns {Promise<number>} Request id of th current order.
 */
export function insertOrderFromBasket(clientId, basket, balance, date) {
  return new Promise((resolve, reject) => {
    const totalAmount = basket
      .map((p) => p.price * p.quantity)
      .reduce((a, b) => a + b, 0)
      .toFixed(2);

    const status = totalAmount <= balance ? 'confirmed' : 'pending_canc';

    const sql = 'INSERT INTO Request(ref_client, status, date) VALUES(?, ?, ?)';
    db.run(sql, [clientId, status, date], function (err) {
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
        resolve({
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
        });
      });
    });
  });
}

export function setOrderDelivered(orderId) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Request
                  SET status = 'delivered'
                  WHERE id=?`;
    db.run(sql, orderId, (err) => {
      if (err) {
        reject(err);
        return;
      }
    });
    resolve(orderId);
  });
}
