'use strict';

import db from './db.js';

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
            const products = rows.map((p) => ({ id: p.id, name: p.name, description: p.description, category: p.category, quantity: p.quantity, price: p.price }));
            resolve(products);
        });
    });
}