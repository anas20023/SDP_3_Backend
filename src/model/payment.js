import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0 
    },

    currency: {
      type: String,
      default: "BDT",
      uppercase: true
    },

    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "card", "cash", "stripe"],
      required: true
    },

    transactionId: {
      type: String,
      required: true,
      unique: true
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
      index: true
    },

    paidAt: {
      type: Date
    },

    meta: {
      type: Object
      // gateway response, phone number, card brand, etc.
    }
  },
  {
    timestamps: true,   // createdAt, updatedAt
    versionKey: false
  }
);

/* Indexes */
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ transactionId: 1 }, { unique: true });

export default mongoose.model("Payment", paymentSchema);
