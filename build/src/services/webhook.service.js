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
exports.WebhookService = void 0;
const transaction_schema_1 = require("../models/transaction.schema");
const assetUser_schema_1 = require("../models/assetUser.schema");
const asset_schema_1 = require("../models/asset.schema");
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
class WebhookService {
    webhook(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { event, data: { metadata } } = payload;
            if (event === "charge.success") {
                if (metadata.type.toLowerCase() === "subscribe") {
                    try {
                        yield WebhookService.handleSubscription(payload.data);
                    }
                    catch (error) {
                        console.error("Error handling subscription: ", error.message);
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
        });
    }
    static handleSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reference, status, amount, metadata } = data;
            const session = yield mongoose_1.default.startSession(); // Start a MongoDB session
            session.startTransaction(); // Begin transaction
            try {
                // Fetch the transaction details
                const transaction = yield transaction_schema_1.TransactionModel.findOne({ reference }).session(session);
                if (!transaction) {
                    throw new Error(`Transaction with reference ${reference} not found.`);
                }
                if (status === "success") {
                    const asset = yield asset_schema_1.AssetModel.findById(metadata.assetId).session(session);
                    if (!asset) {
                        throw new Error(`Asset with ID ${metadata.assetId} not found.`);
                    }
                    let amountEarned;
                    const amountPaid = Number(amount) / 100;
                    let endDate = metadata.endDate;
                    // Calculate amount earned for 'lock' type assets
                    if (asset.type === "lock") {
                        const currentMoment = (0, moment_1.default)();
                        const endMoment = (0, moment_1.default)(endDate);
                        const days = Math.abs(endMoment.diff(currentMoment, "days"));
                        amountEarned = (((Number(asset.rate) / 100 / 365) * days)) * amountPaid;
                        // Create AssetUser entry
                        yield assetUser_schema_1.AssetUserModel.create([
                            {
                                userId: transaction.userId,
                                assetId: asset._id,
                                amountPaid,
                                amountEarned,
                                endDate: metadata.endDate,
                                status: "ongoing",
                            },
                        ], { session });
                    }
                    // Calculate amount earned for 'fund' type assets
                    if (asset.type === "fund") {
                        //find if subscription already exists
                        const subExists = yield assetUser_schema_1.AssetUserModel.findOne({
                            userId: transaction.userId,
                            assetId: asset._id
                        }).session(session);
                        if (!subExists) {
                            // Create AssetUser entry
                            yield assetUser_schema_1.AssetUserModel.create([
                                {
                                    userId: transaction.userId,
                                    assetId: asset._id,
                                    amountPaid,
                                    amountEarned: 0,
                                    endDate: (0, moment_1.default)().add(100, "years").format('YYYY-MM-DD'),
                                    status: "ongoing",
                                },
                            ], { session });
                        }
                        else {
                            const updatedAmountPaid = amountPaid + subExists.amountPaid;
                            yield assetUser_schema_1.AssetUserModel.updateOne({
                                userId: transaction.userId,
                                assetId: asset._id,
                            }, {
                                $set: { amountPaid: updatedAmountPaid },
                            }).session(session);
                        }
                    }
                    // Validate and update transaction status
                    if (Number(amount) / 100 === Number(transaction.amount)) {
                        yield transaction_schema_1.TransactionModel.updateOne({ reference }, { status }, { session });
                    }
                }
                yield session.commitTransaction(); // Commit the transaction
            }
            catch (error) {
                yield session.abortTransaction(); // Roll back the transaction
                console.error("Transaction aborted: ", error.message);
                throw error; // Re-throw error to handle it higher up
            }
            finally {
                session.endSession(); // End the session
            }
        });
    }
}
exports.WebhookService = WebhookService;
//# sourceMappingURL=webhook.service.js.map