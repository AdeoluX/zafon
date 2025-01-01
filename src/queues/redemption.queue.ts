import Agenda from 'agenda';
import moment from 'moment';
import Utils from '../utils/helper.utils';
import { AssetUserModel } from '../models/assetUser.schema';
import { TransactionModel } from '../models/transaction.schema';
import mongoose from 'mongoose';

// Initialize Agenda with MongoDB as the backend
export const agenda = new Agenda({
  db: {
    address: process.env.DATABASE_URL || 'mongodb://localhost:27017/agenda',
    collection: 'jobs',
  },
  processEvery: '1 second', // Frequency to check for jobs
});

// Define the redemption job with attempts and delay logic
agenda.define<any>('redemption-job', async (job: any) => {
  let { assetUserId, unitToRedeem, userId, transactionId, amount } = job.attrs.data;
  const maxAttempts = 5; // Maximum retry attempts
  const backoffDelay = 10000; // Initial delay in milliseconds (10 seconds)

  const session = await mongoose.startSession(); // Start MongoDB transaction session
  session.startTransaction();

  try {
    console.log(
      `Processing redemption for assetUserId: ${assetUserId}, userId: ${userId}, units: ${unitToRedeem}, transactionId: ${transactionId}`
    );
    
    // Fake transfer (you can replace this with actual transfer logic)
    const transfer = Utils.fakeTranfer(true);
    if (transfer) {
      const transaction = await TransactionModel.findById(transactionId).session(session);
      const findAssetUser = await AssetUserModel.findById(assetUserId).session(session);

      if (!transaction || !findAssetUser) {
        throw new Error('Transaction or AssetUser not found.');
      }

      const balance: number = findAssetUser.amountPaid - transaction.amount;

      // Update AssetUser and Transaction within the same transaction
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
    }else{
        throw new Error("Transfer failed.");
    }

    // Commit the transaction after all the operations succeed
    await session.commitTransaction();
    console.log(`Redemption successful for userId: ${userId}`);
  } catch (error) {
    // Rollback the transaction in case of any error
    await session.abortTransaction();
    console.error(`Error processing redemption for job ${job.attrs._id}: ${error}`);

    // Retry logic
    const attemptsMade = job.attrs.failCount || 0;

    if (attemptsMade < maxAttempts) {
      console.log(`Retrying job ${job.attrs._id}. Attempt ${attemptsMade + 1} of ${maxAttempts}`);

      // Apply backoff logic and reschedule the job
      const nextDelay = backoffDelay * Math.pow(2, attemptsMade); // Exponential backoff
      await job.schedule(new Date(Date.now() + nextDelay)).save();
    } else {
      console.error(`Job ${job.attrs._id} failed after ${maxAttempts} attempts.`);
    }

    throw error; // Mark the job as failed
  } finally {
    // End the session (either commit or abort)
    session.endSession();
  }
});

// Schedule a new redemption job
export const scheduleRedemptionJob = async (data: { assetUserId: string; unitToRedeem?: number; userId: string; transactionId: any; amount?: number; }) => {
  await agenda.start();
  await agenda.schedule(moment().add(2, 'minutes').toISOString(),'redemption-job', data);
  console.log('Redemption job scheduled.');
};

// Event listeners for monitoring
agenda.on('fail:redemption-job', (error, job) => {
  console.error(`Job ${job.attrs._id} failed with error: ${error.message}`);
});

agenda.on('complete:redemption-job', (job) => {
  console.log(`Job ${job.attrs._id} completed successfully.`);
});

agenda.on('start:redemption-job', (job) => {
  const attempts = job.attrs.failCount || 0;
  console.log(`Starting job ${job.attrs._id}. Attempt: ${attempts + 1}`);
});
