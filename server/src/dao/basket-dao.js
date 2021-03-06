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
      }
    });
    const sql2 = `UPDATE Product SET quantity = quantity - ? WHERE id = ?`;
    db.run(sql2, [quantity, productId], (err, rows) => {
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
    const sql1 = `SELECT quantity FROM Basket WHERE ref_client=? AND ref_product=?;`;
    db.get(sql1, [clientId, productId], (err, row) => {
      if (err) {
        reject(err);
      }

      if (row == undefined) {
        resolve("No product found");
        return;
      }

      const sql2 = `UPDATE Product SET quantity = quantity + ? WHERE id = ?`;
      db.run(sql2, [row.quantity, productId], (err1) => {
        if (err1) {
          reject(err1);
        }
      });
      const sql3 = `DELETE FROM Basket WHERE ref_client=? AND ref_product=? `;
      db.run(sql3, [clientId, productId], (err1) => {
        if (err1) {
          reject(err1);
        }
        resolve(productId);
      });
    });
  });
}

/**
 * (Used for testing purposes only)
 * Adds products in a client's basket for testing purposes.
 * 
 * @returns {Promise}
 * - resolved if operation is successful
 * - rejected otherwise
 */
export function test_addDummyBasketProducts() {
  return new Promise((resolve, reject) => {
    // delete basket products if present
    const sql = "DELETE FROM basket WHERE ref_product = 4 AND ref_client = 4;";

    db.run(sql, [], (err) => {
      if (err) {
        reject(err);
      }

      const sql1 = "INSERT INTO basket(ref_product, ref_client, quantity) VALUES (4, 4, 1.0);"

      db.run(sql1, [], (err1) => {
        if (err1) {
          reject(err1);
        }

        resolve(0);
      });
    });
  });
}
