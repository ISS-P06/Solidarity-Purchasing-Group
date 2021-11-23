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

export function mail_sendBalanceReminder(clientMail) {
    let mailOptions = {
        from: senderMail,
        to: clientMail,
        subject: 'Insufficient balance for orders',
        text: 'Hello,\n' +
            'we would like to inform you that your current balance ' +
            'is insufficient to pay for the order(s) you made for the current week. Please ' +
            'make sure to top up your wallet as soon as possible, otherwise ' +
            'your order(s) will be canceled.\n' +
            '\nBest regards,\nThe SPG team\n\n' +
            '---\nThis is an automated email, please do not respond.'
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions)
            .then((res) => {
                console.log("email sent");
                resolve("email sent");
            })
            .catch((err) => {
                console.log("error: " + err);
                reject("error: " + err);
            });
    });
}
