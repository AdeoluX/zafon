import { Document, Schema, Types, model } from "mongoose";

// (first_name, last_name, email, phone)

// user interface
export interface IUserCompany extends Document {
  user: Types.ObjectId;
  company: Types.ObjectId;
}

// user schema
const UserCompanySchema = new Schema<IUserCompany>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
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
export const UserCompanyModel = model<IUserCompany>("UserCompany", UserCompanySchema);
