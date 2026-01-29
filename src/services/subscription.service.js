import SubscriptionPlan from "../model/subscriptionPlan.js";

export const createSubscription = async (data) => {
    const {
        name,
        price,
        durationInDays,
        downloadLimit,
        features = [],
        isActive = true
    } = data;

    /* 1️⃣ Required field validation */
    if (
        !name ||
        price === undefined ||
        !durationInDays ||
        downloadLimit === undefined
    ) {
        throw new Error("Required subscription fields are missing");
    }

    /* 2️⃣ Prevent duplicate plan name */
    const existingPlan = await SubscriptionPlan.findOne({ name });
    if (existingPlan) {
        throw new Error("Subscription plan already exists");
    }

    /* 3️⃣ Create plan */
    const plan = await SubscriptionPlan.create({
        name,
        price,
        durationInDays,
        downloadLimit,
        features,
        isActive
    });

    return plan;
};
export const getSubscription = async () => {
    const subs = await SubscriptionPlan.find({},"-_id -createdAt -updatedAt");
    if (!subs) {
        throw new Error("No Subscription Found!")
    }
    return subs
} 