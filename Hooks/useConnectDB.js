import mongoose from "mongoose";

export async function ConnectDB() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState >= 1) {
    console.log("⚡ Using existing database connection");
    return;
  }

  try {
    await mongoose.connect(
      "mongodb+srv://kushsingh2666:qWeRtY67598@skillnest-cluster.pd51hs8.mongodb.net/",
      {
        dbName: "SKILLNEST",
        bufferCommands: false,
      }
    );

    console.log("✅ Connected to Database");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
