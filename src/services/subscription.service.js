import subscriptionSchema from "../model/subscriptionSchema.js";

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
    const existingPlan = await subscriptionSchema.findOne({ name });
    if (existingPlan) {
        throw new Error("Subscription plan already exists");
    }

    /* 3️⃣ Create plan */
    const plan = await subscriptionSchema.create({
        name,
        price,
        durationInDays,
        downloadLimit,
        features,
        isActive
    });

    return plan;
};
