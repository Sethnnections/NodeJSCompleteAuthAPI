const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

const transport = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: false,
  auth: {
    user: config.email.smtp.auth.user,
    pass: config.email.smtp.auth.pass 
  }
});

// Base template with professional styling
const getBaseTemplate = (content, title = 'ProcurementPro') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f7fa;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .header p {
      font-size: 16px;
      opacity: 0.9;
      font-weight: 300;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .content h2 {
      color: #2c3e50;
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 600;
    }
    
    .content p {
      margin-bottom: 20px;
      font-size: 16px;
      line-height: 1.7;
      color: #555;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      transition: transform 0.2s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    .info-box {
      background-color: #f8f9fc;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 25px 0;
      border-radius: 0 8px 8px 0;
    }
    
    .info-box p {
      margin: 0;
      color: #2c3e50;
    }
    
    .footer {
      background-color: #2c3e50;
      color: #ecf0f1;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    
    .footer p {
      margin-bottom: 10px;
      opacity: 0.8;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e0e6ed, transparent);
      margin: 30px 0;
    }
    
    .security-notice {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 14px;
    }
    
    @media (max-width: 600px) {
      .email-container {
        margin: 0;
        box-shadow: none;
      }
      
      .header, .content, .footer {
        padding: 25px 20px;
      }
      
      .header h1 {
        font-size: 24px;
      }
      
      .content h2 {
        font-size: 20px;
      }
      
      .cta-button {
        display: block;
        text-align: center;
        padding: 14px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${content}
  </div>
</body>
</html>`;
};

// Email verification template
const getVerificationEmailTemplate = (verificationUrl, recipientName = 'User') => {
  const content = `
    <div class="header">
      <h1>ProcurementPro</h1>
      <p>Secure Procurement Management System</p>
    </div>
    
    <div class="content">
      <h2>Email Verification Required</h2>
      
      <p>Dear ${recipientName},</p>
      
      <p>Thank you for registering with ProcurementPro. To complete your account setup and ensure the security of your account, please verify your email address.</p>
      
      <div class="info-box">
        <p><strong>Account Security:</strong> Email verification helps protect your account and ensures you receive important procurement notifications.</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="cta-button">Verify Email Address</a>
      </div>
      
      <div class="divider"></div>
      
      <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; color: #667eea; font-family: monospace; background-color: #f8f9fc; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
      
      <div class="security-notice">
        <strong>Security Notice:</strong> This verification link will expire in 24 hours. If you didn't create an account with ProcurementPro, please ignore this email.
      </div>
      
      <p>Best regards,<br>
      <strong>ProcurementPro Security Team</strong></p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ProcurementPro. All rights reserved.</p>
      <p>Secure • Efficient • Compliant Procurement Solutions</p>
    </div>`;
    
  return getBaseTemplate(content, 'Email Verification - ProcurementPro');
};

// Password reset template
const getPasswordResetTemplate = (resetUrl, recipientName = 'User') => {
  const content = `
    <div class="header">
      <h1>ProcurementPro</h1>
      <p>Secure Procurement Management System</p>
    </div>
    
    <div class="content">
      <h2>Password Reset Request</h2>
      
      <p>Dear ${recipientName},</p>
      
      <p>We received a request to reset the password for your ProcurementPro account. If you made this request, please click the button below to create a new password.</p>
      
      <div class="info-box">
        <p><strong>Security First:</strong> For your protection, this password reset link is valid for 1 hour only and can be used just once.</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="cta-button">Reset Password</a>
      </div>
      
      <div class="divider"></div>
      
      <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; color: #667eea; font-family: monospace; background-color: #f8f9fc; padding: 10px; border-radius: 4px;">${resetUrl}</p>
      
      <div class="security-notice">
        <strong>Security Alert:</strong> If you didn't request a password reset, please ignore this email. Your account remains secure and no changes have been made.
      </div>
      
      <p>For additional security questions or concerns, please contact our support team immediately.</p>
      
      <p>Best regards,<br>
      <strong>ProcurementPro Security Team</strong></p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ProcurementPro. All rights reserved.</p>
      <p>Secure • Efficient • Compliant Procurement Solutions</p>
    </div>`;
    
  return getBaseTemplate(content, 'Password Reset - ProcurementPro');
};

// Welcome email template
const getWelcomeEmailTemplate = (recipientName, dashboardUrl) => {
  const content = `
    <div class="header">
      <h1>Welcome to ProcurementPro</h1>
      <p>Your Procurement Journey Starts Here</p>
    </div>
    
    <div class="content">
      <h2>Welcome Aboard, ${recipientName}!</h2>
      
      <p>Congratulations! Your ProcurementPro account has been successfully verified and is now ready to use.</p>
      
      <div class="info-box">
        <p><strong>What's Next?</strong> Start streamlining your procurement processes with our comprehensive suite of tools designed for modern businesses.</p>
      </div>
      
      <p>Here's what you can do with ProcurementPro:</p>
      <ul style="margin-left: 20px; margin-bottom: 20px;">
        <li style="margin-bottom: 8px;">Create and manage purchase orders efficiently</li>
        <li style="margin-bottom: 8px;">Track vendor performance and compliance</li>
        <li style="margin-bottom: 8px;">Automate approval workflows</li>
        <li style="margin-bottom: 8px;">Generate comprehensive procurement reports</li>
        <li style="margin-bottom: 8px;">Ensure regulatory compliance</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="${dashboardUrl}" class="cta-button">Access Your Dashboard</a>
      </div>
      
      <div class="divider"></div>
      
      <p>Need help getting started? Our comprehensive documentation and support team are here to assist you every step of the way.</p>
      
      <p>Best regards,<br>
      <strong>The ProcurementPro Team</strong></p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ProcurementPro. All rights reserved.</p>
      <p>Secure • Efficient • Compliant Procurement Solutions</p>
    </div>`;
    
  return getBaseTemplate(content, 'Welcome to ProcurementPro');
};

// Order notification template
const getOrderNotificationTemplate = (orderDetails, recipientName) => {
  const { orderNumber, status, amount, vendor, items } = orderDetails;
  
  const content = `
    <div class="header">
      <h1>ProcurementPro</h1>
      <p>Order Status Update</p>
    </div>
    
    <div class="content">
      <h2>Purchase Order Update</h2>
      
      <p>Dear ${recipientName},</p>
      
      <p>Your purchase order has been updated. Please review the details below:</p>
      
      <div class="info-box">
        <p><strong>Order Number:</strong> ${orderNumber}<br>
        <strong>Status:</strong> <span style="color: #27ae60; font-weight: 600;">${status}</span><br>
        <strong>Total Amount:</strong> $${amount.toLocaleString()}<br>
        <strong>Vendor:</strong> ${vendor}</p>
      </div>
      
      <h3 style="color: #2c3e50; margin: 25px 0 15px 0;">Order Items:</h3>
      <div style="background-color: #f8f9fc; padding: 20px; border-radius: 8px;">
        ${items.map(item => `
          <div style="border-bottom: 1px solid #e0e6ed; padding: 10px 0; margin-bottom: 10px;">
            <strong>${item.name}</strong><br>
            <span style="color: #666;">Quantity: ${item.quantity} | Unit Price: $${item.unitPrice}</span>
          </div>
        `).join('')}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${config.clientUrl}/orders/${orderNumber}" class="cta-button">View Order Details</a>
      </div>
      
      <p>If you have any questions about this order, please don't hesitate to contact our procurement team.</p>
      
      <p>Best regards,<br>
      <strong>ProcurementPro Operations Team</strong></p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ProcurementPro. All rights reserved.</p>
      <p>Secure • Efficient • Compliant Procurement Solutions</p>
    </div>`;
    
  return getBaseTemplate(content, `Order ${orderNumber} - ProcurementPro`);
};

// Enhanced send email function
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"ProcurementPro" <${config.email.smtp.auth.user}>`,
      to,
      subject,
      text,
      html,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };
    
    await transport.sendMail(mailOptions);
    logger.info(`Professional email sent to ${to} with subject: ${subject}`);
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw new Error('Email sending failed');
  }
};

// Enhanced verification email
const sendVerificationEmail = async (to, token, recipientName = 'User') => {
  const subject = 'Verify Your ProcurementPro Account';
  const verificationUrl = `${config.clientUrl}/api/auth/verify-email?token=${token}`;
  const html = getVerificationEmailTemplate(verificationUrl, recipientName);
  const text = `Dear ${recipientName},\n\nThank you for registering with ProcurementPro. Please verify your email address by clicking this link: ${verificationUrl}\n\nThis link will expire in 24 hours.\n\nBest regards,\nProcurementPro Security Team`;
  
  await sendEmail(to, subject, text, html);
};

// Enhanced password reset email
const sendResetPasswordEmail = async (to, token, recipientName = 'User') => {
  const subject = 'Reset Your ProcurementPro Password';
  const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;
  const html = getPasswordResetTemplate(resetUrl, recipientName);
  const text = `Dear ${recipientName},\n\nWe received a request to reset your ProcurementPro password. Click this link to reset: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, please ignore this email.\n\nBest regards,\nProcurementPro Security Team`;
  
  await sendEmail(to, subject, text, html);
};

// Welcome email
const sendWelcomeEmail = async (to, recipientName) => {
  const subject = 'Welcome to ProcurementPro - Let\'s Get Started!';
  const dashboardUrl = `${config.clientUrl}/dashboard`;
  const html = getWelcomeEmailTemplate(recipientName, dashboardUrl);
  const text = `Welcome to ProcurementPro, ${recipientName}!\n\nYour account is now verified and ready to use. Access your dashboard at: ${dashboardUrl}\n\nStart streamlining your procurement processes today!\n\nBest regards,\nThe ProcurementPro Team`;
  
  await sendEmail(to, subject, text, html);
};

// Order notification email
const sendOrderNotificationEmail = async (to, orderDetails, recipientName) => {
  const subject = `Order ${orderDetails.orderNumber} - Status Update`;
  const html = getOrderNotificationTemplate(orderDetails, recipientName);
  const text = `Dear ${recipientName},\n\nYour purchase order ${orderDetails.orderNumber} has been updated.\nStatus: ${orderDetails.status}\nTotal: $${orderDetails.amount.toLocaleString()}\nVendor: ${orderDetails.vendor}\n\nView details at: ${config.clientUrl}/orders/${orderDetails.orderNumber}\n\nBest regards,\nProcurementPro Operations Team`;
  
  await sendEmail(to, subject, text, html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
  sendOrderNotificationEmail,
  getBaseTemplate,
  getVerificationEmailTemplate,
  getPasswordResetTemplate,
  getWelcomeEmailTemplate,
  getOrderNotificationTemplate
};