'use strict';

import { orderDAO } from '.';
import db from '../db';

/**
 * Get the list of client
 * @returns list of clients
 */
export function listClients() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT u.id, u.name, u.surname, u.email, 
                        u.phone, c.address, c.balance
                    FROM Client c, User u
                    WHERE u.id = c.ref_user`;
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
      if (err) {
        reject(err)
      } 
      
      checkOrdersAfterTopUp(id)
        .then()
        .catch((err) => reject(err));

      resolve(null);
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
 * This function checks each of a client's orders to see if their status can be updated
 * after a top-up of the client's wallet.
 * 
 * @param {int} clientID: the client's unique ID 
 * @returns Promise; recolved if the operation is successful, rejected otherwise
 */
export function checkOrdersAfterTopUp(clientID) {
  return new Promise(async (resolve, reject) => {
    const sql = `
        SELECT R.id AS orderID
        FROM request R
        WHERE R.ref_client = ?
          AND status = 'pending_canc'
        ORDER BY R.date;
      `;

    /*
      Note: orders are sorted by date so that they are checked in order
    */

    db.all(sql, [clientID], async (err, rows) => {
      if (err) {
        reject(err);
      }

      if (rows.length === 0) {
        resolve("no orders found");
      }

      // For each order, check whether the balance is sufficient and change its status
      for (let r in rows) {
        try {
          await orderDAO.checkBalanceAndSetStatus(r.orderID);
        }
        catch(err) {
          reject(err);
        }
      }

      resolve("ok");
    });
  });
}
