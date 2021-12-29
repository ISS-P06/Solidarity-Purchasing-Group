'use strict';

import db from '../db';
import dayjs from 'dayjs';
import {clientDAO, orderDAO} from '.';

/**
 * Set all "pending_canc" orders to "cancelled" 
 * 
 * @returns {Promise}
 * - Returns a resolved promise if the operation is successful, a rejected one otherwise
 */
export function cancelPendingCancOrders() {
  return new Promise((resolve, reject) => {
    const sql = `
        UPDATE request
        SET status = 'cancelled'
        WHERE status = 'pending_canc';
      `;

    db.run(sql, [], (err) => {
      err? reject(err) : resolve("ok");
    })
  });
}


/**
 * Deletes all tuples from the "Basket" table from the DB.
 *
 * @returns {Promise}
 *  - Returns a resolved promise if the operation is successful, a rejected one otherwise
 */
export function emptyBaskets() {
    return new Promise((resolve, reject) => {
        // Delete all tuples from the table
        const sql = 'DELETE FROM Basket;';

        db.run(sql, [], (err) => {
            if (err) reject(err);

            resolve('ok');
        });
    });
}

/**
 * (Used only for testing purposes)
 * Adds two dummy orders with negative IDs to test insufficient balance reminders and
 * order confirmation.
 *
 * @returns Promise; 0 if resolved, error message if rejected.
 */
export function test_addDummyOrders() {
    return new Promise((resolve, reject) => {
        // Delete pre-existing dummy orders if present
        const sql = 'DELETE FROM Request WHERE id = -2 OR id = -1';

        db.run(sql, [], (err) => {
            if (err) reject(err);

            const sql2 = 'DELETE FROM Product_Request WHERE ref_request = -1 OR ref_request = -2;';

            db.run(sql2, [], (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Serialize queries
                db.serialize(() => {
                    db.run(
                        `INSERT INTO Request(id, ref_client, status, date) VALUES (-1, 2, pending, ?)`,
                        [dayjs().format('YYYY-MM-DD HH:MM')],
                        function (err) {
                            const sql3 = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (-1,1,9999.0)`;
                            db.run(sql3, [], function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                            });
                        }
                    );
                    db.run(
                        `INSERT INTO Request(id, ref_client, status, date) VALUES (-2, 2, pending, ?)`,
                        [dayjs().format('YYYY-MM-DD HH:MM')],
                        function (err) {
                            const sql4 = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (-2,2,0.1)`;
                            db.run(sql4, [], function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                resolve(0);
                            });
                        }
                    );
                });
            });
        });
    });
}

/**
 * This function returns the emails and userIDs of all the users who 
 * have orders in "pending_canc" status in order to send email notifications.
 * 
 * @returns {Promise}
 *  - The promise with the mailList of users to send notifications to
 */
 export function getClientEmailsForReminder() {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT DISTINCT U.email, R.id
        FROM Request R, Client C, User U
        WHERE R.ref_client = C.ref_user
            AND C.ref_user = U.id 
        AND R.status = 'pending_canc';
      `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const users_requests_under_balance = rows;
      //Contains emails and request id obtained from the previous query
      resolve(users_requests_under_balance)
    });
  });

}

export function checksClientBalance() {
    const fee = 10.0;
    return new Promise((resolve, reject) => {
        getClientsOrders().then(orders => {
            orders.forEach(order => {
                clientDAO.getBalanceByClientId(order.clientId).then((balance) => {
                    getDeliveryByRequestId(order.requestId).then((rid) => {
                        if (rid !== undefined) { // delivery
                            if (balance >= order.total + fee) {// 10 euro fee
                                clientDAO.updateClientBalance(order.clientId, -order.total - fee);
                                orderDAO.setOrderStatus(order.requestId, 'confirmed');
                            } else {
                                orderDAO.setOrderStatus(order.requestId, 'pending_canc');
                            }
                        } else { // no delivery
                            if (balance >= order.total) {
                                clientDAO.updateClientBalance(order.clientId, -order.total);
                                orderDAO.setOrderStatus(order.requestId, 'confirmed');
                            } else {
                                orderDAO.setOrderStatus(order.requestId, 'pending_canc');
                            }
                        }
                    });
                });
            });
        });
        getPendingOrdersWithUnderBalance().then((mailList) => resolve(mailList));
    });
}

function getClientsOrders() {
    return new Promise((resolve, reject) => {

        const sql = `
                  SELECT r.id, r.ref_client, SUM(pr.quantity * p.price) AS total
                  FROM Client c, Product_Request pr, Request r, Product p
                  WHERE c.ref_user = r.ref_client 
                  AND r.id = pr.ref_request
                  AND pr.ref_product = p.id
                  AND r.status = 'pending'
                  GROUP BY r.id
                  `;

        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            const orders = rows.map((o) => ({
                requestId: o.id,
                clientId: o.ref_client,
                total: o.total
            }));
            resolve(orders)
        });
    });
}

function getPendingOrdersWithUnderBalance() {
    return new Promise((resolve, reject) => {

        const sql = `
                      SELECT DISTINCT U.email, R.id
                      FROM Request R, Product_Request PR, Product P, Client C, User U
                      WHERE R.ref_client = C.ref_user AND PR.ref_request = R.id AND PR.ref_product = P.id
                          AND C.ref_user = U.id 
                      AND R.status = 'pending'
                      AND C.balance < (
                                          SELECT SUM(P1.price * PR1.quantity)
                                          FROM Product P1, Product_Request PR1
                                          WHERE PR1.ref_product = P1.id AND PR1.ref_request = R.id
                      );
                  `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const users_requests_under_balance = rows;
            //Contains emails and request id obtained from the previous query
            resolve(users_requests_under_balance)
        });
    })
}

function getDeliveryByRequestId(requestId) {
    return new Promise((resolve, reject) => {

        const sql = `
                  SELECT d.ref_request
                  FROM Delivery d
                  WHERE d.ref_request = ?;
                  `;

        db.get(sql, [requestId], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

/**
 * Function that is used to change the orders state from 'confirmed' to 'unretrieved' and update the number of missed pickups for each client
 * @returns {Promise}
 */

export function setUndeliveredOrders() {
    return new Promise((resolve, reject) => {
        // the query returns for each client the number of missed pick up
        const sql = `SELECT r.ref_client as ref_client, count(*) as nMissedPickUp
            FROM Request r
            WHERE r.status = 'confirmed'
            GROUP BY r.ref_client`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const sql2 = " UPDATE Request SET status = 'unretrieved' WHERE status = 'confirmed'";
            db.run(sql2, [], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
            });

            rows.length >= 0 && rows.map((row, index) => {
                // increment the number of missed picks up for a client
                const sql1 = " UPDATE Client SET missed_pickups = missed_pickups+? WHERE ref_user = ?";
                db.run(sql1, [row.nMissedPickUp, row.ref_client], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                   if(index+1===rows.length){
                       resolve(rows);
                   }
                });
            })
        });
    })
}

 /**
 * (Used only for testing purposes)
 * Adds a dummy order with negative ID to test the trigger to change the order status
 * from confirmed to unretrieved
 *
 * @returns Promise; 0 if resolved, error message if rejected.
 */
export function test_addConfirmedDummyOrders() {
  return new Promise((resolve, reject) => {
    // Delete pre-existing dummy orders if present
    const sql = 'DELETE FROM Request WHERE id = -1';

    db.run(sql, [], (err) => {
      if (err) reject(err);

      const sql2 = 'DELETE FROM Product_Request WHERE ref_request = -1;';

      db.run(sql2, [], (err1) => {
        if (err1) {
          reject(err1);
          return;
        }

        // Serialize queries
        db.serialize(() => {
          db.run(
            `INSERT INTO Request(id, ref_client, status, date) VALUES (-1, 2, 'confirmed', ?)`,
            [dayjs("2022-01-01 17:00", "YYYY-MM-DD HH:MM").format('YYYY-MM-DD HH:MM')],
            function (err2) {
              if (err2) reject(err2);
              const sql3 = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (-1,1,9999.0)`;
              db.run(sql3, [], function (err3) {
                if (err3) {
                  reject(err3);
                  return;
                }

                resolve(0);
              });
            }
          );
        });
      });
    });
  });
}
    
/**
 * Function that is used to suspend clients with a number of missed pick up greather than 5
 * @returns {Promise}
 */

export function suspendClients() {
    return new Promise((resolve, reject) => {
        // the query return for each client the number of missed pick ups
        const sql = `SELECT ref_user as userID, missed_pickups as missed_pickups
            FROM Client c
            WHERE c.missed_pickups>5`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            rows.length >= 0 && rows.map((row, index) => {
                // increment the number of missed picks up for a client
                const sql1 = " INSERT INTO Suspension (ref_client, start_date, end_date) VALUES (?,?,?)";
                /!*TODO to update*!/
                db.run(sql1, [row.userID, dayjs().format('YYYY-MM-DD'), dayjs().add(1, "month").format('YYYY-MM-DD')], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            })
        });
    });
}
