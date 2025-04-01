import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env file!");
}

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Already connected to MongoDB");
      return;
    }

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("MongoDB connection failed!");
  }
};

export default connectDB;
