'use strict';

import db from '../db';

/**
 * Retrive all the products from the user's basket.
 *
 * @param {number} clientId - User id on the database.
 * @returns {Promise<Array>} An array with all the products on the user's basket.
 */
export function getBasketByClientId(clientId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.id, pd.name, pd.category, b.quantity, p.price, pd.unit
                     FROM Product p, Basket b, Prod_descriptor pd
                     WHERE p.id = b.ref_product
                     AND pd.id = p.ref_prod_descriptor
                     AND b.ref_client = ?`;
    db.all(sql, [clientId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const products = rows.map((p) => ({
        productId: p.id,
        name: p.name,
        category: p.category,
        quantity: p.quantity,
        price: p.price,
        unit: p.unit,
      }));
      resolve(products);
    });
  });
}

/**
 * Insert a product to the user's basket.
 *
 * @param {number} clientId - User id on the database.
 * @param {number} productId - Product id on the database.
 * @returns {Promise<number>} The id of the product added.
 */
export function addProductToBasket(clientId, productId, quantity) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Basket(ref_client, ref_product,quantity) VALUES (?, ?,?)`;
    db.run(sql, [clientId, productId, quantity], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(productId);
    });
  });
}

/**
 * Remove a product from the user's basket.
 *
 * @param {number} clientId - User id on the database.
 * @param {number} productId - Product id on the database.
 * @returns {Promise<number>} The id of the product removed.
 */
export function removeProductFromBasket(clientId, productId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Basket WHERE ref_client=? AND ref_product=? `;
    db.run(sql, [clientId, productId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(productId);
    });
  });
}
