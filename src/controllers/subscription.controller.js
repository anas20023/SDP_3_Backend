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
export const deleteSubscription = async (req, res) => {
    const { id } = req.body
    try {
        //console.log(id)
        const d = await subscriptionService.deleteSubscription(id)
        //console.log(d)
        return res.status(200).json({ isOK: d.acknowledged, message: "Subscription Deleted Successfully !" })
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}
export const updateSubscription = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await subscriptionService.updateSubscription({
            id,
            ...req.body,
        });

        res.status(200).json({
            success: true,
            message: "Subscription updated successfully",
        });
    } catch (e) {
        res.status(500).json({
            message: e.message,
        });
    }
};
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