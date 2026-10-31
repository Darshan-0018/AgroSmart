const config = require('../config/env');

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (err) {
  nodemailer = null;
}

/**
 * Send email utility
 * @param {Object} options - { email, subject, message, html }
 */
const sendEmail = async (options) => {
  // If SMTP credentials are provided and nodemailer is installed
  if (nodemailer && config.smtpEmail && config.smtpPassword) {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpEmail,
        pass: config.smtpPassword,
      },
    });

    const mailOptions = {
      from: `"${config.fromName}" <${config.fromEmail || config.smtpEmail}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[AgroSmart Mailer] Email sent successfully to ${options.email}`);
  } else {
    // Development fallback: Log cleanly to console
    console.log('\n================== 📧 AGROSMART EMAIL DISPATCH 📧 ==================');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.message}`);
    console.log('===================================================================\n');
  }
};

module.exports = sendEmail;
