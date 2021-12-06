'use strict';

import db from './db.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;

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
        bcrypt.compare(password, row.password, (err, same) => {
          if (err) {
            reject(err);
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
      const role=row.role;
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
        if (role === "farmer") {
          const sql = 'SELECT * FROM farmer WHERE ref_user=?;';
          db.get(sql, [id], (err, row) => {
            if (err) {

              reject(err);
              return;
            }
            if (row == undefined) {
              resolve(false);
            } else {
              user.address = row.address;
              user.farm_name = row.farm_name;
              resolve(user);
            }
          })
        } else if (role === "client") {
          const sql = 'SELECT * FROM client WHERE ref_user=?;';
          db.get(sql, [id], (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            if (row == undefined) {
              resolve(false);
            } else {
              user.address = row.address;
              user.balance = row.balance;
              resolve(user);
            }
          })
        } else if (role === "shop_employee") {
          resolve(user);
        }
      }
    })
    });
  }

/**
 * Register the user
 * @param user
 * @returns id of the user added
 */
export function registerUser(user) {
  return new Promise((resolve, reject) => {
    let userID;

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
            function (err) {
              if (err) {
                console.log(err);
                reject(err);
              }
              console.log( this.lastID)
              const userID = this.lastID;
              if (user.typeUser === 'shop_employee') {
                resolve(this.lastID);
              } else if (user.typeUser === 'farmer') {
                const farmerQuery = 'INSERT INTO Farmer (ref_user , address , farm_name) VALUES (?, ?, ?)';
                db.serialize(() => {
                  let stmt_1 = db.prepare(farmerQuery);
                  stmt_1.run([userID, user.address, user.farmName], function (err) {
                    if (err) {
                      reject(err);
                    }

                  });
                });
                resolve(userID);
              } else if (user.typeUser === 'client') {
                const clientQuery = 'INSERT INTO Client (address, balance, ref_user) VALUES( ?, ?, ?) ';
                db.serialize(() => {
                  let stmt_1 = db.prepare(clientQuery);
                  stmt_1.run([user.address, user.balance, userID], (err) => {
                    if (err) {
                      reject(err);
                    }
                  });
                });
                console.log(userID)
                resolve(userID);
              }
            });
      });
    })
  })
}