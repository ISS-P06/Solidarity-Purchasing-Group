'use strict';

import { mailerUtil } from './';
import { systemDAO } from '../dao';

class SYS {
    /**
     * System
     * 
     * Used to check for time-based events and execute 
     * related operations.
     */

    /**
     * Check for time-based events every time the
     * virtual clock is updated.
     */
    checkTimedEvents(currTime) {
        let time = new Date(currTime);
        let day = time.getDay();
        let hours = time.getHours();

        /**
         * Check if the current day and time is
         * Monday, 9am
         */
        if (day == 1
         && hours == 9) {
            this.event_updateOrders();
        }

        /**
         * Check whether the current day and time is within
         * the time interval in which clients can make orders
         * (i.e. from Sat. 9am to Sun. 11pm).
         * 
         * If the current time is outside this interval, all client
         * baskets are emptied.
         */
        if ((day == 6 && hours < 9) 
         || (day == 0 && hours >= 23)
         || (day != 0 && day != 6)) {
            this.event_emptyBaskets();
        }
    }

    /**
     * Updates order statuses on Monday at 9am.
     * All "pending" orders are either set to "confirmed"
     * or "pending_canc" (i.e. pending cancellation due to
     * insufficient funds).
     * This triggers the delivery of the reminders for insufficient balance.
     */
    event_updateOrders() {
        systemDAO.checksClientBalance()
            .then((mailList) => {
                this.event_sendBalanceReminders(mailList);
            })
            .catch((err) => {
                console.log("Error: could not update order status: " + err);
            });
    }

    /**
     * Deletes all tuples from the "Basket" table in the DB.
     * This operation is executed whenever the current time is
     * outside the time interval in which clients are allowed to
     * make orders.
     */
     event_emptyBaskets() {
        systemDAO.emptyBaskets()
            .catch((err) => {
                console.log("Error: there was an error in emptying baskets: " + err);
            });
    }

    /**
     * Sends reminders via e-mail to all clients who have
     * orders pending cancellation due to insufficient funds.
     * 
     * @param {array of objects} mailingList Array of objects, each containing the
     *      email of the user and the id of the order for which they do not have 
     *      enough balance for. There can be multiple objects referring to the
     *      same user (i.e. with the same email).
     */
    event_sendBalanceReminders(mailingList) {
        for (let mail of mailingList) {
            mailerUtil.mail_sendBalanceReminder(mail.email, mail.id)
                .then((res) => {
                    // ok
                })
                .catch((err) => console.log(err));
        }        
    }
}

export default SYS;
