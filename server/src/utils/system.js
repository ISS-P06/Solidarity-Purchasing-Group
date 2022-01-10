'use strict';

import { mailerUtil } from './';
import { systemDAO } from '../dao';
import { sendAvailableProductsMessage } from '../telegram';

class SYS {
  /**
   * System
   *
   * Used to check for time-based events and execute
   * related operations.
   */

  /**
   * Check if the current day and time is
   * Monday, 9am
   *
   * This triggers email notifications for "pending_canc" orders.
   */
  checkTimedEvents(currTime, test = false) {
    let time = new Date(currTime);
    let day = time.getDay();
    let hours = time.getHours();

    /**
     * Check if the current day and time is
     * Monday, 9am
     *
     * This triggers email notifications for "pending_canc" orders.
     */

    if (day === 1 && hours === 9) {
      this.event_checkForInsufficientBalance(test);
    }

    /**
     * Check if the current day and time is
     * Monday, 11pm
     *
     * This triggers the cancellation (= status change) of all "pending_canc" orders.
     */
    if (day === 1 && hours === 23) {
      this.event_cancelPendingOrders();
    }

    /**
     * Check whether the current day and time is within
     * the time interval in which clients can make orders
     * (i.e. from Sat. 9am to Sun. 11pm).
     *
     * If the current time is outside this interval, all client
     * baskets are emptied.
     */
    if ((day === 6 && hours < 9) || (day === 0 && hours >= 23) || (day != 0 && day != 6)) {
      this.event_emptyBaskets();
    }

    /**
     * Check if the current day and time is Friday, 11pm
     */
    if (day === 5 && hours === 23) {
      this.event_checkUndeliveredOrders();
      /**
       * this checks whether the friday night is exceeded or not
       * if it is exceeded the system should send emails for people who have 3 or 4 missed pickups
       */
      systemDAO.getWarnedCustomers().then(customerInfo => this.event_sendSuspensionWarning(customerInfo))
    }

    if (day === 6 && hours === 9) {
      sendAvailableProductsMessage();
    }
    
  }

  /**
   * Set all the orders that was not retrieved in the 'unretrieved' state
   * Suspend the clients with a number of picked up greater then 5
   */
  event_checkUndeliveredOrders() {
    systemDAO
      .setUndeliveredOrders()
      .then(() => systemDAO.suspendClients())
      .catch((err) =>
        console.log('Error: there was an error in setting the order as unretrieved: ' + err)
      );
  }

  /**
   * Check if the current day and time is Friday, 11pm
   */
  event_emptyBaskets() {
    systemDAO
      .emptyBaskets()
      .catch((err) => console.log('Error: there was an error in emptying baskets: ' + err));
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
  event_sendBalanceReminders(mailingList, test = false) {
      for (let mail of mailingList) {
          // If test = true, the order id is set to -1 so that
          // the function will no try to log in with nodemailer
          // (which causes the tests to fail)
          mailerUtil
              .mail_sendBalanceReminder(mail.email, test ? -1 : mail.id)
              .catch((err) => console.log(err));
      }
  }

    /**
     * Event that cancels all orders with "pending_canc" status
     * on Monday at 11pm.
     */
    event_cancelPendingOrders() {
        systemDAO.cancelPendingCancOrders().catch((err) => console.log('Error: ' + err));
    }

    /**
     * Event that checks which orders are still in pending_canc.
     * This triggers the delivery of the reminders for insufficient balance.
     */
    event_checkForInsufficientBalance(test = false) {
        systemDAO
            .getClientEmailsForReminder()
            .then((mailList) => this.event_sendBalanceReminders(mailList, test))
            .catch((err) => console.log('Error: ' + err));
    }

    event_sendSuspensionWarning(customersInfo) {
        for (let customerInfo of customersInfo) {
            mailerUtil.sendWarningSuspension(customerInfo)
                .then((res) => {
                    // ok
                })
                .catch((err) => {
                    // err
                });
        }
    }
  }
  

export default SYS;
