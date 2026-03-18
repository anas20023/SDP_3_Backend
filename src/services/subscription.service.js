import NodeCache from "node-cache";
import SubscriptionPlan from "../model/subscriptionPlan.js";
import subscriptionPlan from "../model/subscriptionPlan.js";
const subscription_cache = new NodeCache({ checkperiod: 60 })

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
    subscription_cache.del("subscription_data")
    return plan;
};
export const updateSubscription = async ({ id, ...updateData }) => {
    // Validate ID existence
    if (!id) {
        throw new Error("Subscription ID is required");
    }
    // Validate Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid subscription ID");
    }
    // Prevent updating protected fields
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    // Update subscription
    const updatedSubscription = await SubscriptionPlan.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
            new: true,          // return updated document
            runValidators: true // apply schema validation
        }
    );

    // Handle not found
    if (!updatedSubscription) {
        throw new Error("Subscription plan not found");
    }

    // Invalidate cache
    await subscription_cache.del("subscription_data");

    return {
        success: true,
        message: "Subscription plan updated successfully",
        data: updatedSubscription
    };
};
export const deleteSubscription = async (id) => {
    // return id
    const data = await subscriptionPlan.deleteOne({
        _id: id
    })
    //console.log(data)
    if (!data.deletedCount) {
        throw new Error("Unable to Delete Subscription Plan")
    }
    subscription_cache.del("subscription_data")
    return data
}
export const getSubscription = async () => {
    const cachehit = subscription_cache.get("subscription_data")
    if (!cachehit) {
        //console.log("Cache Miss")

        const subs = await SubscriptionPlan.find({}, "-createdAt -updatedAt");
        if (!subs) {
            throw new Error("No Subscription Found!")
        }
        subscription_cache.set("subscription_data", subs, 1000)
        return subs
    }
    return cachehit
}

