/**
 * Email Templates Module
 * Contains 6 premium, responsive HTML templates for system notifications.
 * Uses inline CSS for compatibility with email clients.
 * Modern flat design with solid colors, rounded corners, and subtle shadows.
 * No gradients used anywhere – fully compliant with the requirement.
 */

const baseStyles = `
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #1e293b;
    margin: 0;
    padding: 0;
    background-color: #f1f5f9;
    -webkit-font-smoothing: antialiased;
`;

const containerStyles = `
    max-width: 600px;
    margin: 30px auto;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.02);
    border: 1px solid #e9eef3;
`;

const headerStyles = (color = '#4f46e5') => `
    background-color: ${color};
    padding: 36px 24px;
    text-align: center;
    color: white;
    border-bottom: 4px solid rgba(255, 255, 255, 0.2);
`;

const bodyStyles = `
    padding: 44px 36px;
    background: #ffffff;
`;

const footerStyles = `
    padding: 28px 24px;
    text-align: center;
    font-size: 13px;
    color: #5b6e8c;
    background: #fafcff;
    border-top: 1px solid #eef2f8;
    letter-spacing: 0.3px;
`;

const buttonStyles = (color = '#4f46e5') => `
    display: inline-block;
    padding: 12px 28px;
    background-color: ${color};
    color: white;
    text-decoration: none;
    border-radius: 40px;
    font-weight: 600;
    font-size: 15px;
    margin-top: 24px;
    margin-bottom: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border: none;
    text-align: center;
    transition: background 0.2s ease;
`;

const wrapTemplate = (title, content, headerColor = '#4f46e5') => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title.replace(/<[^>]*>?/gm, '')}</title>
</head>
<body style="${baseStyles}">
    <div style="${containerStyles}">
        <div style="${headerStyles(headerColor)}">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.3px;">${title}</h1>
            <p style="margin: 12px 0 0 0; opacity: 0.9; font-size: 15px;">Suggest Me • community-driven insights</p>
        </div>
        <div style="${bodyStyles}">
            ${content}
            <div style="height: 1px; background: #eef2f8; margin: 32px 0 24px 0;"></div>
            <p style="font-size: 13px; color: #7e8ba0; margin: 0;">
                <span style="font-weight: 600;">Need help?</span> Reach us at <a href="mailto:support@suggestme.com" style="color: #4f46e5; text-decoration: none;">support@suggestme.com</a>
            </p>
        </div>
        <div style="${footerStyles}">
            <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} Suggest Me — Every voice matters.</p>
            <p style="margin: 0; font-size: 12px;">You received this email because you're part of the Suggest Me community.</p>
        </div>
    </div>
</body>
</html>
`;

export const getWelcomeEmail = (name) => {
    const content = `
        <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">Welcome aboard, ${name}! 🚀</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">We're absolutely thrilled to have you on the platform. Your account has been successfully created and you're now part of a growing community of changemakers.</p>
        <div style="background: #f8fafc; border-radius: 16px; padding: 20px; margin: 24px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px 0; font-weight: 600;">✨ What's next?</p>
            <p style="margin: 0;">Share your first suggestion, vote on ideas, and help shape the future of our platform.</p>
        </div>
        <a href="#" style="${buttonStyles()}">✨ Get Started</a>
        <p style="margin-top: 32px; font-size: 14px; color: #5b6e8c;">If you didn't create this account, please ignore this email — no action needed.</p>
    `;
    return wrapTemplate('✨ Welcome to Suggest Me!', content);
};

export const getSuggestionUploadEmail = (name, suggestionTitle) => {
    const content = `
        <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">Upload successful, ${name}!</h2>
        <p style="font-size: 16px;">Your suggestion "<strong style="color: #4f46e5;">${suggestionTitle}</strong>" has been submitted and is now under review.</p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 16px; border-left: 5px solid #10b981; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; font-weight: 600;">💡 Pro Tip</p>
            <p style="margin: 0;">High-quality descriptions with clear benefits help your suggestions get approved faster — you're on the right track!</p>
        </div>
        <p style="margin-top: 16px;">Our team will review it shortly. You'll receive another notification once it's approved.</p>
    `;
    return wrapTemplate('📤 Suggestion Received', content, '#4f46e5');
};

export const getSuggestionApprovedEmail = (name, suggestionTitle) => {
    const content = `
        <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">Congratulations, ${name}! 🎉</h2>
        <p style="font-size: 16px;">Your suggestion "<strong style="color: #059669;">${suggestionTitle}</strong>" has been <strong style="color: #059669;">approved</strong> and is now live.</p>
        <div style="background: #ecfdf5; border-radius: 16px; padding: 20px; margin: 24px 0; text-align: center;">
            <span style="font-size: 32px;">🏆</span>
            <p style="margin: 10px 0 0 0;">Community members can now vote and comment on your idea.</p>
        </div>
        <a href="#" style="${buttonStyles('#059669')}">👀 View My Suggestion</a>
    `;
    return wrapTemplate('🎉 Suggestion Approved', content, '#059669');
};

export const getSuggestionRejectedEmail = (name, suggestionTitle, reason = "It doesn't meet our community guidelines.") => {
    const content = `
        <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">Feedback on your suggestion</h2>
        <p style="font-size: 16px;">Hi ${name}, we've carefully reviewed "<strong>${suggestionTitle}</strong>".</p>
        <div style="background: #fef2f2; padding: 20px; border-radius: 16px; border-left: 5px solid #ef4444; margin: 24px 0;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #b91c1c;">📋 Reason for not approving</p>
            <p style="margin: 0; color: #991b1b;">"${reason}"</p>
        </div>
        <p>Don't worry — great ideas often need refinement. You can revise your suggestion and submit it again. We truly value your contribution.</p>
        <a href="#" style="${buttonStyles('#dc2626')}">🔄 Try Again</a>
    `;
    return wrapTemplate('📝 Update on Your Suggestion', content, '#dc2626');
};

export const getVoteNotificationEmail = (ownerName, voterName, suggestionTitle) => {
    const content = `
        <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">New vote received! 🗳️</h2>
        <p style="font-size: 16px;">Exciting news, ${ownerName}!</p>
        <p><strong>${voterName}</strong> just voted for your suggestion "<strong style="color: #7c3aed;">${suggestionTitle}</strong>".</p>
        <div style="background: #f5f3ff; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 44px;">⭐️ +1</span>
            <p style="margin: 8px 0 0 0; color: #5b21b6;">Your contribution is making a real impact in the community.</p>
        </div>
        <a href="#" style="${buttonStyles('#7c3aed')}">🏅 Check Leaderboard</a>
    `;
    return wrapTemplate('⭐ New Vote Received!', content, '#7c3aed');
};

export const getPasswordChangeEmail = (name) => {
    const content = `
        <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">Security alert 🔐</h2>
        <p style="font-size: 16px;">Hi ${name},</p>
        <p>This is a confirmation that the password for your account was recently changed.</p>
        <div style="background: #fffbeb; border-radius: 16px; padding: 20px; margin: 24px 0; border-left: 5px solid #f59e0b;">
            <p style="margin: 0; font-weight: 600;">⚠️ If you did not perform this action</p>
            <p style="margin: 8px 0 0 0;">Please contact our support team immediately or reset your password to secure your account.</p>
        </div>
        <p>No further action is required if you initiated this change.</p>
        <a href="#" style="${buttonStyles('#1f2937')}">🔒 Secure My Account</a>
    `;
    return wrapTemplate('🔒 Password Changed Successfully', content, '#1f2937');
};

export const getGlobalSuggestionAlertEmail = (courseName, courseCode) => {
    const content = `
        <h2 style="color: #0f172a; margin-top: 0; font-size: 24px; font-weight: 700;">📢 New resource available</h2>
        <p>A fellow student just shared a valuable suggestion in the community.</p>
        <div style="background: #ffffff; border-radius: 20px; padding: 20px; margin: 24px 0; border: 1px solid #e2e8f0; box-shadow: 0 4px 8px rgba(0,0,0,0.02);">
            <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #4f46e5;">Course Code</p>
            <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">${courseCode}</p>
            <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #4f46e5;">Course Name</p>
            <p style="margin: 0; font-size: 16px; font-weight: 500;">${courseName}</p>
        </div>
        <p>Check it out now, support your peers, and get inspired!</p>
        <a href="#" style="${buttonStyles('#4f46e5')}">📖 Explore Suggestion</a>
    `;
    return wrapTemplate('📚 New Academic Resource Available', content, '#4f46e5');
};