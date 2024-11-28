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

// Send an email with retry logic
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
        console.error(`Error sending email to ${to}: ${error.message}`);

        // Retry logic: retry up to 3 times with exponential backoff
        for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(`Retrying email (${attempt}/3)...`);
            try {
                await new Promise(resolve => setTimeout(resolve, attempt * 2000)); // Backoff
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to,
                    subject,
                    html: htmlContent
                });
                console.log(`Email sent to ${to} on retry ${attempt}`);
                break;
            } catch (retryError) {
                console.error(`Retry ${attempt} failed: ${retryError.message}`);
            }
        }
    }
};
