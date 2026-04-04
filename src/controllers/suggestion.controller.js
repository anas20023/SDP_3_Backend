import SuggestionService from '../services/suggestion.service.js';

export const createSuggestion = async (req, res) => {
    //console.log(req.body.data)
    try {
        const suggestion = await SuggestionService.createSuggestion(req.user.id, req.body, req.file);
        res.status(201).json(suggestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllSuggestions = async (req, res) => {
    try {
        const suggestions = await SuggestionService.getAllSuggestions();
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSuggestionById = async (req, res) => {
    try {
        const suggestion = await SuggestionService.getSuggestionById(req.params.id);
        if (!suggestion) {
            return res.status(404).json({ message: 'Suggestion not found' });
        }
        res.status(200).json(suggestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSuggestion = async (req, res) => {
    try {
        const suggestion = await SuggestionService.updateSuggestion(req.user.id, req.user.role, req.params.id, req.body, req.file);
        res.status(200).json(suggestion);
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};

export const deleteSuggestion = async (req, res) => {
    console.log(req.user)
    try {
        await SuggestionService.deleteSuggestion(req.params.id);
        res.status(200).json({ message: 'Suggestion deleted successfully' });
    } catch (error) {
        if (error.message.includes('Unauthorized')) {
            return res.status(403).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};

export const voteSuggestion = async (req, res) => {
    try {
        const suggestion = await SuggestionService.voteSuggestion(req.user.id, req.params.id);
        res.status(200).json({
            message: 'Vote recorded successfully',
            stars: suggestion.stars
        });
    } catch (error) {
        if (error.message.includes('already voted')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};
export const getAiAnalysis = async (req, res) => {
    try {
        // console.log(req.body.id)
        const result = await SuggestionService.analyzeData(req.body.id)
        //res.set('Cache-Control', 'public, max-age=3600')
        res.json({ result })
    } catch (err) {
        res.status(500).json({ error: 'Failed' })
    }
}
