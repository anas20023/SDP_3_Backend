import Suggestion from '../model/suggestions.js';
import { uploadFile, deleteFile, getSignedFileUrl, R2_PUBLIC_URL } from './r2.service.js';

const createSuggestion = async (userId, suggestionData, file) => {
    let attachment_url = null;

    if (file) {
        attachment_url = await uploadFile(file);
    }
    // console.log(m_data)
    const m_data=JSON.parse(suggestionData)
    //console.log(m_data)
    const suggestion = new Suggestion({
        course_code: m_data.course_code,
        course_name: m_data.course_name,
        dept: m_data.dept,
        intake: m_data.intake,
        section: m_data.section,
        exam_type: m_data.exam_type,
        description: m_data.description,
        uploaded_by: userId,
        attachment_url
    });
    //console.log(suggestion)
    await suggestion.save();
    return suggestion;
};

const getAllSuggestions = async (filters = {}) => {
    // Basic filtering implementation
    const query = {};
    if (filters.dept) query.dept = filters.dept;
    if (filters.course_code) query.course_code = filters.course_code;

    let suggestions = await Suggestion.find(query)
        .populate('uploaded_by', 'name email')
        .sort({ createdAt: -1 })
        .lean(); // Use lean to return plain JS objects for modification

    // If bucket is private (assumed if R2_PUBLIC_URL is empty), generate signed URLs
    if (!R2_PUBLIC_URL) {
        suggestions = await Promise.all(suggestions.map(async (s) => {
            if (s.attachment_url) {
                s.attachment_url = await getSignedFileUrl(s.attachment_url);
            }
            return s;
        }));
    }

    return suggestions;
};

const getSuggestionById = async (id) => {
    const suggestion = await Suggestion.findById(id).populate('uploaded_by', 'name email').lean();

    if (!suggestion) return null;

    if (!R2_PUBLIC_URL && suggestion.attachment_url) {
        suggestion.attachment_url = await getSignedFileUrl(suggestion.attachment_url);
    }

    return suggestion;
};

const updateSuggestion = async (userId, suggestionId, updateData, file) => {
    const suggestion = await Suggestion.findById(suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');

    // Check ownership
    if (suggestion.uploaded_by.toString() !== userId) {
        throw new Error('Unauthorized to update this suggestion');
    }

    let attachment_url = suggestion.attachment_url;

    if (file) {
        // Delete old file if exists
        if (attachment_url) {
            await deleteFile(attachment_url);
        }
        // Upload new file
        attachment_url = await uploadFile(file);
    }

    Object.assign(suggestion, {
        ...updateData,
        attachment_url
    });

    await suggestion.save();
    return suggestion;
};

const deleteSuggestion = async (userId, suggestionId) => {
    const suggestion = await Suggestion.findById(suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');

    if (suggestion.uploaded_by.toString() !== userId) {
        throw new Error('Unauthorized to delete this suggestion');
    }

    if (suggestion.attachment_url) {
        await deleteFile(suggestion.attachment_url);
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
