const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// Configure the email transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send an email with HTML content
exports.sendEmail = async (to, subject, templateName, templateData) => {
    try {
        const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
        const htmlContent = await ejs.renderFile(templatePath, templateData);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        });

        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
};
