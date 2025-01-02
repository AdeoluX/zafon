"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = require("mongoose");
// Define the schema for the transaction model
const TransactionSchema = new mongoose_1.Schema({
    currency: {
        type: String,
        required: [true, "Currency is required"],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be a positive number"],
    },
    assetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Asset", // Assuming there is an Asset model
        required: [true, "Asset ID is required"],
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // Assuming there is an Asset model
        required: [true, "Asset ID is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email address",
        ],
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: {
            values: ["pending", "success", "failed", "abandoned"],
            message: "Status must be one of 'pending', 'success', 'failed', or 'abandoned'",
        },
        default: "pending",
    },
    reference: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        required: [true, "Type is required"],
        enum: {
            values: ["DR", "CR"],
        }
    },
}, {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
});
// Export the transaction model
exports.TransactionModel = (0, mongoose_1.model)("Transaction", TransactionSchema);
//# sourceMappingURL=transaction.schema.js.map