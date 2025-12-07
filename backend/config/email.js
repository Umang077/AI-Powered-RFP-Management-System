const nodemailer = require("nodemailer");
const Imap = require("imap");
const dotenv = require("dotenv");
dotenv.config();

// SMTP Transporter for sending emails
const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// IMAP Config for receiving emails
const imapConfig = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }   // <-- FIX

};

module.exports = { smtpTransport, imapConfig };


