'use strict';

import db from './db.js';
import dayjs from 'dayjs';

export function listProducts() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.id, pd.name, pd.description, pd.category, p.quantity, p.price, pd.unit
                     FROM Product p,
                          Prod_descriptor pd
                     WHERE pd.id = p.ref_prod_descriptor`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const products = rows.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        quantity: p.quantity,
        price: p.price,
        unit: p.unit,
      }));
      resolve(products);
    });
  });
}

export function listClients() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, name, surname, phone, address, mail, balance
                     FROM Client c`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const clients = rows.map((c) => ({
        id: c.id,
        name: c.name,
        surname: c.surname,
        phone: c.phone,
        address: c.address,
        mail: c.mail,
        balance: c.balance,
      }));
      resolve(clients);
    });
  });
}

/**
 * Update current balance of a client
 *
 * @param {int} id      Client id.
 * @param {int} amount  Amount of money to add on client's balance.
 */
export function updateClientBalance(id, amount) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Client SET balance = balance + ? WHERE id = ?`;
    db.run(sql, [amount, id], (err) => {
      err ? reject(err) : resolve(null);
    });
  });
}

export function insertOrder(orderClient) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Request(ref_client, status,date) VALUES (?, ?,?)`;
    db.run(
      sql,
      [orderClient.clientID, 'confirmed', dayjs().format('YYYY-MM-DD HH:MM')],
      function (err) {
        var OrderID = this.lastID;
        orderClient.order.map((product, index) => {
          const sql = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (?,?,?)`;
          db.run(sql, [OrderID, product.id, product.quantity], function (err) {
            if (err) {
              reject(err);
              return;
            }
            const sql = `UPDATE Product SET quantity=quantity-? WHERE id=?`;
            db.run(sql, [product.quantity, product.id], function (err) {
              if (err) {
                reject(err);
                return;
              }
              if (orderClient.order.length === index + 1) {
                // console.log(OrderID);
                resolve(OrderID);
              }
            });
          });
        });
      }
    );
  });
}

export function insertClient(
  name,
  surname,
  phone,
  address,
  mail,
  balance = 0,
  username,
  password,
  role = 'client'
) {
  return new Promise((resolve, reject) => {
    const clientQuery =
      'INSERT INTO Client (name ,surname ,phone, address, mail, balance,ref_user) VALUES(? , ?, ?, ?, ?,?,?) ';
    const userQuery = 'INSERT INTO User (username ,password ,role) VALUES (? ,? , ?)';
    let userID;
    db.serialize(() => {
      let stmt = db.prepare(userQuery);
      stmt.run([username, password, role], function (err) {
        if (err) {
          reject(err);
        }
        userID = this.lastID;
        db.serialize(() => {
          let stmt_1 = db.prepare(clientQuery);
          stmt_1.run([name, surname, phone, address, mail, balance, userID], (err) => {
            if (err) {
              reject(err);
            }
          });
        });
        resolve(this.lastID);
      });
    });
  });
}

export function getOrders() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT r.id, c.mail
            FROM Request r, Client c
            WHERE r.ref_client = c.id`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const orders = rows.map((p) => ({
        orderId: p.id,
        email: p.mail,
      }));
      resolve(orders);
    });
  });
}

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

export function getOrderById(orderId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT r.id, c.mail, r.status
                  FROM Request r, Client c
                  WHERE r.ref_client = c.id
                    AND r.id=?`;

    const sql2 = `SELECT pd.name, pr.quantity, p.price
                  FROM Request r, Product_Request pr, Product p, Prod_descriptor pd
                  WHERE r.id = pr.ref_request 
                    AND pr.ref_product = p.id 
                    AND p.ref_prod_descriptor = pd.id
                    AND r.id=?`;

    db.get(sql, orderId, function (err, row) {
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
          }));
          resolve(products);
        });
      });

      productsPromise.then((products) => {
        resolve({ orderId: row.id, email: row.mail, products: products, status: row.status });
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
