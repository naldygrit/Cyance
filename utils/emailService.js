// utils/emailService.js
const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  // Define email options
  const mailOptions = {
    from: `"Your Application" <${process.env.EMAIL_FROM}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message // plain text body
    // html: '<p>Your HTML content</p>', // You can use HTML if needed
  }

  // Send email
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
