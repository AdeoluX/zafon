import Utils from "../utils/helper.utils";
import {
  Iactivate,
  IchangePassword,
  ICompanyPayload,
  IforgotPassword,
  IprofileUser,
  IsignIn,
  IsignUp,
  ServiceRes,
} from "./types/auth.types";
import { sendEmail } from "./email.service";
import { IUser, UserModel } from "../models/user.schema";
import { CompanyModel, ICompany } from "../models/company.schema";
import { UserCompanyModel } from "../models/userCompany.schema";
import { OtpModel } from "../models/otp.schema";
import { compare } from "bcrypt";

export class AuthService {
  public async signIn(payload: IsignIn): Promise<ServiceRes> {
    const { email, password } = payload;
    const user: IUser | null = await UserModel.findOne({ email });
    if (!user) return { success: false, message: "Invalid credentials" };
    // const rawUser = user.toJSON()
    const isValid = await user.isValidPassword(password);
    // await compare(payload.password, rawUser.password);
    if (!isValid) return { success: false, message: "Invalid credentials" };
    const token = Utils.signToken({ email, id: user._id, status: user.status });
    return {
      success: true,
      message: "Logged in successfully.",
      token,
    };
  }

  public async profileUser(profileUserPayload: IprofileUser, companyId: String) : Promise<ServiceRes> {
    const findUser = await UserModel.findOne({
      email: profileUserPayload.email
    })
    if(findUser) return { success: false, message: 'User already exists' };
    const createUser = await UserModel.create({
      ...profileUserPayload
    })
    const userCompany = await UserCompanyModel.create({
      user: createUser._id,
      company: companyId
    })
    return {success: true, message: 'User Profiled successfully.'}
  }

  public async registerCompany(payload: ICompanyPayload): Promise<ServiceRes> {
    //find company by rc_number
    const { user, ...rest } = payload
    if(user.password !== user.confirmPassword) return { success: false, message: 'Invalid credentials' }
    let company = await CompanyModel.findOne({
      rc_number: payload.rc_number
    })
    if(company) return { success: false, message: 'Invalid credentials' }
    //create all keys
    company = await CompanyModel.create(rest)
    const createUser = await UserModel.create({
      ...user
    })
    const createUserCompany = await UserCompanyModel.create({
      company: company._id,
      user: createUser._id
    })
    const token = Utils.signToken({id: createUser._id, status: createUser.status });
    return { success: true, message: 'Success', data: { company, user: createUser, token } }
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
