'use strict';

import db from './db.js';
import dayjs from 'dayjs';

/**
 * Get the list of products
 * @returns products: [{id,name,description,category,name,price,quantity,unit}]
 */
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

/**
 * Get the list of client
 * @returns list of clients
 */
export function listClients() {
    return new Promise((resolve, reject) => {
        const sql = `    SELECT u.id, u.name, u.surname, u.email, u.phone, c.address, c.balance
                     FROM Client c, User u
                     WHERE u.id = c.ref_user `;
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
                mail: c.email,
                balance: c.balance,
            }));
            resolve(clients);
        });
    });
}

/**
 * Update current balance of a client
 *
 * @param {int} id      Client id.
 * @param {int} amount  Amount of money to add on client's balance.
 */

export function updateClientBalance(id, amount) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Client SET balance = balance + ? WHERE ref_user = ?`;
        db.run(sql, [amount, id], (err) => {
            err ? reject(err) : resolve(null);
        });
    });
}

/**
 * add an order
 * @param orderClient
 * @returns id of the order
 */
export function insertOrder(orderClient) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Request(ref_client, status,date) VALUES (?, ?,?)`;
        db.run(
            sql,
            [orderClient.clientID, 'pending', dayjs().format('YYYY-MM-DD HH:MM')],
            function (err) {
                var OrderID = this.lastID;
                orderClient.order.map((product, index) => {
                    const sql = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (?,?,?)`;
                    db.run(sql, [OrderID, product.id, product.quantity], function (err) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const sql = `UPDATE Product SET quantity=quantity-? WHERE id=?`;
                        db.run(sql, [product.quantity, product.id], function (err) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            if (orderClient.order.length === index + 1) {
                                resolve(OrderID);
                            }
                        });
                    });
                });
            }
        );
    });
}






//UPDATED
// clientId can be specified or not
// if specified the query selects only orders of a specific client
export function getOrders(clientId = -1) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT r.id, u.email, r.date, r.status
            FROM Request r, Client c, User u
            WHERE r.ref_client = c.ref_user AND c.ref_user = u.id`;
        let deps = [];
        if (clientId !== -1) {
            sql += ` AND u.id = ?`;
            deps.push(clientId);
        }
        db.all(sql, deps, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const orders = rows.map((p) => ({
                orderId: p.id,
                email: p.email,
                date: p.date,
                status: p.status,
            }));
            resolve(orders);
        });
    });
}

//UPDATED
export function getOrder(orderId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT r.id
            FROM Request r
            WHERE r.id = ?`;
        db.get(sql, [orderId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.id);
        });
    });
}

//UPDATED
// clientId can be specified or not
// if specified the query selects only the order of a specific client
export function getOrderById(orderId, clientId = -1) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT r.id, u.email, r.status, r.date, c.address, u.username, u.name, u.surname, u.role, u.phone
                  FROM Request r, Client c, User u
                  WHERE r.ref_client = c.ref_user AND c.ref_user = u.id
                    AND r.id=?`;

        const sql2 = `SELECT pd.name, pr.quantity, p.price, pd.unit
                  FROM Request r, Product_Request pr, Product p, Prod_descriptor pd
                  WHERE r.id = pr.ref_request 
                    AND pr.ref_product = p.id 
                    AND p.ref_prod_descriptor = pd.id
                    AND r.id=?`;

        let deps = [orderId];
        if (clientId !== -1) {
            sql += ` AND u.id = ?`;
            deps.push(clientId);
        }

        db.get(sql, deps, function (err, row) {
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
                        unit: p.unit,
                    }));
                    resolve(products);
                });
            });

            productsPromise.then((products) => {
                resolve({
                    orderId: row.id,
                    date: row.date,
                    status: row.status,
                    email: row.email,
                    username: row.username,
                    role: row.role,
                    name: row.name,
                    surname: row.surname,
                    phone: row.phone,
                    address: row.address,
                    products: products,
                });
            });
        });
    });
}

//UPDATED
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

export function addProductToBasket(clientId, productId, quantity) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Basket(ref_client, ref_product,quantity) VALUES (?, ?,?)`;
        db.run(sql, [clientId, productId, quantity], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(productId);
        });
    });
}

export function removeProductFromBasket(clientId, productId) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM Basket WHERE ref_client=? AND ref_product=? `;
        db.run(sql, [clientId, productId], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(productId);
        });
    });
}

export function getBalanceByClientId(clientId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT balance FROM Client WHERE ref_user = ?';

        db.get(sql, [clientId], (err, row) => (err ? reject(err) : resolve(row.balance)));
    });
}

export function insertOrderFromBasket(clientId, basket, balance, date) {
    return new Promise((resolve, reject) => {
        const totalAmount = basket
            .map((p) => p.price * p.quantity)
            .reduce((a, b) => a + b, 0)
            .toFixed(2);

        const status = totalAmount <= balance ? 'confirmed' : 'pending_canc';

        const sql = 'INSERT INTO Request(ref_client, status, date) VALUES(?, ?, ?)';

        db.run(sql, [clientId, status, date], (err) => (err ? reject(err) : resolve(null)));
    });
}
