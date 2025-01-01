import Utils from "../utils/helper.utils";
import {
  Ipayment,
  IsignIn,
  IsignUp,
  Isubscribe,
  ServiceRes,
} from "./types/app.types";
import { IUser, UserModel } from "../models/user.schema";
import { config } from "../config";
import { initializePayment } from "../utils/paystack.utils";
import { TransactionModel } from "../models/transaction.schema";
import { AssetUserModel } from "../models/assetUser.schema";
import { AssetModel } from "../models/asset.schema";
import moment from "moment";
import mongoose from "mongoose";

export class WebhookService {
  public async webhook(payload: any): Promise<ServiceRes> {
    const { event, data: { metadata } } = payload;

    if (event === "charge.success") {
      if (metadata.type.toLowerCase() === "subscribe") {
        try {
          await WebhookService.handleSubscription(payload.data);
        } catch (error: any) {
          console.error("Error handling subscription: ", error!.message);
          return {
            success: false,
            message: "Error processing subscription.",
          };
        }
      }
    }

    return {
      success: true,
      message: "Event handled successfully.",
    };
  }

  public static async handleSubscription(data: any): Promise<void> {
    const { reference, status, amount, metadata } = data;

    const session = await mongoose.startSession(); // Start a MongoDB session
    session.startTransaction(); // Begin transaction

    try {
      // Fetch the transaction details
      const transaction = await TransactionModel.findOne({ reference }).session(session);

      if (!transaction) {
        throw new Error(`Transaction with reference ${reference} not found.`);
      }

      if (status === "success") {
        const asset = await AssetModel.findById(metadata.assetId).session(session);

        if (!asset) {
          throw new Error(`Asset with ID ${metadata.assetId} not found.`);
        }

        let amountEarned: number | undefined;
        const amountPaid = Number(amount) / 100;
        let endDate = metadata.endDate;

        // Calculate amount earned for 'lock' type assets
        if (asset.type === "lock") {
          const currentMoment = moment();
          const endMoment = moment(endDate);
          const days = Math.abs(endMoment.diff(currentMoment, "days"));

          amountEarned = (((Number(asset.rate) / 100 / 365) * days)) * amountPaid;

          // Create AssetUser entry
          await AssetUserModel.create(
            [
              {
                userId: transaction.userId,
                assetId: asset._id,
                amountPaid,
                amountEarned,
                endDate: metadata.endDate,
                status: "ongoing",
              },
            ],
            { session }
          );
        }
        // Calculate amount earned for 'fund' type assets
        if(asset.type === "fund") {
          //find if subscription already exists
          const subExists = await AssetUserModel.findOne({
            userId: transaction.userId,
            assetId: asset._id
          }).session(session)
          if(!subExists){
            // Create AssetUser entry
            await AssetUserModel.create(
              [
                {
                  userId: transaction.userId,
                  assetId: asset._id,
                  amountPaid,
                  amountEarned: 0,
                  endDate: moment().add(100, "years").format('YYYY-MM-DD'),
                  status: "ongoing",
                },
              ],
              { session }
            );
          } else {
            const updatedAmountPaid = amountPaid + subExists.amountPaid
            await AssetUserModel.updateOne(
              {
                userId: transaction.userId,
                assetId: asset._id,
              },
              {
                $set: { amountPaid: updatedAmountPaid },
              }
            ).session(session)
          }
        }

        // Validate and update transaction status
        if (Number(amount) / 100 === Number(transaction.amount)) {
          await TransactionModel.updateOne(
            { reference },
            { status },
            { session }
          );
        }
      }

      await session.commitTransaction(); // Commit the transaction
    } catch (error: any) {
      await session.abortTransaction(); // Roll back the transaction
      console.error("Transaction aborted: ", error!.message);
      throw error; // Re-throw error to handle it higher up
    } finally {
      session.endSession(); // End the session
    }
  }

  // public static async handleSubscription(data: any): Promise<void> {
  //   const { reference, status, amount, metadata } = data;
  
  //   const session = await mongoose.startSession(); // Start a MongoDB session
  //   session.startTransaction(); // Begin transaction
  
  //   try {
  //     // Fetch the transaction details
  //     const transaction = await TransactionModel.findOne({ reference }).session(session);
  
  //     if (!transaction) {
  //       throw new Error(`Transaction with reference ${reference} not found.`);
  //     }
  
  //     if (status === "success") {
  //       const asset = await AssetModel.findById(metadata.assetId).session(session);
  
  //       if (!asset) {
  //         throw new Error(`Asset with ID ${metadata.assetId} not found.`);
  //       }
  
  //       const amountPaid = Number(amount) / 100; // Convert amount to proper currency format
  //       const endDate = metadata.endDate;
  
  //       // Call the appropriate handler based on the asset type
  //       let amountEarned: number | undefined;
  
  //       switch (asset.type) {
  //         case "lock":
  //           amountEarned = await this.handleLockAsset(
  //             asset,
  //             amountPaid,
  //             endDate,
  //             transaction.userId,
  //             session
  //           );
  //           break;
  
  //         case "fund":
  //           await this.handleFundAsset(asset, amountPaid, transaction.userId, session);
  //           break;
  
  //         case "contribution":
  //           await this.handleContributionAsset(asset, amountPaid, transaction.userId, session);
  //           break;
  
  //         case "bond":
  //           await this.handleBondAsset(asset, amountPaid, endDate, transaction.userId, session);
  //           break;
  
  //         default:
  //           throw new Error(`Unsupported asset type: ${asset.type}`);
  //       }
  
  //       // Validate and update transaction status
  //       if (Number(amount) / 100 === Number(transaction.amount)) {
  //         await TransactionModel.updateOne({ reference }, { status }, { session });
  //       }
  //     }
  
  //     await session.commitTransaction(); // Commit the transaction
  //   } catch (error: any) {
  //     await session.abortTransaction(); // Roll back the transaction
  //     console.error("Transaction aborted: ", error.message);
  //     throw error; // Re-throw error to handle it higher up
  //   } finally {
  //     session.endSession(); // End the session
  //   }
  // }
  
}
