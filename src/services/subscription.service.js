import mongoose from "mongoose";
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
export const updateSubscription = async ({ id, ...updateData }) => {
    // Validate ID existence
    //console.log(id, updateData)
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
    return updatedSubscription
};
export const deleteSubscription = async (id) => {
    // return id
    const data = await SubscriptionPlan.deleteOne({
        _id: id
    })
    //console.log(data)
    if (!data.deletedCount) {
        throw new Error("Unable to Delete Subscription Plan")
    }
    return data
}
export const getSubscription = async () => {
    const subs = await SubscriptionPlan.find({}, "-createdAt -updatedAt");
    if (!subs) {
        throw new Error("No Subscription Found!")
    }
    return subs
}

