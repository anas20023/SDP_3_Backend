import NodeCache from "node-cache";
import SubscriptionPlan from "../model/subscriptionPlan.js";
import subscriptionPlan from "../model/subscriptionPlan.js";
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
    subscription_cache.del("subscription_data")
    return plan;
};
export const updateSubscription = async (data) => {
    const { id, ...updateData } = data;
    
    if (!id) {
        throw new Error("Subscription ID is required");
    }
    
    const up = await subscriptionPlan.updateOne({ _id: id }, updateData);
    if (!up.modifiedCount === 0) {
        throw new Error("Failed to Modify Subscription Plan");
    }
    subscription_cache.del("subscription_data")
    return {
        message:"Subscripion Plan Deleted Successfully !"
    };
};
export const deleteSubscription= async(id)=>{
    // return id
    const data= await subscriptionPlan.deleteOne({
        _id:id
    })
    //console.log(data)
    if(!data.deletedCount){
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

