'use strict';

import db from '../db';
import dayjs from 'dayjs';
import VTC from '../utils/vtc';

const vtc = new VTC();

/**
 * Returns the list of products available for the next week.
 *
 * @param {Date} day: date representing the start of the week; it's always a Wednesday as that's
 *      the day from which farmers are allowed to insert new products for the upcoming week.
 * @returns products: [{id, name, description, category, name, price, quantity, unit, ref_farmer, farm_name}]
 */
export function listProducts(day) {
  return new Promise((resolve, reject) => {
    // Convert day into a format readable by SQLite
    let date = dayjs(day).format('YYYY-MM-DD');
    date = date + ' 00:00';
    let endDate = dayjs(day).add(3, 'day').format('YYYY-MM-DD');
    endDate = endDate + ' 09:00';

    const sql = `SELECT p.id, pd.name, pd.description, pd.category, p.quantity, p.price, pd.unit, pd.ref_farmer, f.farm_name
                     FROM Product p,
                        Prod_descriptor pd,
                        Farmer f
                     WHERE pd.id = p.ref_prod_descriptor 
                        AND pd.ref_farmer = f.ref_user
                        AND p.date >= DATE(?) AND p.date < DATE(?)`;

    db.all(sql, [date, endDate], (err, rows) => {
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
        ref_farmer: p.ref_farmer,
        farm_name: p.farm_name,
      }));
      resolve(products);
    });
  });
}

/**
 *  INSERT product quantity available for the next week.
 *
 *  @param {Object} availableProduct: object containing info about the product to add.
 *  @return {Promise<any>}: the unique ID of the added product.
 */
export function addExpectedAvailableProduct(availableProduct) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Product(ref_prod_descriptor, quantity, price, date) VALUES (?, ?, ?, ?)`;
    db.run(
      sql,
      [
        availableProduct.productID,
        availableProduct.quantity,
        availableProduct.price,
        dayjs(vtc.time()).format('YYYY-MM-DD HH:mm'),
      ],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(availableProduct);
      }
    );
  });
}

/**
 * DELETE product {productID} quantity available for the next week.
 *
 * @param {int} productID: the unique ID of the product to remove.
 * @returns {Promise<int>}: the same ID passed as a parameter.
 */
export function removeExpectedAvailableProduct(product) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Product WHERE id=?`;
    db.run(sql, [product.productID], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(product.productID);
    });
  });
}

/**
 * method to insert a new product description through a farmer
 * @param description: is an object with {name ,description ,category ,unit , ref_farmer}
 * @returns {Promise<null>}
 */
export function insertProductDescription(description) {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO Prod_descriptor(name, description, category, unit, ref_farmer) VALUES(?,?,?,?,?)';
    db.run(
      sql,
      [
        description.name,
        description.description,
        description.category,
        description.unit,
        description.ref_farmer,
      ],
      function (err) {
        if (err) reject(err);
        else resolve('ok');
      }
    );
  });
}

/**
 * Get information of a single product from pruduct id
 *
 * @param {int} productID
 * @returns {Promise<any>}
 */
export function getProductByID(productID) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Prod_Descriptor WHERE id = ?';

    db.get(sql, [productID], (err, row) => (err ? reject(err) : resolve(row)));
  });
}
