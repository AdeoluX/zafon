"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const asset_schema_1 = require("../models/asset.schema"); // Adjust the path based on your project structure
const config_1 = require("../config");
const user_schema_1 = require("../models/user.schema");
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
];
// Seeder function
const seedAssets = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield mongoose_1.default.connect(config_1.config.DATABASE_URL);
        console.log("Connected to MongoDB");
        // Clear existing assets
        yield asset_schema_1.AssetModel.deleteMany({});
        console.log("Existing assets cleared");
        // Insert new assets
        const insertedAssets = yield asset_schema_1.AssetModel.insertMany(assets);
        console.log(`${insertedAssets.length} asset(s) added successfully`);
        const assets_ = yield asset_schema_1.AssetModel.find({});
        console.log(assets_[0]._id);
        // Close connection
        yield mongoose_1.default.connection.close();
        console.log("Database connection closed");
    }
    catch (error) {
        console.error("Error seeding assets:", error);
        process.exit(1); // Exit with failure
    }
});
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield mongoose_1.default.connect(config_1.config.DATABASE_URL);
        console.log("Connected to MongoDB");
        // Clear existing assets
        yield asset_schema_1.AssetModel.deleteMany({});
        console.log("Existing assets cleared");
        // Insert new assets
        const insertedAssets = yield user_schema_1.UserModel.insertMany(admin);
        console.log(`${insertedAssets.length} admin(s) added successfully`);
        const admin_ = yield user_schema_1.UserModel.find({});
        console.log(admin_[0]._id);
        // Close connection
        yield mongoose_1.default.connection.close();
        console.log("Database connection closed");
    }
    catch (error) {
        console.error("Error seeding assets:", error);
        process.exit(1); // Exit with failure
    }
});
// Run the seeder
exports.seed = { seedAssets, seedAdmin };
//# sourceMappingURL=seeder.js.map