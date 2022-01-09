"use strict";
import nodemailer from "nodemailer";
// This import is used to get the gmail account credentials from
// the .env file
require('dotenv').config();

// Get sender email
const senderMail = process.env.EMAIL;

// Set up transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: senderMail,
      pass: process.env.PASSWORD
    }
  });

/**
 * Sends an email to a given user to remind them that their balance is
 * insufficient for a given order.
 * 
 * @param {string} userMail: the user's email 
 * @param {integer} orderID: the unique ID of the order for which
 *      they do not have enough balance
 * @returns Promise
 */
export function mail_sendBalanceReminder(userMail, orderID) {
    // Set up email options
    let mailOptions = {
        from: senderMail,
        to: userMail,
        subject: 'SPG - Insufficient balance for orders',
        text: 'Hello,\n' +
            'we would like to inform you that your current balance ' +
            'is insufficient to pay for the order with ID#' + orderID + ' you made for the current week. Please ' +
            'make sure to top up your wallet as soon as possible, otherwise ' +
            'your order will be canceled.\n' +
            '\nBest regards,\nThe SPG team\n\n' +
            '---\nThis is an automated email, please do not respond.'
    };

    /*
        Note: this IF statement is used only to run tests.
        In order to avoid sending emails every time a test is ran,
        an orderID of 0 or less is passed to the function so that it returns
        a resolved promise every time instead of using nodemailer.
    */
    if (orderID <= 0) {
        return Promise.resolve("email sent");
    }
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions)
            .then((res) => {
                resolve("email sent");
            })
            .catch((err) => {
                reject("error: " + err);
            });
    });
}

/**
 * this method sends an email to the user to warn him that his account is about to be suspended due to
 * excessive times of order missed pickups.
 *
 * @param{Object} customerInfo; carries customer information {name ,surname ,email, missed_pickups}
 * @return {Promise}
 */

export function sendWarningSuspension(customerInfo) {
    // Set up email options

    let mailOptions = {
        from: senderMail,
        to: customerInfo.email,
        subject: 'SPG - your account is about to be suspended',
        text: 'Dear ' + customerInfo.surname +' '+ customerInfo.name +',\n'+
            'We are sorry to inform you that your account is about to be suspended since you have '+ customerInfo.missed_pickups +
            ' times of orders missed pickups.\n\n'+
            'For more information you are invited to consult our customer service.\n'+
            'Best regards'
    };

    /*
    Note: this IF statement is used only to run tests.
    In order to avoid sending emails every time a test is ran,
    an orderID of 0 or less is passed to the function so that it returns
    a resolved promise every time instead of using nodemailer.
*/
    if (customerInfo == '') {
        return Promise.resolve("email sent");
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions)
            .then((res) => {
                resolve("email sent");
            })
            .catch((err) => {
                reject(err);
            });
    });
}

