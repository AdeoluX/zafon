"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const helper_utils_1 = __importDefault(require("../utils/helper.utils"));
const user_schema_1 = require("../models/user.schema");
const config_1 = require("../config");
const paystack_utils_1 = require("../utils/paystack.utils");
const transaction_schema_1 = require("../models/transaction.schema");
const assetUser_schema_1 = require("../models/assetUser.schema");
const asset_schema_1 = require("../models/asset.schema");
const redemption_queue_1 = require("../queues/redemption.queue");
class UserService {
    subscribe(payload) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    portfolio(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = payload;
            const allAssetUser = yield assetUser_schema_1.AssetUserModel.find({
                userId: id
            }).populate("assetId").exec();
            const allValues = [];
            for (const item of allAssetUser) {
                const totalValue = item.amountPaid + item.amountEarned;
                allValues.push(totalValue);
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
        });
    }
    assetTransactionHistory(assetUserId, paginateOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const assetUser = yield assetUser_schema_1.AssetUserModel.findById(assetUserId);
            if (!assetUser)
                return {
                    success: true,
                    message: 'Asset user id is invalid.'
                };
            const { userId, assetId } = assetUser;
            const transactions = yield transaction_schema_1.TransactionModel.find({
                userId, assetId
            }).skip(paginateOptions.skip).limit(paginateOptions.perPage);
            return {
                success: true,
                message: 'Transactions gotten successfully',
                data: transactions
            };
        });
    }
    redeemAsset(payload, assetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { unitToRedeem, amount, authorizer } = payload;
            // Validate asset user
            const assetUser = yield assetUser_schema_1.AssetUserModel.findById(assetUserId);
            if (!assetUser) {
                return { success: false, message: "Invalid asset user ID" };
            }
            // Get the associated asset
            const asset = yield asset_schema_1.AssetModel.findById(assetUser.assetId);
            if (!asset) {
                return { success: false, message: "Asset not found" };
            }
            // Get the user (authorizer)
            const user = yield user_schema_1.UserModel.findById(authorizer === null || authorizer === void 0 ? void 0 : authorizer.id);
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
                if (redemptionAmount > assetUser.amountPaid)
                    return {
                        success: false,
                        message: 'Insufficient balance to redeem from'
                    };
                // Create a pending transaction
                const transaction = yield transaction_schema_1.TransactionModel.create({
                    currency: "NGN",
                    amount: redemptionAmount,
                    status: "pending",
                    reference: `rdmp_txn_${helper_utils_1.default.generateString({ alpha: true, number: true })}`,
                    type: "DR", // Debit transaction
                    email: user.email,
                    assetId: assetUser.assetId,
                    userId: authorizer.id,
                });
                if (!transaction)
                    return {
                        success: false,
                    };
                const redemptionData = {
                    assetUserId,
                    unitToRedeem,
                    userId: authorizer.id,
                    transactionId: transaction._id
                };
                yield (0, redemption_queue_1.scheduleRedemptionJob)(redemptionData, new Date(Date.now() + 2 * 60 * 1000).toISOString());
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
            }
            else {
                // Handle other asset types (if any logic is required)
                return { success: false, message: "Redemption is not supported for this asset type." };
            }
        });
    }
    topUp(payload, assetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, authorizer } = payload;
                // Validate payload structure
                if (!amount || !(authorizer === null || authorizer === void 0 ? void 0 : authorizer.id) || !assetUserId) {
                    return { success: false, message: "Invalid payment payload" };
                }
                // find AssetUser
                const assetUser = yield assetUser_schema_1.AssetUserModel.findOne({
                    _id: assetUserId
                });
                if (!assetUser) {
                    return { success: false, message: "Invalid asset user id" };
                }
                const asset = yield asset_schema_1.AssetModel.findById(assetUser.assetId);
                if ((asset === null || asset === void 0 ? void 0 : asset.type) === 'lock') {
                    return { success: false, message: "You cannot top up a locked plan, create a new one." };
                }
                // Fetch user details
                const user = yield user_schema_1.UserModel.findOne({ _id: authorizer.id });
                if (!user) {
                    return { success: false, message: "User not found. Invalid credentials." };
                }
                const reference = `${asset === null || asset === void 0 ? void 0 : asset.type.substring(0, 3).toLocaleLowerCase()}_txn_${helper_utils_1.default.generateString({ alpha: true, number: true })}`;
                // Initialize payment
                const paymentResponse = yield (0, paystack_utils_1.initializePayment)(user.email, amount * 100, config_1.config.FRONTEND_URL, { assetId: assetUser === null || assetUser === void 0 ? void 0 : assetUser.assetId, type: asset === null || asset === void 0 ? void 0 : asset.type, endDate: assetUser.endDate }, reference);
                // Check if the payment initialization was successful (if applicable)
                if (!(paymentResponse === null || paymentResponse === void 0 ? void 0 : paymentResponse.status)) {
                    return { success: false, message: "Payment initialization failed. Please try again." };
                }
                //
                yield transaction_schema_1.TransactionModel.create({
                    currency: "NGN",
                    amount,
                    status: 'pending',
                    reference,
                    type: "CR",
                    email: user.email,
                    assetId: assetUser === null || assetUser === void 0 ? void 0 : assetUser.assetId,
                    userId: authorizer.id
                });
                // Return success response
                return {
                    success: true,
                    message: "Payment initialized successfully.",
                    data: paymentResponse.data
                };
            }
            catch (error) {
                console.error("Error in pay method:", error);
                return {
                    success: false,
                    message: "An unexpected error occurred while processing the payment.",
                };
            }
        });
    }
    pay(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, authorizer, assetId, type, endDate } = payload;
                // Validate payload structure
                if (!amount || !(authorizer === null || authorizer === void 0 ? void 0 : authorizer.id) || !assetId || !type) {
                    return { success: false, message: "Invalid payment payload" };
                }
                const asset = yield asset_schema_1.AssetModel.findById(assetId);
                if ((asset.type === 'bond' || asset.type === 'fund') && !(amount % asset.unitPrice === 0))
                    return {
                        success: false,
                        message: `Amount should be multiples of ${asset.unitPrice}`
                    };
                // Fetch user details
                const user = yield user_schema_1.UserModel.findOne({ _id: authorizer.id });
                if (!user) {
                    return { success: false, message: "User not found. Invalid credentials." };
                }
                const reference = `${type.substring(0, 3).toLocaleLowerCase()}_txn_${helper_utils_1.default.generateString({ alpha: true, number: true })}`;
                // Initialize payment
                const paymentResponse = yield (0, paystack_utils_1.initializePayment)(user.email, amount * 100, config_1.config.FRONTEND_URL, { assetId, type, endDate }, reference);
                // Check if the payment initialization was successful (if applicable)
                if (!(paymentResponse === null || paymentResponse === void 0 ? void 0 : paymentResponse.status)) {
                    return { success: false, message: "Payment initialization failed. Please try again." };
                }
                //
                yield transaction_schema_1.TransactionModel.create({
                    currency: "NGN",
                    amount,
                    status: 'pending',
                    reference,
                    type: "CR",
                    email: user.email,
                    assetId,
                    userId: authorizer.id
                });
                // Return success response
                return {
                    success: true,
                    message: "Payment initialized successfully.",
                    data: paymentResponse.data
                };
            }
            catch (error) {
                console.error("Error in pay method:", error);
                return {
                    success: false,
                    message: "An unexpected error occurred while processing the payment.",
                };
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map