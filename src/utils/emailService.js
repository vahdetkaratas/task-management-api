const nodemailer = require('nodemailer');

// Configure the email transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
    auth: {
        user: process.env.EMAIL_USER, // Email address
        pass: process.env.EMAIL_PASS  // Email password or app-specific password
    }
});

// Send an email
exports.sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};
