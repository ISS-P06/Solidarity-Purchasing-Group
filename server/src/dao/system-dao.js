'use strict';

import db from '../db';
import dayjs from 'dayjs';

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

/**
 * Function that is used to change the orders state from 'confirmed' to 'unretrieved'
 * @returns {Promise}
 */
export function setUndeliveredOrders() {
  return new Promise((resolve, reject) => {
      const sql = " UPDATE Request SET status = 'unretrieved' WHERE status = 'confirmed'";
      db.run(sql, [], (err) => {
        if (err) {
          reject(err);
          return;
        }
      });
      resolve();
  });
}
