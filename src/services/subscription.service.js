import NodeCache from "node-cache";
import SubscriptionPlan from "../model/subscriptionPlan.js";
const subscription_cache = new NodeCache({ checkperiod: 600 })

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
    const cachehit = subscription_cache.get("subscription_data")
    if (!cachehit) {
        //console.log("Cache Miss")

        const subs = await SubscriptionPlan.find({}, "-_id -createdAt -updatedAt");
        if (!subs) {
            throw new Error("No Subscription Found!")
        }
        subscription_cache.set("subscription_data", subs, 1000)
        return subs
    }
    //console.log("Cache Hit")
    return cachehit
}

