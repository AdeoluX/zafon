import { Document, Schema, Types, model } from "mongoose";

// (first_name, last_name, email, phone)

// user interface
export interface IOtp extends Document {
  otp: string;
  author_id: Types.ObjectId;
}

// user schema
const OtpSchema = new Schema<IOtp>(
  {
    otp: {
      type: String,
      required: true,
    },
    author_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// create and export user model
export const OtpModel = model<IOtp>("Otp", OtpSchema);
