import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.TOKEN
    }
});

/**
 * Common method to send an email.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} html - Email body in HTML format.
 * @returns {Promise} - Resolves on success, rejects on error.
 */
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Suggest Me" <${process.env.EMAIL}>`,
            to: process.env.EMAIL, // Sending to self to keep TO field valid
            bcc: to,               // Actual recipient(s) in BCC for privacy
            subject,
            html,
            priority: 'high',
            headers: {
                'X-Priority': '1 (Highest)',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            }
        };

        const info = transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error while sending email:', error);
        // We log the error but don't stop the main execution flow if email fails.
        // In production, you might want to use a retry mechanism or a queue.
        return null;
    }
};

export default {
    sendEmail
};
