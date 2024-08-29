import { hash, compare } from "bcrypt";
import { Document, Schema, Types, model } from "mongoose";

// (first_name, last_name, email, phone)

// user interface
export interface IUser extends Document {
  isValidPassword(password: string): unknown;
  firstName: string;
  lastName: string;
  middleName: string;
  email?: string;
  phoneNumber: string;
  password: string;
  status: string;
  role: string;
}

// user schema
const UserSchema = new Schema<IUser>(
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
    email: String,
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["super-admin", "admin", "employee"]
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

UserSchema.method(
  "isValidPassword",
  async function (password: string): Promise<boolean> {
    const isValid = await compare(password, this.password);
    return isValid;
  }
);

UserSchema.pre("save", async function (next) {
  const hashedPassword = await hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

// create and export user model
export const UserModel = model<IUser>("User", UserSchema);
