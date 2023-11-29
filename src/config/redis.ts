import Redis from 'ioredis';
import logger from './winstonLogger';

let redisClient: Redis | null = null;

const connectToRedis = async (): Promise<Redis | null> => {
  // redis://:password@localhost:6379
  try {
    const redisUrl = `process.env.REDIS_URL`;
    logger.info(`Connecting to Redis at ${redisUrl}`, { service: 'connectToRedis' });

    redisClient = new Redis(redisUrl);
  } catch (err) {
    logger.error(`Failed to connect or ping Redis: ${err}`, { service: 'connectToRedis' });
  }

  return redisClient;
};

export { connectToRedis, redisClient };