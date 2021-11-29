'use strict';

import db from './db.js';
import dayjs from 'dayjs';

/*
    Checks client balance before confirm their order.
    If balance < Tot. amount of the order the system will send a notification; also, the request state becomes 'pending_canc'.
    If balance >= Tot. amount of the order the request state becomes 'confirmed'.
*/
export function checksClientBalance() {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT U.email, R.id
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

            //Contains emails and request id obtained from the previous query
            const users_requests_under_balance = rows;

            const sql = `
                    SELECT R.id
                    FROM Request R, Product_Request PR, Product P, Client C
                    WHERE R.ref_client = C.ref_user AND PR.ref_request = R.id AND PR.ref_product = P.id 
                    AND R.status = 'pending'
                    AND C.balance >= (
                                        SELECT SUM(P1.price * PR1.quantity)
                                        FROM Product P1, Product_Request PR1
                                        WHERE PR1.ref_product = P1.id AND PR1.ref_request = R.id
                    );
                `;

            db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }

                //Contains requests obtained from previous query
                const requests_over_balance = rows;

                const sql = `UPDATE Request SET status = 'pending_canc' WHERE status = 'pending'`;

                db.run(sql, [], (err) => {
                    if(err){
                        reject(err);
                        return;
                    }

                    const sql = `UPDATE Request SET status = 'confirmed' WHERE id = ?`;

                    requests_over_balance.map((row) => {
                        db.run(sql, [row.id], (err) => {
                            if(err){
                                reject(err);
                                return;
                            }
                            
                        });
                    });

                    resolve(users_requests_under_balance);
                });
            });
        });
    });
}

export function test_addDummyOrders() {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Request WHERE id = 0 OR id = -1';

        db.serialize(() => {
            db.run(sql, [], (err) => {
                if (err) reject(err);
    
                const sql = `INSERT INTO Request(id, ref_client, status, date) VALUES (-1, 2, pending, ?)`;
                db.run(
                    sql,
                    [dayjs().format('YYYY-MM-DD HH:MM')],
                    function (err) {
                        const sql = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (-1,1,9999.0)`;
                        db.run(sql, [], function (err) {
                            if (err) {
                                reject(err);
                                return;
                            }
                        });
                    }
                );
            });
            db.run(sql, [], (err) => {
                if (err) reject(err);
    
                const sql = `INSERT INTO Request(id, ref_client, status, date) VALUES (-2, 2, pending, ?)`;
                db.run(
                    sql,
                    [dayjs().format('YYYY-MM-DD HH:MM')],
                    function (err) {
                        const sql = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (-2,2,0.1)`;
                        db.run(sql, [], function (err) {
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
}