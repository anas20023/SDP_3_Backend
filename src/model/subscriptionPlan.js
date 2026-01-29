import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        durationInDays: {
            type: Number,
            required: true,
            min: 1
        },

        downloadLimit: {
            type: Number,
            required: true,
            min: 0
        },

        features: {
            type: [String],
            default: []
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
