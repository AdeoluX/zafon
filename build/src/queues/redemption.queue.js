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
exports.scheduleRedemptionJob = exports.pulse = void 0;
const pulse_1 = __importDefault(require("@pulsecron/pulse"));
const mongoose_1 = __importDefault(require("mongoose"));
const assetUser_schema_1 = require("../models/assetUser.schema");
const transaction_schema_1 = require("../models/transaction.schema");
const helper_utils_1 = __importDefault(require("../utils/helper.utils"));
const mongoConnectionString = 'mongodb://localhost:27017/pulse';
exports.pulse = new pulse_1.default({ db: { address: process.env.DATABASE_URL || 'mongodb://localhost:27017/agenda', collection: 'jobQueue' } });
// Or override the default collection name:
// const pulse = new Pulse({db: {address: mongoConnectionString, collection: 'jobCollectionName'}});
// or pass additional connection options:
// const pulse = new Pulse({db: {address: mongoConnectionString, collection: 'jobCollectionName', options: {ssl: true}}});
// or pass in an existing mongodb-native MongoClient instance
// const pulse = new Pulse({mongo: myMongoClient});
/**
 * Example of defining a job
 */
exports.pulse.define('redemption-job', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { assetUserId, unitToRedeem, userId, transactionId, amount } = job.attrs.data;
    //   const maxAttempts = 5;
    //   const backoffDelay = 10000; // Initial backoff delay in milliseconds
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        console.log(`Processing redemption for assetUserId: ${assetUserId}, userId: ${userId}, units: ${unitToRedeem}, transactionId: ${transactionId}`);
        // Simulated transfer logic
        const transfer = helper_utils_1.default.fakeTranfer(true);
        if (transfer) {
            const transaction = yield transaction_schema_1.TransactionModel.findById(transactionId).session(session);
            const findAssetUser = yield assetUser_schema_1.AssetUserModel.findById(assetUserId).session(session);
            if (!transaction || !findAssetUser) {
                throw new Error('Transaction or AssetUser not found.');
            }
            const balance = findAssetUser.amountPaid - transaction.amount;
            // Update AssetUser and Transaction within the transaction
            yield assetUser_schema_1.AssetUserModel.updateOne({ _id: assetUserId }, { amountPaid: balance }, { session });
            yield transaction_schema_1.TransactionModel.updateOne({ _id: transactionId }, { status: 'success' }, { session });
        }
        else {
            throw new Error('Transfer failed.');
        }
        yield session.commitTransaction();
        console.log(`Redemption successful for userId: ${userId}`);
    }
    catch (error) {
        yield session.abortTransaction();
        console.error(`Error processing redemption for job ${job.attrs._id}: ${error}`);
        const attemptsMade = job.attrs.failCount || 0;
        if (attemptsMade < job.attrs.attempts) {
            console.log(`Retrying job ${job.attrs._id}. Attempt ${attemptsMade + 1} of ${job.attrs.attempts}`);
            const nextDelay = job.attrs.backoff.delay * Math.pow(2, attemptsMade); // Exponential backoff
            yield job.schedule(new Date(Date.now() + nextDelay)).save();
        }
        else {
            console.error(`Job ${job.attrs._id} failed after ${job.attrs.attempts} attempts.`);
        }
        throw error;
    }
    finally {
        session.endSession();
    }
}), { shouldSaveResult: true, attempts: 4, backoff: { type: 'exponential', delay: 1000 } });
const scheduleRedemptionJob = (data, scheduleTime) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.pulse.start();
    yield exports.pulse.schedule(scheduleTime, 'redemption-job', data);
    console.log(`Redemption job scheduled for ${scheduleTime}.`);
});
exports.scheduleRedemptionJob = scheduleRedemptionJob;
/**
 * Example of repeating a job
 */
// (async function () {
//   // IIFE to give access to async/await
//   await pulse.start();
//   await pulse.every('3 minutes', 'delete old users');
//   // Alternatively, you could also do:
//   await pulse.every('*/3 * * * *', 'delete old users');
// })();
/**
 * Example of defining a job with options
 */
// pulse.define(
//   'send email report',
//   async (job) => {
//     const { to } = job.attrs.data;
//     console.log(`Sending email report to ${to}`);
//   },
//   { lockLifetime: 5 * 1000, priority: 'high', concurrency: 10 }
// );
/**
 * Example of scheduling a job
 */
// (async function () {
//   await pulse.start();
//   await pulse.schedule('in 20 minutes', 'send email report', { to: 'admin@example.com' });
// })();
/**
 * Example of repeating a job
 */
// (async function () {
//   const weeklyReport = pulse.create('send email report', { to: 'example@example.com' });
//   await pulse.start();
//   await weeklyReport.repeatEvery('1 week').save();
// })();
/**
 * Check job start and completion/failure
 */
exports.pulse.on('start', (job) => {
    console.log(time(), `Job <${job.attrs.name}> starting`);
});
exports.pulse.on('success', (job) => {
    console.log(time(), `Job <${job.attrs.name}> succeeded`);
});
exports.pulse.on('fail', (error, job) => {
    console.log(time(), `Job <${job.attrs.name}> failed:`, error);
});
function time() {
    return new Date().toTimeString().split(' ')[0];
}
//# sourceMappingURL=redemption.queue.js.map