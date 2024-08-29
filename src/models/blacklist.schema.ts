import { Document, Schema, Types, model } from "mongoose";

export interface IBlackList extends Document {
  firstName: string;
  lastName: string;
  middleName: string;
  email?: string;
  phoneNumber?: string;
  bvn?: string;
  status: string;
  image: string;
}

const BlackListSchema = new Schema<IBlackList>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: String,
    bvn: String,
    email: String,
    phoneNumber: String,
    image: String,
    status: {
      type: String,
      enum: ["red", "green", "amber"],
      default: "amber",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);


export const BlackListModel = model<IBlackList>("BlackList", BlackListSchema);
