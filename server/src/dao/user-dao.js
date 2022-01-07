'use strict';

import db from '../db.js';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import VTC from '../utils/vtc.js';

const vtc = new VTC();

// --- Get user info by providing username and password
export function getUser(username, password) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM User WHERE username=?;';
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject({ msg: 'Connection problem, please try again later.' });
        return;
      }
      if (row == undefined) {
        resolve(false);
      } else {
        bcrypt.compare(password, row.password, (err1, same) => {
          if (err1) {
            reject(err1);
            return;
          }

          if (same) {
            const user = {
              id: row.id,
              username: row.username,
              role: row.role,
            };
            resolve(user);
          } else {
            reject({ msg: 'Incorrect username and/or password.' });
          }
        });
      }
    });
  });
}

// --- Get user info by providing the user id
export function getUserById(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM User WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      const role = row.role;
      if (row == undefined) {
        resolve(false);
      } else {
        const user = {
          id: row.id,
          username: row.username,
          role: row.role,
          name: row.name,
          surname: row.surname,
          email: row.email,
          phone: row.phone,
        };
        if (role === 'farmer') {
          const sql1 = 'SELECT * FROM farmer WHERE ref_user=?;';
          db.get(sql1, [id], (err1, row1) => {
            if (err1) {
              reject(err1);
              return;
            }
            if (row1 == undefined) {
              resolve(false);
            } else {
              user.address = row1.address;
              user.farm_name = row1.farm_name;
              resolve(user);
            }
          });
        } else if (role === 'client') {
          const sql1 = 'SELECT * FROM client WHERE ref_user=?;';
          db.get(sql1, [id], (err1, row1) => {
            if (err1) {
              reject(err1);
              return;
            }
            if (row1 == undefined) {
              resolve(false);
            } else {
              user.address = row1.address;
              user.balance = row1.balance;
              resolve(user);
            }
          });
        } else {
          resolve(user);
        }
      }
    });
  });
}

/**
 * Register the user
 * @param user
 * @returns id of the user added
 */
export function registerUser(user) {
  return new Promise((resolve, reject) => {
    const userQuery =
      'INSERT INTO User (username ,password ,role, name, surname, email, phone) VALUES ( ?, ?, ?, ?, ?, ?, ?)';

    db.serialize(() => {
      let stmt = db.prepare(userQuery);
      bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
          reject(err);
        }

        stmt.run(
          [user.username, hash, user.typeUser, user.name, user.surname, user.mail, user.phone],
          function (err1) {
            if (err1) {
              reject(err1);
            }

            const userID = this.lastID;
            if (user.typeUser === 'shop_employee') {
              resolve(this.lastID);
            } else if (user.typeUser === 'farmer') {
              const farmerQuery =
                'INSERT INTO Farmer (ref_user , address , farm_name) VALUES (?, ?, ?)';
              db.serialize(() => {
                let stmt_1 = db.prepare(farmerQuery);
                stmt_1.run([userID, user.address, user.farmName], function (err2) {
                  if (err2) {
                    reject(err2);
                  }
                });
              });
              resolve(userID);
            } else if (user.typeUser === 'client') {
              const clientQuery =
                'INSERT INTO Client (address, balance, ref_user, missed_pickups) VALUES( ?, ?, ?, 0) ';
              db.serialize(() => {
                let stmt_1 = db.prepare(clientQuery);
                stmt_1.run([user.address, user.balance, userID], (err2) => {
                  if (err2) {
                    reject(err2);
                  }
                });
              });
              resolve(userID);
            }
          }
        );
      });
    });
  });
}


// Get all the entrise of a give user suspensions
export function getUserSuspensionsById(id) {
  return new Promise((resolve, reject) => {
    let currTime = new Date(vtc.time());
    let date = dayjs(currTime).format('YYYY-MM-DD HH:mm');
    console.log(date);
    const sql = 'SELECT s.ref_client FROM Suspension s WHERE ref_client=? AND s.start_date <= DATE(?) AND s.end_date > DATE(?)';
    db.get(sql, [id, date, date], (err, row) => {
      console.log(err);
      if (err) {
        reject(err);
        return;
      }
      console.log(row);
      if(row != undefined)
        resolve(true);
        else
        resolve(false);
    });
  });
}