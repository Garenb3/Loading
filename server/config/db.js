import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
      family: 4, // Use IPv4 (fixes DNS issues on some networks)
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("📍 Error code:", error.code);
    process.exit(1);
  }
};