import Suggestion from '../model/suggestions.js';

const createSuggestion = async (userId, suggestionData) => {
    const suggestion = new Suggestion({
        ...suggestionData,
        uploaded_by: userId
    });
    await suggestion.save();
    return suggestion;
};

const getAllSuggestions = async (filters = {}) => {
    // Basic filtering implementation
    const query = {};
    if (filters.dept) query.dept = filters.dept;
    if (filters.course_code) query.course_code = filters.course_code;

    return await Suggestion.find(query)
        .populate('uploaded_by', 'name email')
        .sort({ createdAt: -1 });
};

const getSuggestionById = async (id) => {
    return await Suggestion.findById(id).populate('uploaded_by', 'name email');
};

const updateSuggestion = async (userId, suggestionId, updateData) => {
    const suggestion = await Suggestion.findById(suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');

    // Check ownership - this logic could also be in controller/middleware depending on preference
    // Assuming backend enforces only owner can edit (or admin - not checking role here for simplicity yet)
    if (suggestion.uploaded_by.toString() !== userId) {
        throw new Error('Unauthorized to update this suggestion');
    }

    Object.assign(suggestion, updateData);
    await suggestion.save();
    return suggestion;
};

const deleteSuggestion = async (userId, suggestionId) => {
    const suggestion = await Suggestion.findById(suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');

    if (suggestion.uploaded_by.toString() !== userId) {
        throw new Error('Unauthorized to delete this suggestion');
    }

    await Suggestion.findByIdAndDelete(suggestionId);
    return true;
};

export default {
    createSuggestion,
    getAllSuggestions,
    getSuggestionById,
    updateSuggestion,
    deleteSuggestion
};
