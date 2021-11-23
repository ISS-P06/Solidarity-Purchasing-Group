'use strict';

import dayjs from 'dayjs';
import VTC from './vtc';
import {mail_sendBalanceReminder} from './mailer';

import {checksClientBalance} from './system-dao';

const vtc = new VTC();

class SYS {
    /*
     * System
     * 
     * Used to check for time-based events and execute 
     * related operations.
     * 
     */

    /*
     * Check for time-based events every time the
     * virtual clock is updated.
     */
    checkTimedEvents(currTime) {
        /**
         * Check if the current day and time is
         * Monday, 9am
         */
<<<<<<< HEAD

        let time = new Date(currTime);

        if (time.getDay() == 1
         && time.getHours() == 10) {
=======
        if (currTime.day() == 1
         && currTime.hour() == 9) {
>>>>>>> f62979f (feat: added methods to SYS)
            this.event_updateOrders();
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
        checksClientBalance()
            .then((mailList) => {
                this.event_sendBalanceReminders(mailList);
            })
            .catch((err) => {
                console.log("Error: could not update order status: " + err);
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
            mail_sendBalanceReminder(mail.email, mail.id)
                .then((res) => {
<<<<<<< HEAD
                    // ok
=======
                    //console.log("ok");
>>>>>>> f62979f (feat: added methods to SYS)
                })
                .catch((err) => console.log(err));
        }        
    }
}

export default SYS;
