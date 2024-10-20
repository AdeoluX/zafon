import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';


console.log('REDIS is ->', process.env.REDIS_URL)
export const redisClient = createClient({
  url: process.env.REDIS_URL
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Initialize Redis store
export const RedisStore = connectRedis(session);
