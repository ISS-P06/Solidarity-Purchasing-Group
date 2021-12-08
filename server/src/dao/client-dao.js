'use strict';

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
      err ? reject(err) : resolve(null);
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
