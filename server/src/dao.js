"use strict";

import db from "./db.js";
import dayjs from "dayjs";

export function listProducts() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.id, pd.name, pd.description, pd.category, p.quantity, p.price
            FROM Product p, Prod_descriptor pd
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
      }));
      resolve(products);
    });
  });
}

export function listClients() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, name, surname, phone, address, mail, balance
            FROM  Client c`;
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
    db.run(sql, [orderClient.clientID, "confirmed", dayjs()], function (err) {
      var OrderID = this.lastID;
      if (err) {
        reject(err);
        return;
      }
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
              console.log(OrderID);
              resolve(OrderID);
            }
          });
        });
      });
    });
  });
}
