import Utils from "../utils/helper.utils";
import {
  IsignIn,
  IsignUp,
  ServiceRes,
} from "./types/app.types";
import { IUser, UserModel } from "../models/user.schema";
import { compare } from "bcrypt";
import { redisClient } from "../config/redis";

export class AuthService {
  public async signIn(payload: IsignIn): Promise<ServiceRes> {
    const { email, password } = payload;
    const user: IUser | null = await UserModel.findOne({ email });
    if (!user) return { success: false, message: "Invalid credentials" };
    const isValid = await user.isValidPassword(password);
    if (!isValid) return { success: false, message: "Invalid credentials" };
    const token = Utils.signToken({ email, id: user._id, role: user.role });
    const sessionData = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    try {
      await redisClient.set(`session:${user._id}`, JSON.stringify(sessionData), {
        EX: 60 * 60 * 24,
      });
    } catch (error) {
      console.error("Error storing session in Redis:", error);
      return { success: false, message: "Failed to create session" };
    }
    return {
      success: true,
      message: "Logged in successfully.",
      token,
    };
  }

  public async signUp(payload: IsignUp): Promise<ServiceRes> {
    const { email, password, confirmPassword, firstName, lastName, phoneNumber, middleName, isAdmin } = payload;
    let user: IUser | null = await UserModel.findOne({ email });
    if (user) return { success: false, message: "Invalid credentials" };
    if(password !== confirmPassword) return { success: false, message: 'Passwords must match.' }
    user = await UserModel.create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber, 
      middleName,
      role: isAdmin ? 'admin' : 'user'
    })
    return {
      success: true,
      message: `${ isAdmin ? 'Admin' : 'User' } signed up successfully.`,
    };
  }
}
