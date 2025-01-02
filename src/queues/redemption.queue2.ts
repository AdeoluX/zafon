// import Agenda, { Job, JobAttributesData } from 'agenda';
// import mongoose from 'mongoose';
// import { AssetUserModel } from '../models/assetUser.schema';
// import { TransactionModel } from '../models/transaction.schema';
// import Utils from '../utils/helper.utils';

// // Initialize Agenda with MongoDB as the backend
// export const agenda = new Agenda({
//   db: {
//     address: process.env.DATABASE_URL || 'mongodb://localhost:27017/agenda',
//     collection: 'jobs',
//   },
//   processEvery: '1 second', // Frequency to check for jobs
// });

// // Interface for job data
export interface RedemptionJobData {
  assetUserId: any;
  unitToRedeem?: any;
  userId: any;
  transactionId: any;
  amount?: any;
}

// // Define the redemption job
// agenda.define<RedemptionJobData>('redemption-job', async (job: Job<RedemptionJobData>) => {
//   const { assetUserId, unitToRedeem, userId, transactionId, amount } = job.attrs.data;
//   const maxAttempts = 5;
//   const backoffDelay = 10000; // Initial backoff delay in milliseconds

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     console.log(
//       `Processing redemption for assetUserId: ${assetUserId}, userId: ${userId}, units: ${unitToRedeem}, transactionId: ${transactionId}`
//     );

//     // Simulated transfer logic
//     const transfer = Utils.fakeTranfer(true);
//     if (transfer) {
//       const transaction = await TransactionModel.findById(transactionId).session(session);
//       const findAssetUser = await AssetUserModel.findById(assetUserId).session(session);

//       if (!transaction || !findAssetUser) {
//         throw new Error('Transaction or AssetUser not found.');
//       }

//       const balance: number = findAssetUser.amountPaid - transaction.amount;

//       // Update AssetUser and Transaction within the transaction
//       await AssetUserModel.updateOne(
//         { _id: assetUserId },
//         { amountPaid: balance },
//         { session }
//       );

//       await TransactionModel.updateOne(
//         { _id: transactionId },
//         { status: 'success' },
//         { session }
//       );
//     } else {
//       throw new Error('Transfer failed.');
//     }

//     await session.commitTransaction();
//     console.log(`Redemption successful for userId: ${userId}`);
//   } catch (error) {
//     await session.abortTransaction();
//     console.error(`Error processing redemption for job ${job.attrs._id}: ${error}`);

//     const attemptsMade = job.attrs.failCount || 0;

//     if (attemptsMade < maxAttempts) {
//       console.log(`Retrying job ${job.attrs._id}. Attempt ${attemptsMade + 1} of ${maxAttempts}`);
//       const nextDelay = backoffDelay * Math.pow(2, attemptsMade); // Exponential backoff
//       await job.schedule(new Date(Date.now() + nextDelay)).save();
//     } else {
//       console.error(`Job ${job.attrs._id} failed after ${maxAttempts} attempts.`);
//     }

//     throw error;
//   } finally {
//     session.endSession();
//   }
// });

// // Function to schedule a redemption job
// export const scheduleRedemptionJob = async (data: RedemptionJobData, scheduleTime: string) => {
//   await agenda.start();
//   await agenda.schedule(scheduleTime, 'redemption-job', data);
//   console.log(`Redemption job scheduled for ${scheduleTime}.`);
// };

// // Event listeners for monitoring
// agenda.on('fail:redemption-job', (error, job) => {
//   console.error(`Job ${job.attrs._id} failed with error: ${error.message}`);
// });

// agenda.on('complete:redemption-job', (job) => {
//   console.log(`Job ${job.attrs._id} completed successfully.`);
// });

// agenda.on('start:redemption-job', (job) => {
//   const attempts = job.attrs.failCount || 0;
//   console.log(`Starting job ${job.attrs._id}. Attempt: ${attempts + 1}`);
// });

// // Graceful shutdown
// // const gracefulShutdown = () => {
// //   agenda.stop(() => {
// //     // console.log('Agenda stopped gracefully.');
// //     // process.exit(0);
// //   });
// // };

// // process.on('SIGTERM', gracefulShutdown);
// // process.on('SIGINT', gracefulShutdown);
