'use strict';

import db from '../db';

/**
 * Get the list of products linked to a farmer
 *
 * @param {int} farmerId: the unique ID of the farmer
 * @returns products: [{id, name, description, unit}]
 */
export function listFarmerProducts(farmerId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT pd.id, pd.name, pd.description, pd.unit
                     FROM Prod_descriptor pd,
                          Farmer f
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
 * @returns products: [{id,name,category, price,quantity,unit}]
 */
/* TODO add virtual clock*/
export function listSuppliedFarmerProducts(farmerId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.id, pd.name, pd.category, p.quantity, p.price, pd.unit
                     FROM Product p,
                          Prod_descriptor pd
                     WHERE pd.id = p.ref_prod_descriptor 
                        AND pd.ref_farmer=?`;
    db.all(sql, [farmerId], (err, rows) => {
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
