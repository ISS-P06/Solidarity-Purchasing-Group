'use strict';

import db from '../db';
import dayjs from 'dayjs';

/**
 * Get the list of products linked to a farmer
 *
 * @param {int} farmerId: the unique ID of the farmer
 * @returns products: [{id, name, description, unit}]
 */
export function listFarmerProducts(farmerId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT pd.id, pd.name, pd.description, pd.category, pd.unit
                FROM Prod_descriptor pd, Farmer f
                WHERE pd.ref_farmer=? 
                AND pd.ref_farmer = f.ref_user`;
    db.all(sql, [farmerId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const products = rows.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        unit: p.unit,
      }));
      resolve(products);
    });
  });
}

/**
 * Get the list of products supplied the next week linked to a farmer
 *
 * @param {int} farmerId: the unique ID of the farmer
 * @param {Date} day: day representing the day from which to filter; it's always a Wednesday as that's
 *      the day from which farmers are allowed to insert new products for the upcoming week.
 * @returns products: [{id,name,category, price,quantity,unit}]
 */
export function listSuppliedFarmerProducts(farmerId, day) {
  return new Promise((resolve, reject) => {
    // Convert day into a format readable by SQLite
    let date = dayjs(day).format('YYYY-MM-DD');
    date = date + ' 00:00';

    const sql = `SELECT p.id, pd.name, pd.category, p.quantity, p.price, pd.unit
                     FROM Product p,
                          Prod_descriptor pd
                     WHERE pd.id = p.ref_prod_descriptor 
                        AND pd.ref_farmer=?
                        AND p.date >= DATE(?)`;
    db.all(sql, [farmerId, date], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const products = rows.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        quantity: p.quantity,
        unit: p.unit,
        price: p.price,
      }));
      resolve(products);
    });
  });
}

/**
 * Adds a dummy product supply for testing purposes.
 */
export function test_addDummyProductSupplies() {
  return new Promise((resolve, reject) => {
    const date = dayjs(new Date("January, 3 2999 00:00:00")).format('YYYY-MM-DD HH:mm');

    // delete all products with dummy ids
    db.run("DELETE FROM prod_descriptor WHERE name = 'equijoin'", [], (err) => {
      if (err) reject(err);

      // insert dummy product descriptor
      db.run(`INSERT INTO prod_descriptor(name, description, category, unit, ref_farmer) 
        VALUES ('equijoin', 'unica operazione ammissibile', 'meats_cold_cuts', 'kg', 3);`, [], 
        function (err1) {
            if (err1) reject(err1);
            const id = this.lastID;

            // insert dummy product supply
            db.run(`INSERT INTO Product(ref_prod_descriptor, quantity, price, date) 
            VALUES (?, 1, 39, DATE(?));`, [id, date], (err2) => {
                if (err2) reject(err2);

                resolve('ok');
              });
          });
      });
  });
}
