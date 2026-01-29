import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubscriptionPlan",
            required: true
        },

        startDate: {
            type: Date,
            default: Date.now
        },

        endDate: {
            type: Date,
            required: true
        },

        downloadsUsed: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active"
        }
    },
    { timestamps: true, versionKey: false }
);

/* Index for faster queries */
subscriptionSchema.index({ user: 1, status: 1 });

export default mongoose.model("Subscription", subscriptionSchema); 
