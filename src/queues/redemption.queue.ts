import Pulse from '@pulsecron/pulse';
import mongoose from 'mongoose';
import { AssetUserModel } from '../models/assetUser.schema';
import { TransactionModel } from '../models/transaction.schema';
import Utils from '../utils/helper.utils';
import { config } from '../config';

const mongoConnectionString = 'mongodb://localhost:27017/pulse';

export const pulse = new Pulse({ db: { address: config.DATABASE_URL, collection: 'jobQueue' } });

// Or override the default collection name:
// const pulse = new Pulse({db: {address: mongoConnectionString, collection: 'jobCollectionName'}});

// or pass additional connection options:
// const pulse = new Pulse({db: {address: mongoConnectionString, collection: 'jobCollectionName', options: {ssl: true}}});

// or pass in an existing mongodb-native MongoClient instance
// const pulse = new Pulse({mongo: myMongoClient});

/**
 * Example of defining a job
 */
pulse.define<any>('redemption-job', async (job: any) => {
  const { assetUserId, unitToRedeem, userId, transactionId, amount } = job.attrs.data;
//   const maxAttempts = 5;
//   const backoffDelay = 10000; // Initial backoff delay in milliseconds

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(
      `Processing redemption for assetUserId: ${assetUserId}, userId: ${userId}, units: ${unitToRedeem}, transactionId: ${transactionId}`
    );

    // Simulated transfer logic
    const transfer = Utils.fakeTranfer(true);
    if (transfer) {
      const transaction = await TransactionModel.findById(transactionId).session(session);
      const findAssetUser = await AssetUserModel.findById(assetUserId).session(session);

      if (!transaction || !findAssetUser) {
        throw new Error('Transaction or AssetUser not found.');
      }

      const balance: number = findAssetUser.amountPaid - transaction.amount;

      // Update AssetUser and Transaction within the transaction
      await AssetUserModel.updateOne(
        { _id: assetUserId },
        { amountPaid: balance },
        { session }
      );

      await TransactionModel.updateOne(
        { _id: transactionId },
        { status: 'success' },
        { session }
      );
    } else {
      throw new Error('Transfer failed.');
    }

    await session.commitTransaction();
    console.log(`Redemption successful for userId: ${userId}`);
  } catch (error) {
    await session.abortTransaction();
    console.error(`Error processing redemption for job ${job.attrs._id}: ${error}`);

    const attemptsMade = job.attrs.failCount || 0;

    if (attemptsMade < job.attrs.attempts) {
      console.log(`Retrying job ${job.attrs._id}. Attempt ${attemptsMade + 1} of ${job.attrs.attempts}`);
      const nextDelay = job.attrs.backoff.delay * Math.pow(2, attemptsMade); // Exponential backoff
      await job.schedule(new Date(Date.now() + nextDelay)).save();
    } else {
      console.error(`Job ${job.attrs._id} failed after ${job.attrs.attempts} attempts.`);
    }

    throw error;
  } finally {
    session.endSession();
  }
}, { shouldSaveResult: true, attempts: 4, backoff: { type: 'exponential', delay: 1000 } });


export const scheduleRedemptionJob = async (data: any, scheduleTime: string) => {
  await pulse.start();
  await pulse.schedule(scheduleTime, 'redemption-job', data);
  console.log(`Redemption job scheduled for ${scheduleTime}.`);
};
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
pulse.on('start', (job) => {
  console.log(time(), `Job <${job.attrs.name}> starting`);
});
pulse.on('success', (job) => {
  console.log(time(), `Job <${job.attrs.name}> succeeded`);
});
pulse.on('fail', (error, job) => {
  console.log(time(), `Job <${job.attrs.name}> failed:`, error);
});

function time() {
  return new Date().toTimeString().split(' ')[0];
}