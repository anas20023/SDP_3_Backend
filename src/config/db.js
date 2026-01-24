import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20,          // connection pool size
      minPoolSize: 5,           // keep warm connections
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4                 // IPv4
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
