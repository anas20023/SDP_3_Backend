import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true
        },

        user_id: {
            type: String,
            required: true,
            unique: true,
            maxlength: 30,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            maxlength: 255,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },

        role: {
            type: String,
            enum: ["student", "teacher", "admin", "mod"],
            default: "student",
            required: true
        },

        dept: {
            type: String,
            maxlength: 40,
            trim: true
        },

        intake: {
            type: String,
            maxlength: 10,
            trim: true
        },

        section: {
            type: String,
            maxlength: 10,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true,
            maxlength: 255
        }
    },
    {
        timestamps: true,   // createdAt, updatedAt
        versionKey: false
    }
);

/* Indexes */
userSchema.index({ user_id: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ dept: 1 });

export default mongoose.model("User", userSchema);
