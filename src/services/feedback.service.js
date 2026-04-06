import Feedback from '../model/Feedbacks.js';
import User from '../model/users.js';
import emailService from './email.service.js';
import { getFeedbackAdminAlertEmail } from '../templates/emailTemplates.js';


export const createFeedback = async (feedbackData) => {
    const feedback = new Feedback(feedbackData);
    await feedback.save();

    // Send email to all admins asynchronously
    try {
        const admins = await User.find({ role: 'admin' }, 'email');
        const adminEmails = admins.map(admin => admin.email).filter(Boolean);

        if (adminEmails.length > 0) {
            emailService.sendEmail(
                adminEmails,
                `New Feedback Submitted: ${feedbackData.subject || 'General'}`,
                getFeedbackAdminAlertEmail(feedbackData.category, feedbackData.message)
            );
        }
    } catch (error) {
        console.error('Failed to send feedback alert to admins', error);
    }

    return feedback;
}

export const getAllFeedbacks = async () => {
    return await Feedback.find().sort({ createdAt: -1 });
}

export const getFeedbackById = async (id) => {
    return await Feedback.findById(id);
}

export const updateFeedback = async (id, updateData) => {
    return await Feedback.findByIdAndUpdate(id, updateData, { new: true });
}

export const deleteFeedback = async (id) => {
    return await Feedback.findByIdAndDelete(id);
}
