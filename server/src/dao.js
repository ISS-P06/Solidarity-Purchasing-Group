"use strict";

import db from "./db";

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
        email: p.mail
      }));
      resolve(orders);
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

    db.get(sql, orderId, function (err,row) {
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
        resolve({"orderId": row.id, "email": row.mail, "products": products, "status": row.status})});

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