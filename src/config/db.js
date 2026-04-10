import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === 'test' ? process.env.DATABASE_TEST_URL : process.env.MONGO_URI;
    await mongoose.connect(uri, {
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
