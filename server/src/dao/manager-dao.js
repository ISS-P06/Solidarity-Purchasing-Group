'use strict';

import db from '../db';
import dayjs from 'dayjs';
import VTC from '../utils/vtc';

const vtc = new VTC();

/**
 * This file contains all queries related to the manager's
 * functions, such as weekly/monthly reports.
 */

/**
 * Notes on reports:
 * - all orders can be set to "delivered" until Friday evening. After that moment,
 *      all orders with "confirmed" status are automatically set to "unretrieved"
 * - for the purpose of generating a weekly report, the week starts on Saturday
 *      and ends on Friday.
 */

// --- Methods --- //
/**
 * Computes the start and end dates for the week in which the input date is in.
 * The start date is always a Saturday at 00:00, while the end date is always a Friday
 * at 23:59.
 * 
 * @param {Date} date: input date 
 * @returns {Object} containing startDate and endDate
 */
function computeWeek(date) {
    let startDate = new Date(date);

    // 0 = Sunday => Saturday = 6
    while (startDate.getDay() != 6) {
        startDate.setDate(startDate.getDate() - 1);
    }

    let endDate = new Date(date);

    // 0 = Sunday => Friday = 5
    while (endDate.getDay() != 5) {
        endDate.setDate(endDate.getDate() + 1);
    }
    
    let start = dayjs(startDate).format('YYYY-MM-DD');
    start = start + ' 00:00';

    let end = dayjs(endDate).format('YYYY-MM-DD');
    end = end + ' 23:59';


    return [ start, end ];
}

/**
 * Computes the start and end dates for the month in which the input date is in.
 * The end date will always be the end of the input date's day (i.e. that day at 23:59)
 * 
 * @param {Date} date: input date 
 * @returns {Object} containing startDate and endDate
 */
function computeMonth(date) {
    let startDate = dayjs(date).format("YYYY-MM") + "-01 00:00";

    let lastDay = "";
    switch(date.getMonth() + 1) {
        case 11:
        case 4:
        case 6:
        case 9:
            lastDay = "30";
            break;
        case 2:
            let year = date.getFullYear();
            if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
                lastDay = "29";
            }
            else {
                lastDay = "28";
            }            
            break;
        default: 
            lastDay = "31";
            break;
    }

    let endDate = dayjs(date).format("YYYY-MM") + "-" + lastDay + " 23:59";

    return [ startDate, endDate ];
}

/**
 * Generates a report for orders made between the two given dates.
 * 
 * @param {Date} startDate: starting date for the report 
 * @param {Date} endDate: end date for the report
 * @returns 
 */
function computeReport(startDate, endDate) {
    return new Promise((resolve, reject) => {
        const sql = `
                SELECT status, COUNT(DISTINCT R.id) AS n, SUM(PR.quantity) AS totQuantity
                FROM request R, product_request PR
                WHERE R.id = PR.ref_request
                    AND R.date >= DATE(?)
                    AND R.date < DATE(?)
                GROUP BY status;
            `;

        db.all(sql, [startDate, endDate], (err, rows) => {
            if (err) {
                reject(err);
            }

            let stats = rows.filter((r) => (r.status === "delivered" || r.status === "unretrieved"));

            let deliveredOrders = 0;
            let deliveredFood = 0.0;
            let undeliveredOrders = 0;
            let undeliveredFood = 0.0;

            for (let s of stats) {
                if (s.status === "delivered") {
                    deliveredOrders = s.n;
                    deliveredFood = s.totQuantity;
                }
                else {
                    undeliveredOrders = s.n;
                    undeliveredFood = s.totQuantity;
                }
            }

            let totalOrders = deliveredOrders + undeliveredOrders;
            let totalFood = deliveredFood + undeliveredFood;

            let result = {
                totalOrders: totalOrders,
                deliveredOrders: deliveredOrders,
                undeliveredOrders: undeliveredOrders,
                totalFood: totalFood,
                deliveredFood: deliveredFood,
                undeliveredFood: undeliveredFood,
                perc_undeliveredOrd: undeliveredOrders / totalOrders,
                perc_deliveredOrd: deliveredOrders / totalOrders,
                perc_undeliveredFood: undeliveredFood / totalFood,
                perc_deliveredFood: deliveredFood / totalFood,
            };

            resolve(result);
        });
    });
}

// --- Exports --- //
/**
 * Generate a weekly report given a date in input.
 * 
 * @param {Date} date: a date included in the week the report has to be generated for 
 * @returns {Object} an object containing various statistics about retrieved and unretrieved orders
 */
export function generateWeeklyReport(date) {
    return new Promise((resolve, reject) => {
        // Compute the start and end dates for the week
        // that contains the inserted date
        let date_array = computeWeek(date);

        let startDate = date_array[0];
        let endDate = date_array[1];

        computeReport(startDate, endDate)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};

/**
 * Generate a monthly report given a date in input.
 * 
 * @param {Date} date: a date included in the month the report has to be generated for 
 * @returns {Object} an object containing various statistics about retrieved and unretrieved orders
 */
export function generateMonthlyReport(date) {
    return new Promise((resolve, reject) => {
        // Compute the start and end dates for the week
        // that contains the inserted date
        let date_array = computeMonth(date);

        let startDate = date_array[0];
        let endDate = date_array[1];

        computeReport(startDate, endDate)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};

/**
 * Computes statistics to be displayed on the manager's homepage, 
 * including:
 * - total number of users of each type (i.e. total number of clients, employees, farmers, etc.)
 * - total number of orders made this week
 * - number of farmers contributing this week
 *
 *  @returns {object} An object containing the statistics described above.
 */
export function computeHomepageStats(date) {
    return new Promise((resolve, reject) => {
        // Get the current date and compute stats for the current week
        let date_array = computeWeek(new Date(date));

        let startDate = date_array[0];
        let endDate = date_array[1];

        let userStats = {};
        let orderStats = {};
        let farmerStats = {};

        const sql_users = `
                SELECT U.role AS role, COUNT(DISTINCT U.id) AS numUsers
                FROM user U
                GROUP BY U.role;
            `;
        
        const sql_orders = `
                SELECT COUNT(DISTINCT R.id) AS numOrders
                FROM request R
                WHERE date >= DATE(?)
                    AND date < DATE(?);
            `;

        const sql_farmer = `
                SELECT COUNT(DISTINCT PD.ref_farmer) AS numFarmers
                FROM product P, prod_descriptor PD
                WHERE P.ref_prod_descriptor = PD.id
                    AND P.date >= DATE(?)
                    AND P.date < DATE(?);
            `;

        db.serialize(() => {
                // ---
                db.all(sql_users, [], (err, rows) => {
                    if (err) {
                        reject(err);
                    }

                    if (rows) {
                        let stats = {};

                        for (let row of rows) {
                            stats[row.role] = row.numUsers;
                        }

                        userStats = {
                            userStats: stats
                        };
                    }
                });
                // ---
                db.get(sql_orders, [startDate, endDate], (err, row) => {
                    if (err) {
                        reject(err);
                    }

                    if (row) {
                        orderStats = {
                            numOrders: row.numOrders
                        };
                    }
                });
                // ---
                db.get(sql_farmer, [startDate, endDate], (err, row) => {
                    if (err) {
                        reject(err);
                    }

                    if (row) {
                        farmerStats = {
                            numFarmers: row.numFarmers
                        };
                    }

                    resolve({
                        ...userStats,
                        ...orderStats,
                        ...farmerStats
                    });
                });
            });
    });
}

/**
 * (Used only for testing purposes)
 * Adds two dummy orders to test reports.
 *
 * @returns Promise; 0 if resolved, error message if rejected.
 */
export function test_addDummyOrders_report() {
    return new Promise((resolve, reject) => {
        // Delete pre-existing dummy orders if present
        const date1 = dayjs(new Date("January, 1 2999 00:00:00")).format('YYYY-MM-DD HH:mm');
        const date2 = dayjs(new Date("January, 3 2999 00:00:00")).format('YYYY-MM-DD HH:mm');
        const sql = 'DELETE FROM Request WHERE date >= DATE(?)';
    
        db.run(sql, [date1], function (err) {
            if (err) reject(err);

            // Serialize queries
            db.serialize(function () {
                db.run(
                    `INSERT INTO Request(ref_client, status, date) VALUES (2, 'delivered', DATE(?))`,
                    [date2],
                    function (err1) {
                        if (err1) {
                            reject(err1);
                        }
                        const id = this.lastID;

                        const sql3 = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (?,1,100.0)`;
                        db.run(sql3, [id], function (err2) {
                            if (err2) {
                                reject(err2);
                            }
                        });
                    });
                db.run(
                    `INSERT INTO Request(ref_client, status, date) VALUES (2, 'unretrieved', DATE(?))`,
                    [date2],
                    function (err1) {
                        if (err1) {
                            reject(err1);
                        }
                        const id = this.lastID;
                        const sql4 = `INSERT INTO Product_Request(ref_request,ref_product,quantity) VALUES (?,2,50.0), (?, 3, 150.0)`;

                        db.run(sql4, [id, id], function (err2) {
                            if (err2) {
                                reject(err2);
                            }
                            resolve(0);
                        });
                    });
            });
        });
    });
}

export function test_addDummyData_stats() {
    return new Promise((resolve, reject) => {
        // Delete pre-existing dummy data if present
        const date1 = dayjs(new Date("January, 1 2999 00:00:00")).format('YYYY-MM-DD HH:mm');
        const date2 = dayjs(new Date("January, 3 2999 00:00:00")).format('YYYY-MM-DD HH:mm');
        const sql = 'DELETE FROM Request WHERE date >= DATE(?)';
    
        db.run(sql, [date1], function (err) {
            if (err) reject(err);

            // Serialize queries
            db.serialize(function () {
                db.run(
                    `INSERT INTO Request(ref_client, status, date) VALUES 
                        (2, 'delivered', DATE(?)),
                        (4, 'delivered', DATE(?)),
                        (5, 'unretrieved', DATE(?)),
                        (2, 'delivered', DATE(?));`,
                    [date2, date2, date2, date2],
                    function (err1) {
                        if (err1) {
                            reject(err1);
                        }
                    });
                db.run(
                    `INSERT INTO Product(ref_prod_descriptor, quantity, price, date)
                        VALUES(2, 10.0, 5.0, DATE(?));`,
                    [date2],
                    function (err1) {
                        if (err1) {
                            reject(err1);
                        }
                        
                        resolve(0);
                    });
            });
        });
    });
}
