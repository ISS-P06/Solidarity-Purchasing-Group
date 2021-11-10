"use strict";

import db from "./db";

export function listOrders() {
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