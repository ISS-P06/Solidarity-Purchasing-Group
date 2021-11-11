"use strict";

import db from "./db";

export function listProducts() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT p.id, pd.name, pd.description, pd.category, p.quantity, p.price, pd.unit
                     FROM Product p,
                          Prod_descriptor pd
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
                unit: p.unit,
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

export function insertClient(name, surname, phone, address, mail, balance = 0, username, password, role = 'client') {
    return new Promise((resolve, reject) => {
        const clientQuery = 'INSERT INTO Client (name ,surname ,phone, address, mail, balance,ref_user) VALUES(? , ?, ?, ?, ?,?,?) ';
        const userQuery = 'INSERT INTO User (username ,password ,role) VALUES (? ,? , ?)'
        let userID;
        db.serialize(() => {
            let stmt = db.prepare(userQuery)
            stmt.run([username, password, role], function (err) {
                if (err) {
                    reject(err)
                }
                userID = this.lastID;
                db.serialize(() => {
                    let stmt_1 = db.prepare(clientQuery)
                    stmt_1.run([name, surname, phone, address, mail, balance, userID], (err)=> {
                        if (err) {
                            reject(err)
                        }
                    })
                })
                resolve(this.lastID)
            })
        })
    })

}