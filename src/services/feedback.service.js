import Feedback from '../model/Feedbacks.js'

export const createFeedback = async (feedbackData) => {
    const feedback = new Feedback(feedbackData);
    return await feedback.save();
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
