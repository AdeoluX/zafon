import Utils from "../utils/helper.utils";
import {
  IsignIn,
  IsignUp,
  ServiceRes,
} from "./types/app.types";
import { IUser, UserModel } from "../models/user.schema";
import { compare } from "bcrypt";

export class AuthService {
  public async signIn(payload: IsignIn): Promise<ServiceRes> {
    const { email, password, isAdmin } = payload;
    const user: IUser | null = await UserModel.findOne({ email, role: isAdmin ? 'admin' : 'member' });
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

  public async signUp(payload: IsignUp): Promise<ServiceRes> {
    const { email, password, confirmPassword, firstName, lastName, phoneNumber, middleName, isAdmin } = payload;
    let user: IUser | null = await UserModel.findOne({ email, role: isAdmin ? 'admin' : 'member' });
    if (user) return { success: false, message: "Invalid credentials" };
    if(password !== confirmPassword) return { success: false, message: 'Passwords must match.' }
    user = await UserModel.create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber, 
      middleName,
      role: isAdmin ? 'admin' : 'member'
    })
    return {
      success: true,
      message: `${ isAdmin ? 'Admin' : 'User' } signed up successfully.`,
    };
  }
}
