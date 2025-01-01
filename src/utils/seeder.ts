import mongoose from "mongoose";
import { AssetModel } from "../models/asset.schema"; // Adjust the path based on your project structure
import { config } from "../config";
import { UserModel } from "../models/user.schema";

// Sample asset data
const assets = [
  {
    name: "Zafon Lock",
    type: "lock",
    rate: 20
  },
];

const admin = [
  {
    firstName: "Adejuwon",
    lastName: "Tayo",
    middleName: "Adeolu",
    email: "juwontayo@gmail.com",
    phoneNumber: '+2348089622403',
    password: '123456789',
    role: 'admin'
  }
]

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

    const assets_ = await AssetModel.find({})
    console.log(assets_[0]._id)

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding assets:", error);
    process.exit(1); // Exit with failure
  }
};

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.DATABASE_URL);

    console.log("Connected to MongoDB");

    // Clear existing assets
    await AssetModel.deleteMany({});
    console.log("Existing assets cleared");

    // Insert new assets
    const insertedAssets = await UserModel.insertMany(admin);
    console.log(`${insertedAssets.length} admin(s) added successfully`);

    const admin_ = await UserModel.find({})
    console.log(admin_[0]._id)

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding assets:", error);
    process.exit(1); // Exit with failure
  }
};

// Run the seeder
export const seed = { seedAssets, seedAdmin }
