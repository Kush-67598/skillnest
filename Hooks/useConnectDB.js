import mongoose from "mongoose";
let isConnected = false;
export async function ConnectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(
      "mongodb+srv://kushsingh2666:RChLDWssIyrnHCcm@skillnest-cluster.pd51hs8.mongodb.net/",
      {
        dbName: "SKILLNEST",
      }
    );
    isConnected = true;
    console.log("COnnected to Database");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}
