import Utils from "../utils/helper.utils";
import {
  IsignIn,
  IsignUp,
  Isubscribe,
  ServiceRes,
} from "./types/app.types";
import { IUser, UserModel } from "../models/user.schema";
import { compare } from "bcrypt";

export class UserService {
  public async subscribe(payload: Isubscribe): Promise<ServiceRes> {
    const { amount, authorizer: { userId } } = payload;
    const user: IUser | null = await UserModel.findOne({ _id: userId });
    if (!user) return { success: false, message: "Invalid credentials" };
    const isValid = await user.isValidPassword(password);
    if (!isValid) return { success: false, message: "Invalid credentials" };
    const token = Utils.signToken({ email, id: user._id, role: user.role });
    return {
      success: true,
      message: "Logged in successfully.",
      token,
    };
  }
}
