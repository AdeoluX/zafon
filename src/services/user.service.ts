import Utils from "../utils/helper.utils";
import {
  IAuthorizer,
  Ipagination,
  Ipayment,
  IRedemption,
  IsignIn,
  IsignUp,
  Isubscribe,
  ServiceRes,
} from "./types/app.types";
import { IUser, UserModel } from "../models/user.schema";
import { config } from "../config";
import { initializePayment } from "../utils/paystack.utils";
import { ITransaction, TransactionModel } from "../models/transaction.schema";
import { AssetUserModel, IAssetUser } from "../models/assetUser.schema";
import { AssetModel } from "../models/asset.schema";
import { RedemptionJobData } from "../queues/redemption.queue2";
import { scheduleRedemptionJob } from "../queues/redemption.queue";

export class UserService {
  public async subscribe(payload: Isubscribe): Promise<ServiceRes> {
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

  public async portfolio(payload: IAuthorizer) {
    const { id } = payload;
    const allAssetUser = await AssetUserModel.find({
      userId: id
    }).populate("assetId").exec();
    const allValues = []
    for(const item of allAssetUser){
      const totalValue = item.amountPaid + item.amountEarned
      allValues.push(totalValue)
    }
    const sum = allValues.reduce((acc, current) => acc + current, 0);
    return {
      success: true,
      message: "Payment initialized successfully.",
      data: {
        total_portfolio: sum,
        assets: allAssetUser
      }
    };
  }

  public async assetTransactionHistory(assetUserId: string, paginateOptions: Ipagination): Promise<ServiceRes>{
    const assetUser: IAssetUser | null = await AssetUserModel.findById(assetUserId);
    if(!assetUser) return {
      success: true,
      message: 'Asset user id is invalid.'
    }
    const { userId, assetId } = assetUser;
    const transactions = await TransactionModel.find({
      userId, assetId
    }).skip(paginateOptions.skip).limit(paginateOptions.perPage)
    return {
      success: true,
      message: 'Transactions gotten successfully',
      data: transactions
    }
  }

  public async redeemAsset(payload: Partial<IRedemption>, assetUserId: string): Promise<ServiceRes> {
    const { unitToRedeem, amount, authorizer } = payload;
  
    // Validate asset user
    const assetUser = await AssetUserModel.findById(assetUserId);
    if (!assetUser) {
      return { success: false, message: "Invalid asset user ID" };
    }
  
    // Get the associated asset
    const asset = await AssetModel.findById(assetUser.assetId);
    if (!asset) {
      return { success: false, message: "Asset not found" };
    }
  
    // Get the user (authorizer)
    const user = await UserModel.findById(authorizer?.id);
    if (!user) {
      return { success: false, message: "Invalid authorizer ID" };
    }
  
    // Handle redemption logic based on asset type
    if (asset.type === 'fund') {
      // Validate unitToRedeem
      if (!unitToRedeem) {
        return { success: false, message: "Unit to redeem is required for funds" };
      }
  
      // Calculate the amount to redeem
      const redemptionAmount = asset.unitPrice * unitToRedeem;
      if(redemptionAmount > assetUser.amountPaid) return {
        success: false,
        message: 'Insufficient balance to redeem from'
      }
  
      // Create a pending transaction
      const transaction: ITransaction = await TransactionModel.create({
        currency: "NGN",
        amount: redemptionAmount,
        status: "pending",
        reference: `rdmp_txn_${Utils.generateString({ alpha: true, number: true })}`,
        type: "DR", // Debit transaction
        email: user.email,
        assetId: assetUser.assetId,
        userId: authorizer!.id,
      });

      if(!transaction) return{
        success: false,
      }

      const redemptionData: RedemptionJobData = {
        assetUserId,
        unitToRedeem,
        userId: authorizer!.id,
        transactionId: transaction!._id
    }

      await scheduleRedemptionJob(redemptionData, new Date(Date.now() + 2 * 60 * 1000).toISOString())

      // await RedemptionQueue.add('process-redemption', {
      //   assetUserId,
      //   unitToRedeem,
      //   userId: authorizer!.id,
      //   transactionId: transaction._id
      // }, {
      //   attempts: 5, // Retry up to 5 times
      //   backoff: {
      //     type: 'exponential',
      //     delay: 10000, // Start with a 3-second delay
      //   },
      // })
  
      return { success: true, message: "Redemption transaction created successfully." };
    } else {
      // Handle other asset types (if any logic is required)
      return { success: false, message: "Redemption is not supported for this asset type." };
    }
  }
  

  public async topUp(payload: Partial<Ipayment>, assetUserId: string): Promise<ServiceRes> {
    try {
      const { amount, authorizer } = payload;
  
      // Validate payload structure
      if (!amount || !authorizer?.id || !assetUserId) {
        return { success: false, message: "Invalid payment payload" };
      }

      // find AssetUser
      const assetUser = await AssetUserModel.findOne({
        _id: assetUserId
      })

      if (!assetUser) {
        return { success: false, message: "Invalid asset user id" };
      }
      const asset = await AssetModel.findById(assetUser.assetId)
      if(asset?.type === 'lock'){
        return { success: false, message: "You cannot top up a locked plan, create a new one." };
      }
  
      // Fetch user details
      const user: IUser | null = await UserModel.findOne({ _id: authorizer.id });
      if (!user) {
        return { success: false, message: "User not found. Invalid credentials." };
      }
      const reference = `${asset?.type.substring(0,3).toLocaleLowerCase()}_txn_${Utils.generateString({alpha: true, number: true})}`
      // Initialize payment
      const paymentResponse: any = await initializePayment(
        user.email, 
        amount * 100, 
        config.FRONTEND_URL, 
        { assetId: assetUser?.assetId, type: asset?.type, endDate: assetUser.endDate },
        reference
      );
  
      // Check if the payment initialization was successful (if applicable)
      if (!paymentResponse?.status) {
        return { success: false, message: "Payment initialization failed. Please try again." };
      }
      //
      await TransactionModel.create({
        currency: "NGN",
        amount,
        status: 'pending',
        reference,
        type: "CR",
        email: user.email,
        assetId: assetUser?.assetId,
        userId: authorizer!.id 
      })
      // Return success response
      return {
        success: true,
        message: "Payment initialized successfully.",
        data: paymentResponse.data
      };
    } catch (error) {
      console.error("Error in pay method:", error);
      return {
        success: false,
        message: "An unexpected error occurred while processing the payment.",
      };
    }
  }

  public async pay(payload: Partial<Ipayment>): Promise<ServiceRes> {
    try {
      const { amount, authorizer, assetId, type, endDate } = payload;
  
      // Validate payload structure
      if (!amount || !authorizer?.id || !assetId || !type) {
        return { success: false, message: "Invalid payment payload" };
      }
      const asset = await AssetModel.findById(assetId);
      if((asset!.type === 'bond' || asset!.type === 'fund') && !(amount % asset!.unitPrice === 0)) return {
        success: false,
        message: `Amount should be multiples of ${asset!.unitPrice}`
      }
      // Fetch user details
      const user: IUser | null = await UserModel.findOne({ _id: authorizer.id });
      if (!user) {
        return { success: false, message: "User not found. Invalid credentials." };
      }
      const reference = `${type.substring(0,3).toLocaleLowerCase()}_txn_${Utils.generateString({alpha: true, number: true})}`
      // Initialize payment
      const paymentResponse: any = await initializePayment(
        user.email, 
        amount * 100, 
        config.FRONTEND_URL, 
        { assetId, type, endDate },
        reference
      );
  
      // Check if the payment initialization was successful (if applicable)
      if (!paymentResponse?.status) {
        return { success: false, message: "Payment initialization failed. Please try again." };
      }
      //
      await TransactionModel.create({
        currency: "NGN",
        amount,
        status: 'pending',
        reference,
        type: "CR",
        email: user.email,
        assetId,
        userId: authorizer!.id 
      })
      // Return success response
      return {
        success: true,
        message: "Payment initialized successfully.",
        data: paymentResponse.data
      };
    } catch (error) {
      console.error("Error in pay method:", error);
      return {
        success: false,
        message: "An unexpected error occurred while processing the payment.",
      };
    }
  }
  
}
