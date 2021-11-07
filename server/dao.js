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

export function listClients() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, name, surname, phone, address, mail, balance
            FROM  Client c`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const clients = rows.map((c) => ({ id: c.id, name: c.name, surname: c.surname, phone:c.phone , address:c.address, mail:c.mail, balance:c.balance }));
            resolve(clients);
        });
    });
}