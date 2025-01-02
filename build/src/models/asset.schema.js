"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetModel = void 0;
const mongoose_1 = require("mongoose");
// Define the schema for the asset model
const AssetSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Asset name is required"],
        trim: true, // Remove leading and trailing whitespace
        minlength: [3, "Asset name must be at least 3 characters long"],
        maxlength: [50, "Asset name must not exceed 50 characters"],
    },
    unitPrice: {
        type: Number,
        min: [0, "Unit price must be a positive number"],
    },
    rate: {
        type: Number,
    },
    type: {
        type: String,
        required: [true, "Asset type is required"],
        enum: {
            values: ["fund", "bond", "contribution", "token", "lock"],
            message: "Type must be one of 'fund', 'bond', 'contribution', or 'token'",
        },
        default: "lock"
    },
}, {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
});
// Export the asset model
exports.AssetModel = (0, mongoose_1.model)("Asset", AssetSchema);
//# sourceMappingURL=asset.schema.js.map