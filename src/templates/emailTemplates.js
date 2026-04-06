/**
 * Email Templates Module
 * Contains 6 premium, responsive HTML templates for system notifications.
 * Uses inline CSS for compatibility with email clients.
 */

const baseStyles = `
    font-family: Inter, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    margin: 0;
    padding: 0;
    background-color: #f4f7f6;
`;

const containerStyles = `
    max-width: 600px;
    margin: 20px auto;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const headerStyles = (color = '#4f46e5') => `
    background-color: ${color};
    padding: 30px;
    text-align: center;
    color: white;
`;

const bodyStyles = `
    padding: 40px;
`;

const footerStyles = `
    padding: 20px;
    text-align: center;
    font-size: 12px;
    color: #666;
    background: #f9fafb;
`;

const buttonStyles = (color = '#4f46e5') => `
    display: inline-block;
    padding: 12px 24px;
    background-color: ${color};
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    margin-top: 20px;
`;

const wrapTemplate = (title, content, headerColor = '#4f46e5') => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="${baseStyles}">
    <div style="${containerStyles}">
        <div style="${headerStyles(headerColor)}">
            <h1 style="margin: 0; font-size: 24px;">${title}</h1>
        </div>
        <div style="${bodyStyles}">
            ${content}
        </div>
        <div style="${footerStyles}">
            &copy; ${new Date().getFullYear()} Suggest Me. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

export const getWelcomeEmail = (name) => {
    const content = `
        <h2 style="color: #111827;">Welcome to the Platform, ${name}!</h2>
        <p>We're thrilled to have you on board. Your account has been successfully created.</p>
        <p>Start exploring and sharing your insights with our community today.</p>
        <a href="#" style="${buttonStyles()}">Get Started</a>
        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">If you didn't create this account, please ignore this email.</p>
    `;
    return wrapTemplate('Account Created Successfully', content);
};

export const getSuggestionUploadEmail = (name, suggestionTitle) => {
    const content = `
        <h2 style="color: #111827;">Upload Successful!</h2>
        <p>Hi ${name}, your suggestion "<strong>${suggestionTitle}</strong>" has been successfully uploaded.</p>
        <p>Our team will review it shortly. You'll receive another notification once it's approved.</p>
        <p style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5;">
            <strong>Pro Tip:</strong> High-quality descriptions help your suggestions get approved faster!
        </p>
    `;
    return wrapTemplate('Suggestion Received', content, '#4f46e5');
};

export const getSuggestionApprovedEmail = (name, suggestionTitle) => {
    const content = `
        <h2 style="color: #059669;">Congratulations!</h2>
        <p>Hi ${name}, your suggestion "<strong>${suggestionTitle}</strong>" has been <strong>approved</strong>.</p>
        <p>It is now visible to the community and others can start voting on it.</p>
        <a href="#" style="${buttonStyles('#059669')}">View My Suggestion</a>
    `;
    return wrapTemplate('Suggestion Approved 🎉', content, '#059669');
};

export const getSuggestionRejectedEmail = (name, suggestionTitle, reason = "It doesn't meet our community guidelines.") => {
    const content = `
        <h2 style="color: #dc2626;">Feedback on Your Suggestion</h2>
        <p>Hi ${name}, we've reviewed your suggestion "<strong>${suggestionTitle}</strong>".</p>
        <p>Unfortunately, it couldn't be approved at this time for the following reason:</p>
        <p style="background: #fee2e2; padding: 15px; border-radius: 8px; color: #991b1b;">
            "${reason}"
        </p>
        <p>Don't worry! You can revise your suggestion and try uploading it again. We value your contribution.</p>
        <a href="#" style="${buttonStyles('#dc2626')}">Try Again</a>
    `;
    return wrapTemplate('Update on Your Suggestion', content, '#dc2626');
};

export const getVoteNotificationEmail = (ownerName, voterName, suggestionTitle) => {
    const content = `
        <h2 style="color: #7c3aed;">New Vote Received!</h2>
        <p>Exciting news, ${ownerName}!</p>
        <p><strong>${voterName}</strong> just voted for your suggestion "<strong>${suggestionTitle}</strong>".</p>
        <p>Your contribution is making a real impact in the community.</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 40px;">⭐</span>
        </div>
        <a href="#" style="${buttonStyles('#7c3aed')}">Check Leaderboard</a>
    `;
    return wrapTemplate('You Got a New Vote!', content, '#7c3aed');
};

export const getPasswordChangeEmail = (name) => {
    const content = `
        <h2 style="color: #1f2937;">Security Alert</h2>
        <p>Hi ${name},</p>
        <p>This is a confirmation that the password for your account was recently changed.</p>
        <p style="color: #dc2626; font-weight: bold;">If you did not perform this action, please contact our support team immediately or reset your password to secure your account.</p>
        <p>No further action is required if you initiated this change.</p>
        <a href="#" style="${buttonStyles('#1f2937')}">Secure My Account</a>
    `;
    return wrapTemplate('Password Changed Successfully', content, '#1f2937');
};

export const getGlobalSuggestionAlertEmail = (courseName, courseCode) => {
    const content = `
        <h2 style="color: #4f46e5;">New Suggestion Uploaded in SuggestMe</h2>
        <p>A new resource has been shared with the community!</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Course Code</p>
            <h3 style="margin: 5px 0 15px 0; color: #111827;">${courseCode}</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Course Name</p>
            <p style="margin: 5px 0 0 0; color: #111827; font-weight: 500;">${courseName}</p>
        </div>
        <p>Check it out now and support your fellow students!</p>
        <p>Check Suggest Me App</p>
    `;
    return wrapTemplate('New Academic Resource Available', content);
};
