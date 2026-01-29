import * as subscriptionService from "../services/subscription.service.js";
export const createSubscription = async (req, res) => {
    const data = req.body
    if (req.user.role !== "admin" || req.user.role !== "mod") {
        return res.status(401).json({
            message: "You are not authorized for this Operation"
        })
    }
    try {
        const yeapapa_umm = await subscriptionService.createSubscription(data)
        return res.status(201).json(yeapapa_umm)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}