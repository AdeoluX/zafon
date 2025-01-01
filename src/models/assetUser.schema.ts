import { Schema, model, Document, Types } from "mongoose";

// Define the interface for an asset document
export interface IAssetUser extends Document {
  userId: Types.ObjectId;
  assetId: Types.ObjectId;
  amountPaid: number;
  amountEarned: number;
  startDate: Date;
  endDate: Date;
  status: "ongoing" | "completed";

}

// Define the schema for the asset model
const AssetUserSchema = new Schema<IAssetUser>(
  {
    assetId: {
      type: Schema.Types.ObjectId,
      ref: "Asset", // Assuming there is an Asset model
      required: [true, "Asset ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

// Export the asset model
export const AssetUserModel = model<IAssetUser>("AssetUser", AssetUserSchema);
