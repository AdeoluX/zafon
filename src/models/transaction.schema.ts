import { Schema, Types, model, Document } from "mongoose";

// Define the interface for a transaction document
export interface ITransaction extends Document {
  currency: string;
  amount: number;
  status: "pending" | "success" | "failed" | "abandoned";
  type: "DR" | "CR";
  email: string;
  assetId: Types.ObjectId;
}

// Define the schema for the transaction model
const TransactionSchema = new Schema<ITransaction>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "Asset", // Assuming there is an Asset model
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
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["DR", "CR"],
      }
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

// Export the transaction model
export const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);
