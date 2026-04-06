import emailService from './src/services/email.service.js';
import { getWelcomeEmail } from './src/templates/emailTemplates.js';
import dotenv from 'dotenv';
dotenv.config();

const testEmail = async () => {
    console.log('Testing email service with credentials:');
    console.log('EMAIL:', process.env.EMAIL);
    console.log('TOKEN:', process.env.TOKEN ? '********' : 'NOT FOUND');

    if (!process.env.EMAIL || !process.env.TOKEN) {
        console.error('Error: EMAIL or TOKEN not found in .env file');
        return;
    }

    try {
        const result = await emailService.sendEmail(
            process.env.EMAIL, // Send to self for testing
            'Test Email: Platform Welcomes You',
            getWelcomeEmail('Test User')
        );
        
        if (result) {
            console.log('Test email sent successfully!');
        } else {
            console.log('Test email failed to send (check logs above).');
        }
    } catch (error) {
        console.error('Test script error:', error);
    }
};

testEmail();
