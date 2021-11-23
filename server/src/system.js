'use strict';

import dayjs from 'dayjs';
import VTC from './vtc';

const vtc = new VTC();

class SYS {
    /*
     * System
     * 
     * Used to check for time-based events and execute 
     * related operations.
     * 
     */
    constructor() {
        // boh
    }

    /*
     * Check for time-based events every time the
     * virtual clock is updated.
     * 
     */
    checkTimedEvents() {
        const currTime = dayjs(vtc.time());

        /**
         * Check for time 
         */
    }

    /**
     * Updates order statuses on Monday at 9am.
     * All "pending" orders are either set to "confirmed"
     * or "pending_canc" (i.e. pending cancellation due to
     * insufficient funds).
     */
    event_updateOrders() {

    }

    /**
     * Sends reminders via e-mail to all clients who have
     * orders pending cancellation due to insufficient funds.
     */
    event_sendBalanceReminders() {

    }
}