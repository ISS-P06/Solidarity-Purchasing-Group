"use strict";
import nodemailer from "nodemailer";
require('dotenv').config();

// Get sender email
const senderMail = process.env.EMAIL;

// Set up transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderMail,
      pass: process.env.PASSWORD
    }
  });

export function mail_sendBalanceReminder(userMail, orderID) {
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

    if (orderID <= 0) {
        return new Promise((resolve, reject) => {
            resolve("email sent");
        });
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
};
