import Suggestion from '../model/suggestions.js';
import { uploadFile, deleteFile, getSignedFileUrl, R2_PUBLIC_URL } from './r2.service.js';
import axios from 'axios';
const createSuggestion = async (userId, body, file) => {

    //console.log(body)
    let attachment_url = null;

    if (file) {
        attachment_url = await uploadFile(file);
    }

    const suggestion = new Suggestion({
        ...body,            // ✅ directly usable
        uploaded_by: userId,
        attachment_url
    });

    await suggestion.save();
    return suggestion;
};

const getAllSuggestions = async (filters = {}) => {
    // Basic filtering implementation
    const query = { status: 'approved' };
    if (filters.dept) query.dept = filters.dept;
    if (filters.course_code) query.course_code = filters.course_code;

    let suggestions = await Suggestion.find(query)
        .populate('uploaded_by', 'name email')
        .sort({ createdAt: -1 })
        .limit(filters.limit ? parseInt(filters.limit) : 10) // Add limit for pagination
        .lean();

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
const getAllSuggestionsNoFilter = async () => {
    const suggestions = await Suggestion.find()
        .populate('uploaded_by', 'name email')
        .sort({ createdAt: -1 })
        .lean();

    if (!R2_PUBLIC_URL) {
        return await Promise.all(suggestions.map(async (s) => {
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

const updateSuggestion = async (userId, userRole, suggestionId, updateData, file) => {
    const suggestion = await Suggestion.findById(suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');

    // // Check ownership
    // const isOwner = suggestion.uploaded_by.toString() === userId;
    // const isAdmin = userRole === 'admin';

    // if (!isOwner && !isAdmin) {
    //     throw new Error('Unauthorized to update this suggestion');
    // }

    // // Role-based status update restriction
    // if (updateData.status && !isAdmin) {
    //     // If not admin, ignore status update or throw error
    //     // Let's throw error as per requirement "Admin will only have the access to do this"
    //     throw new Error('Unauthorized to update suggestion status');
    // }

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

const deleteSuggestion = async (suggestionId) => {
    const suggestion = await Suggestion.findById(suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');
    //console.log(suggestion)
    // if (suggestion.uploaded_by.toString() !== userId) {
    //     throw new Error('Unauthorized to delete this suggestion');
    // }

    if (suggestion.attachment_url) {
        await deleteFile(suggestion.attachment_url);
    }

    await Suggestion.findByIdAndDelete(suggestionId);
    return true;
};

const voteSuggestion = async (userId, suggestionId) => {
    // Atomically update the suggestion:
    // 1. Add user to votedBy array only if they are not already there
    // 2. Increment stars count only if the user was added
    //console.log(userId,suggestionId)
    const suggestion = await Suggestion.findOneAndUpdate(
        {
            _id: suggestionId,
            votedBy: { $ne: userId } // Ensure user haven't voted yet
        },
        {
            $addToSet: { votedBy: userId },
            $inc: { stars: 1 }
        },
        { new: true }
    );

    if (!suggestion) {
        // If findOneAndUpdate returns null, either suggestion doesn't exist 
        // OR the user has already voted (failed the $ne constraint)
        const exists = await Suggestion.findById(suggestionId);
        if (!exists) throw new Error('Suggestion not found');
        throw new Error('You have already voted for this suggestion');
    }

    return suggestion;
};
const analyzeData = async (id) => {
    const data = await Suggestion.findById(id)
        .select('course_name dept description attachment_url');

    const prompt = `
You are an academic assistant.

Write a structured explanation in exactly 3 paragraphs.

Rules:
- Each paragraph must contain 2–3 sentences
- Use clear and simple English
- Include important academic keywords (concepts, methods, applications)
- Keep it informative but not overly technical
- If attachment exists, say "attached resource"
- Do NOT mention database or system details

Course: ${data.course_name}
Department: ${data.dept}
Description: ${data.description?.slice(0, 500)}
Attachment: ${data.attachment_url}
    `;

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'qwen/qwen3.6-plus:free',
                messages: [
                    { role: 'user', content: prompt }
                ],
                reasoning: { enabled: true },
                max_tokens: 100,     // ⬆️ allow deeper explanation
                temperature: 0.3     // ⬆️ more expressive + keyword variety
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'academic-explainer'
                },
                timeout: 15000 // give it a bit more time for depth
            }
        );

        return response.data.choices[0].message.content;

    } catch (err) {
        console.error("AI error:", err.message);

        // fallback (still structured)
        return `This course, ${data.course_name}, belongs to the ${data.dept} department and focuses on key academic concepts. It introduces important methods and practical applications related to the subject area.

The course helps learners understand core principles, analytical thinking, and real-world usage. It builds foundational knowledge while encouraging problem-solving skills.

Additional learning materials may be available as an attached resource for deeper understanding.`;
    }
};
export default {
    createSuggestion,
    getAllSuggestions,
    getSuggestionById,
    updateSuggestion,
    deleteSuggestion,
    getAllSuggestionsNoFilter,
    voteSuggestion, analyzeData
};
