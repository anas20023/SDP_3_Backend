import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
    {
        course_code: {
            type: String,
            required: true,
            maxlength: 20,
            trim: true
        },

        course_name: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true
        },

        dept: {
            type: String,
            required: true,
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

        exam_type: {
            type: String,
            enum: ["Midterm", "Final"],
            required: true
        },

        description: {
            type: String
        },

        attachment_url: {
            type: String
        },

        stars: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },

        uploaded_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        votedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        status: {
            type: String,
            enum: ["approved", "pending", "reject"],
            default: "pending"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/* Indexes for query performance */
suggestionSchema.index({ course_code: 1 });
suggestionSchema.index({ dept: 1 });
suggestionSchema.index({ exam_type: 1 });
suggestionSchema.index({ uploaded_by: 1 });
suggestionSchema.index({ status: 1 });
suggestionSchema.index({ votedBy: 1 });

export default mongoose.model("Suggestion", suggestionSchema);
