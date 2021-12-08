'use strict';

import db from './db.js';
import dayjs from 'dayjs';

/**
 * Get the list of products
 * @returns products: [{id,name,description,category,name,price,quantity,unit, ref_farmer, farm_name}]
 */
export function listProducts(day) {
    return new Promise((resolve, reject) => {
        let date = dayjs(day).format('YYYY-MM-DD');
        date = date + " 00:00";

        const sql = `SELECT p.id, pd.name, pd.description, pd.category, p.quantity, p.price, pd.unit, pd.ref_farmer, f.farm_name
                     FROM Product p,
                          Prod_descriptor pd,
                          Farmer f
                     WHERE pd.id = p.ref_prod_descriptor 
                        AND pd.ref_farmer = f.ref_user
                        AND p.date >= DATE(?)`;
        db.all(sql, [date], (err, rows) => {
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
                farm_name: p.farm_name
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
 * Get the list of products linked to a farmer
 * @returns products: [{id,name,description,unit}]
 */
export function listFarmerProducts(farmerId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT pd.id, pd.name, pd.description, pd.unit
                     FROM 
                          Prod_descriptor pd,
                          Farmer f
                     WHERE pd.ref_farmer=? AND pd.ref_farmer = f.ref_user`;
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
 * @returns products: [{id,name,category, price,quantity,unit}]
 */
/* TODO add virtual clock*/
export function listSuppliedFarmerProducts(farmerId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT p.id, pd.name, pd.category, p.quantity, p.price, pd.unit
                     FROM Product p,
                          Prod_descriptor pd
                     WHERE pd.id = p.ref_prod_descriptor AND pd.ref_farmer=?`;
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
                price:p.price
            }));
            resolve(products);
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

/**
 * 
 * @param orderId 
 * @returns id of the order with it = orderId 
 */
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
 *  INSERT product quantity available for the next week
 *  @return products: [{productID, quantity, price}]
 */
export function addExpectedAvailableProduct(availableProduct){
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Product(ref_prod_descriptor,quantity, price, date ) VALUES (?, ?,?,?)`;
        db.run(sql, [availableProduct.productID, availableProduct.quantity, availableProduct.price, dayjs().format('YYYY-MM-DD HH:mm')], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            resolve("this.lastID");
        });
    });
}

/**
 *  DELETE product {productID} quantity available for the next week
 * @param productID
 */
export function removeExpectedAvailableProduct(product){
    console.log(product)
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM Product WHERE id=? `;
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

/**
 * Retrive the current balance of the user. 
 * 
 * @param {number} clientId - User id on the database.
 * @returns {Promise<number>} User's balance.
 */
export function getBalanceByClientId(clientId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT balance FROM Client WHERE ref_user = ?';

        db.get(sql, [clientId], (err, row) => (err ? reject(err) : resolve(row.balance)));
    });
}

/**
 * Make an order with the product corrently on basket. 
 * 
 * @param {number} clientId - User id on the database.
 * @param {object} basket - User's basket.
 * @param {number} balance - Current balance on user's wallet.
 * @returns {Promise<null>} 
 */
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
