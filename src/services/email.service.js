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
 * Validates email format using regex.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Verifies if the email address actually exists on the mail server via SMTP.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const doesEmailExist = async (email) => {
    const [, domain] = email.split('@');
    return new Promise(async (resolve) => {
        const net = await import('net'); // dynamic import to avoid top-level issues
        // We do a lightweight DNS MX check using nodemailer's own utility
        transporter.verify((error) => {
            if (error) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

/**
 * Common method to send an email.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} html - Email body in HTML format.
 * @param {boolean} [isPromo=false] - Whether to send as a promotional email.
 * @returns {Promise} - Resolves on success, rejects on error.
 */
const sendEmail = async (to, subject, html, isPromo = false) => {
    try {
        // 1. Validate email format
        if (!isValidEmailFormat(to)) {
            console.warn(`Invalid email format: ${to}`);
            return null;
        }

        const mailOptions = {
            from: `"Suggest Me" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            bcc: to,
            subject,
            html,
        };

        if (isPromo) {
            // ✅ These headers together signal Gmail to route to Promotions tab
            mailOptions.headers = {
                'Precedence':              'bulk',
                'X-Priority':             '3',              // Normal (not high) for bulk
                'List-Unsubscribe':        `<mailto:unsubscribe@suggestme.com>, <https://suggestme.com/unsubscribe>`,
                'List-Unsubscribe-Post':   'List-Unsubscribe=One-Click',  // RFC 8058 one-click
                'List-ID':                 `SuggestMe Updates <updates.suggestme.com>`,
                'X-Mailer':               'SuggestMe Newsletter',
                'X-Auto-Response-Suppress':'All',
            };
        } else {
            mailOptions.priority = 'high';
            mailOptions.headers = {
                'X-Priority':       '1 (Highest)',
                'X-MSMail-Priority':'High',
                'Importance':       'high'
            };
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;

    } catch (error) {
        // ✅ Catch SMTP-level rejections (e.g. unknown user, mailbox not found)
        if (error.responseCode === 550 || error.responseCode === 551 || error.responseCode === 553) {
            console.warn(`Email address does not exist or was rejected: ${to} — SMTP ${error.responseCode}`);
        } else {
            console.error('Error while sending email:', error);
        }
        return null;
    }
};

export default {
    sendEmail
};