const NODE_MAILER = require("nodemailer");
const CustomError = require("./custom_error");
//  const fs = require('fs');

/**
 * Function that sends an email using Node.js nodemailer package
 *
 * @param {Object} options - The options for the email to send
 * @param {string} options.to - The email address of the recipient
 * @param {string} options.subject - The subject of the email
 * @param {string} options.text - The text content of the email
 * @param {string} [options.html] - The HTML content of the email (optional)
 * @returns {Promise<Object>} A Promise that resolves with the info object returned by nodemailer
 * on successful email delivery, or rejects with an error if there was an issue sending the email
 */
function send_email(options) {
  /**
   * Creates a nodemailer transporter object with the specified options
   */
  const TRANSPORTER = NODE_MAILER.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  /**
   * Creates the options object with the information of the email to send
   */
  const MAIL_OPTIONS = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };
  /**
   * Uses the transporter object to send the email with the specified options
   */
  return new Promise((resolve, reject) => {
    TRANSPORTER.sendMail(MAIL_OPTIONS, (error, info) => {
      if (error) {
        reject(new CustomError(`Failed to send email: ${error.message}`, 500));
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = send_email;
