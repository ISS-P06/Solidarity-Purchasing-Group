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
            reject({msg: "Connection problem, please try again later."});
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
                        const user = 
                            { 
                                id: row.id, 
                                username: row.username,
                                role: row.role
                            };
                        resolve(user);
                    }
                    else {
                        reject({msg: "Incorrect username and/or password."});
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
        if (row == undefined) {
            resolve(false);
        } else {
            const user = 
                { 
                    id: row.id, 
                    username: row.username,
                    role: row.role
                };
            resolve(user);
        }
        });
    });
}

// --- Add a new user
// (used for testing purposes only)
export function test_createUser(user) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.password, saltRounds, (err, encr) => {
            if (err) {
                reject(err);
                return;
            }

            const sql = `
                INSERT INTO user(username, password, role) VALUES (
                    ?, ?, ?);
                `;
            db.run(sql, [user.username,
                        encr,
                        user.role], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
};