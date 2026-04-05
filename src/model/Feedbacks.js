import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema(
    {
        category:{
            type:String,
            enum:['general','bug','feature','content','others'],
            required:true
        },
        subject:{
            type:String,
            required:true
        },
        message:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true,   // createdAt, updatedAt
        versionKey: false
    }
)
export default mongoose.model("Feedback", feedbackSchema)