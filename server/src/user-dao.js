'use strict';

import db from './db.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;

// --- Get user info by providing username and password
export function getUser(username, password) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE username=?;';
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
    const sql = 'SELECT * FROM user WHERE id=?;';
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
