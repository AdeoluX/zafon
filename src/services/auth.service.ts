import { OtpModel } from "../models/otp.schema";
import { IUser, UserModel } from "../models/user.schema";
import Utils from "../utils/helper.utils";
import {
  Iactivate,
  IchangePassword,
  IforgotPassword,
  IsignIn,
  IsignUp,
  ServiceRes,
} from "./types/auth.types";

export class AuthService {
  public async signIn(payload: IsignIn): Promise<ServiceRes> {
    const { email, password } = payload;
    const user: IUser | null = await UserModel.findOne({ email });
    if (!user) return { success: false, message: "Invalid credentials" };
    const isValid = await user.isValidPassword(password);
    if (!isValid) return { success: false, message: "Invalid credentials" };
    const token = Utils.signToken({ email, id: user._id, status: user.status });
    return {
      success: true,
      message: "Logged in successfully.",
      token,
    };
  }

  public async signUp(payload: IsignUp): Promise<ServiceRes> {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
      middleName,
    } = payload;

    const userExists = await UserModel.findOne({ email });
    if (userExists) return { success: false, message: "Invalid credentials." };
    if (confirmPassword !== password)
      return { success: false, message: "Passwords don't match." };
    const createUser = await UserModel.create({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
      middleName,
    });
    if (!createUser) return { success: false, message: "Invalid credentials" };
    const token = Utils.signToken({
      email,
      id: createUser._id,
      status: createUser.status,
    });
    const otp = Utils.generateString({ number: true });
    await OtpModel.create({
      author_id: createUser._id,
      otp,
    });
    return {
      success: true,
      message: "Logged in successfully.",
      token,
      options: {
        otp,
      },
    };
  }

  public async activateProfile(payload: Iactivate): Promise<ServiceRes> {
    const { otp, authorizer } = payload;
    const user_id = authorizer.id;
    const userExists = await UserModel.findById(user_id);
    if (!userExists) return { success: false, message: "Invalid Otp" };
    const otpExists = await OtpModel.findOne({
      author_id: user_id,
      otp,
    });
    if (!otpExists) return { success: false, message: "Invalid Otp" };
    await UserModel.findByIdAndUpdate(
      user_id,
      { status: "active" },
      { new: true }
    );
    const token = Utils.signToken({
      email: userExists.email,
      id: userExists._id,
      status: userExists.status,
    });
    return {
      success: true,
      message: "Account activated successfully.",
      token,
      options: {
        otp,
      },
    };
  }

  public async forgotPassword(payload: IforgotPassword): Promise<ServiceRes> {
    const { email } = payload;
    const findUser = await UserModel.findOne({
      email,
    });
    if (!findUser) return { success: true, message: "Otp sent." };
    const otp = Utils.generateString({ number: true });
    await OtpModel.create({
      author_id: findUser._id,
      otp,
    });
    return {
      success: true,
      message: "Otp sent.",
      options: {
        otp,
      },
    };
  }

  public async changePassword(payload: IchangePassword): Promise<ServiceRes> {
    const { otp, confirmPassword, password, email } = payload;
    if (confirmPassword !== password)
      return { success: false, message: "Passwords don't match." };
    const userExists = await UserModel.findOne({
      email,
    });
    if (!userExists) return { success: false, message: "User does not exist" };
    const findOtp = await OtpModel.findOne({
      author_id: userExists._id,
      otp,
    });
    if (!findOtp) return { success: false, message: "Invalid or Expired otp" };
    await UserModel.findByIdAndUpdate(
      userExists._id,
      { password },
      { new: true }
    );
    return {
      success: true,
      message: "Password change successful",
    };
  }
}
