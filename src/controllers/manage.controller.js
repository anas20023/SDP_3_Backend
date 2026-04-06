import * as manageService from '../services/manage.service.js'
export const getusers= async(req,res)=>{
    try {
        const users= await manageService.getusers()
       // res.set("Cache-Control", "public, max-age=60")
        return res.status(200).json(users)
    } catch (error) {
       return res.status(404).json({
            message:"Users not Found"
        })
    }
}
export const getanalytics=async (req,res)=>{
    try {
        const userAnalytics=await manageService.getAnalytics()
        const suggestionAnalysis= await manageService.getsuggestionAnalysis()
        const starAnalysis=await manageService.getstarAnalysis()
       // console.log(starAnalysis)
        //res.set("Cache-Control", "public, max-age=10")
        return res.status(200).json({userAnalytics,suggestionAnalysis,starAnalysis})
    } catch (error) {
        return res.status(404).json({
            message:"No Analytics Available"
        })
    }
}
export const getsuggestions = async (req, res) => {
    try {
        const suggestions = await manageService.getsuggestions()
        //res.set("Cache-Control", "public, max-age=60")
        return res.status(200).json(suggestions)
    } catch (error) {
        return res.status(404).json({
            message: "No Suggestions Available"
        })
    }
}

export const getSuggestionById = async (req, res) => {
    try {
        const { id } = req.params
        const suggestion = await manageService.getSuggestionById(id)
        if (!suggestion) return res.status(404).json({ message: "Suggestion not found" })
        return res.status(200).json(suggestion)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateSuggestion = async (req, res) => {
    try {
        const { id } = req.params
        // We can reuse SuggestionService here if we want full file handling
        // But for consistency with manage.routes, let's use manageService
        const updated = await manageService.updateSuggestionAdmin(req.user.id, req.user.role, id, req.body, req.file)
        //console.log(updated);
        return res.status(200).json(updated)
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const deleteSuggestion = async (req, res) => {
    try {
        const { id } = req.params
        await manageService.deleteSuggestionAdmin(id)
        return res.status(200).json({ message: "Suggestion deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await manageService.getUserById(id)
        if (!user) return res.status(404).json({ message: "User not found" })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, user_id, email, role, dept, intake, section } = req.body;
        
        const updateData = {
            ...(name && { name }),
            ...(user_id && { user_id }),
            ...(email && { email }),
            ...(role && { role }),
            ...(dept !== undefined && { dept }),
            ...(intake !== undefined && { intake }),
            ...(section !== undefined && { section })
        };

        const updated = await manageService.updateUser(id, updateData);
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        await manageService.deleteUser(id)
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}