"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetUserModel = void 0;
const mongoose_1 = require("mongoose");
// Define the schema for the asset model
const AssetUserSchema = new mongoose_1.Schema({
    assetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Asset", // Assuming there is an Asset model
        required: [true, "Asset ID is required"],
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // Assuming there is an Asset model
        required: [true, "User ID is required"],
    },
    amountPaid: {
        type: Number,
    },
    amountEarned: {
        type: Number,
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: {
            values: ["ongoing", "completed"],
        },
        default: "ongoing"
    },
}, {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
});
// Export the asset model
exports.AssetUserModel = (0, mongoose_1.model)("AssetUser", AssetUserSchema);
//# sourceMappingURL=assetUser.schema.js.map