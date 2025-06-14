const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');


const transport = nodemailer.createTransport({
  host: config.email.smtp.host, // Use SMTP_HOST
  port: config.email.smtp.port, // Use SMTP_PORT
  secure: false, // True for 465, false for other ports
  auth: {
    user: config.email.smtp.auth.user, // Use SMTP_USER
    pass: config.email.smtp.auth.pass 
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"Auth Service" <${config.email.user}>`,
      to,
      subject,
      text,
      html,
    };
    await transport.sendMail(mailOptions);
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw new Error('Email sending failed');
  }
};

const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const verificationUrl = `${config.clientUrl}/api/auth/verify-email?token=${token}`;
  const text = `To verify your email, click on this link: ${verificationUrl}`;
  const html = `<p>To verify your email, <a href="${verificationUrl}">click here</a></p>`;
  await sendEmail(to, subject, text, html);
};

const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset Password';
  const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;
  const text = `To reset your password, click on this link: ${resetUrl}`;
  const html = `<p>To reset your password, <a href="${resetUrl}">click here</a></p>`;
  await sendEmail(to, subject, text, html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
};

