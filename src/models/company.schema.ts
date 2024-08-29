import { Document, Schema, Types, model } from "mongoose";
import { hash, compare } from "bcrypt";
import Utils from "../utils/helper.utils";

// user interface
export interface ICompany extends Document {
  name: string;
  rc_number: string;
  status: string;
  api_secret_live_key: string;
  api_public_live_key: string;
  api_secret_test_key: string;
  api_public_test_key: string;
}

// user schema
const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
    },
    rc_number: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    api_secret_live_key: String,
    api_public_live_key: String,
    api_secret_test_key: String,
    api_public_test_key: String,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

CompanySchema.pre("save", async function (next) {
  this.api_secret_live_key = `sk-live-${Utils.generateString({ alpha: true })}`;
  this.api_public_live_key = `pk-live-${Utils.generateString({ alpha: true })}`;
  this.api_secret_test_key = `sk-test-${Utils.generateString({ alpha: true })}`;
  this.api_public_test_key = `pk-test-${Utils.generateString({ alpha: true })}`;
  next();
});



// create and export user model
export const CompanyModel = model<ICompany>("Company", CompanySchema);
