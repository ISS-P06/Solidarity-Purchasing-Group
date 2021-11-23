'use strict';

import db from './db.js';

/*
    Checks client balance before confirm their order.
    If balance < Tot. amount of the order the system will send a notification; also, the request state becomes 'pending_canc'.
    If balance >= Tot. amount of the order the request state becomes 'confirmed'.
*/
export function checksClientBalance() {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT C.email, R.id
                    FROM Request R, Product_Request PR, Product P, Client C
                    WHERE R.ref_client = C.id AND PR.ref_request = R.id AND PR.ref_product = P.id 
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
                    WHERE R.ref_client = C.id AND PR.ref_request = R.id AND PR.ref_product = P.id 
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
