import { Queue } from 'bull';
import Bull from 'bull';
import { config } from 'config';

// Create the queue
export const RedemptionQueue: Queue = new Bull('redemption-queue', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: config.REDIS_PORT,
  },
  defaultJobOptions: {
    attempts: 5, // Retry up to 5 times
    backoff: {
      type: 'exponential', // Retry strategy
      delay: 10000,         // Start with 3-second delay
    },
  },
});

// Process the queue (this could be in a separate worker)
RedemptionQueue.process('process-redemption', async (job) => {
  const { assetUserId, unitToRedeem, userId } = job.data;

  console.log(`Processing redemption for assetUserId: ${assetUserId}, userId: ${userId}, units: ${unitToRedeem}`);
  // Add your logic to handle the redemption process (e.g., update balances, notify user, etc.)
});

RedemptionQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts: ${err.message}`);
    // Optional: Notify admin or log for manual action
});
  
RedemptionQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed successfully with result:`, result);
});