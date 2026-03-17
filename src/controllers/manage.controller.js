import * as manageService from '../services/manage.service.js'
export const getusers= async(req,res)=>{
    try {
        const users= await manageService.getusers()
        res.set("Cache-Control", "public, max-age=60")
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
        res.set("Cache-Control", "public, max-age=60")
        return res.status(200).json({userAnalytics,suggestionAnalysis,starAnalysis})
    } catch (error) {
        return res.status(404).json({
            message:"No Analytics Available"
        })
    }
}