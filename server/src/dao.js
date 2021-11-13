"use strict";

import db from "./db.js";
import dayjs from "dayjs";

export function listProducts() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.id, pd.name, pd.description, pd.category, p.quantity, p.price, pd.unit
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
        unit: p.unit
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
    db.run(sql, [orderClient.clientID, "confirmed", dayjs().format('YYYY-MM-DD HH:MM') ], function (err) {
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

export function insertClient(name, surname, phone, address, mail, balance = 0, username, password, role = 'client') {
    console.log(`inserting client ${name}`)
    return new Promise((resolve, reject) => {
        const clientQuery = 'INSERT INTO Client (name ,surname ,phone, address, mail, balance,ref_user) VALUES(? , ?, ?, ?, ?,?,?) ';
        const userQuery = 'INSERT INTO User (username ,password ,role) VALUES (? ,? , ?)'
        let userID;
        let clientID;
        db.serialize(() => {
            let stmt = db.prepare(userQuery)
            stmt.run([username, password, role], function (err) {
                if (err) {
                    reject(err)
                }
                userID = this.lastID;
                console.log(`newly created userID: ${userID}`)
                db.serialize(() => {
                    let stmt = db.prepare(clientQuery)
                    console.log(`hey from client query userID is ${userID}`)
                    stmt.run([name, surname, phone, address, mail, balance, userID], function (err) {
                        if (err) {
                            reject(err)
                        }
                        clientID = this.lastID
                        resolve(clientID)
                    })
                })
                resolve(userID)
            })
        })
    })

}