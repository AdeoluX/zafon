import Utils from "../utils/helper.utils";
import {
  IAsset,
  Ipagination,
  Ipayment,
  IsignIn,
  IsignUp,
  Isubscribe,
  ServiceRes,
} from "./types/app.types";
import { IUser, UserModel } from "../models/user.schema";
import { config } from "../config";
import { AssetModel } from "../models/asset.schema";

export class AssetService {
  public async getAsset(id: string): Promise<ServiceRes> {
    // const { amount, authorizer: { userId } } = payload;
    // const user: IUser | null = await UserModel.findOne({ _id: userId });
    // if (!user) return { success: false, message: "Invalid credentials" };
    // const isValid = await user.isValidPassword(password);
    // if (!isValid) return { success: false, message: "Invalid credentials" };
    // const token = Utils.signToken({ email, id: user._id, role: user.role });
    return {
      success: true,
      message: "Logged in successfully.",
      // token,
    };
  }

  public async updateAsset(payload: Partial<IAsset>): Promise<ServiceRes> {
    // const { amount, authorizer: { userId } } = payload;
    // const user: IUser | null = await UserModel.findOne({ _id: userId });
    // if (!user) return { success: false, message: "Invalid credentials" };
    // const isValid = await user.isValidPassword(password);
    // if (!isValid) return { success: false, message: "Invalid credentials" };
    // const token = Utils.signToken({ email, id: user._id, role: user.role });
    return {
      success: true,
      message: "Logged in successfully.",
      // token,
    };
  }

  public async createAsset(payload: IAsset): Promise<ServiceRes> {
    const { name, rate, type, unitPrice } = payload;
    const asset = await AssetModel.create({
      name, rate, type, unitPrice
    })
    return {
      success: true,
      message: "Asset Created Successfully",
      data: asset
    }
  }

  public async getAssets(pagination: Ipagination): Promise<ServiceRes> {
      const { page, perPage, skip } = pagination
      const assets = await AssetModel.find({}).skip(skip).limit(perPage)
      return {
        success: true,
        message: "Assets gotten successfully.",
        data: assets
      };
  }

  
}
