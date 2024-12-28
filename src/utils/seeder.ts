import mongoose from "mongoose";
import { AssetModel } from "../models/asset.schema"; // Adjust the path based on your project structure
import { config } from "../config";

// Sample asset data
const assets = [
  {
    name: "Zafon Lock",
    type: "lock",
  },
];

// Seeder function
const seedAssets = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.DATABASE_URL);

    console.log("Connected to MongoDB");

    // Clear existing assets
    await AssetModel.deleteMany({});
    console.log("Existing assets cleared");

    // Insert new assets
    const insertedAssets = await AssetModel.insertMany(assets);
    console.log(`${insertedAssets.length} asset(s) added successfully`);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding assets:", error);
    process.exit(1); // Exit with failure
  }
};

// Run the seeder
export const seed = { seedAssets }
