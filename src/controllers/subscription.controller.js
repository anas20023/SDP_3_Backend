import * as subscriptionService from "../services/subscription.service.js";
export const createSubscription = async (req, res) => {
    const data = req.body
    try {
        const yeapapa_umm = await subscriptionService.createSubscription(data)
        return res.status(201).json(yeapapa_umm)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}
export const updateSubscription = async (req, res) => {
    const data = req.body;
    //console.log(data)
    try {
        const ress = await subscriptionService.updateSubscription(data);
        return res.status(200).json({ isOK: ress.acknowledged, message: "Subscription Updates Successfully !" })
    } catch (e) {
        return res.status(304).json({
            message: e.message
        })
    }
}
export const getSubscription = async (req, res) => {
    try {
        const data = await subscriptionService.getSubscription();
        return res.status(200).json(data)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}