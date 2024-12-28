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
    type: {
      type: String,
      required: [true, "Asset type is required"],
      enum: {
        values: ["fund", "bond", "contribution", "token", "lock"],
        message: "Type must be one of 'fund', 'bond', 'contribution', or 'token'",
      },
      default: "lock"
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

// Export the asset model
export const AssetUserModel = model<IAssetUser>("AssetUser", AssetUserSchema);
