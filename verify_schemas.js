import mongoose from 'mongoose';
import SubscriptionPlan from './src/model/subscriptionPlan.js';
import Subscription from './src/model/subscription.js';
import User from './src/model/users.js';

async function verifySchemas() {
    console.log("Verifying schemas...");

    try {
        // 1. Verify SubscriptionPlan
        console.log("Checking SubscriptionPlan model...");
        const plan = new SubscriptionPlan({
            name: "Gold Tier",
            price: 29.99,
            durationInDays: 30,
            downloadLimit: 100
        });
        await plan.validate();
        console.log("✅ SubscriptionPlan model valid.");

        // 2. Verify Subscription
        console.log("Checking Subscription model...");
        const sub = new Subscription({
            user: new mongoose.Types.ObjectId(),
            plan: new mongoose.Types.ObjectId(),
            endDate: new Date()
        });
        await sub.validate();
        console.log("✅ Subscription model valid.");

        console.log("🎉 All schemas verified successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Verification Failed:", error.message);
        console.error(error);
        process.exit(1);
    }
}

verifySchemas();
