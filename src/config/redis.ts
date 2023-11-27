import Redis from 'ioredis';
import logger from './winstonLogger';

let redisClient: Redis | null = null;

const connectToRedis = async (): Promise<Redis | null> => {

  try {
    const redisUrl = `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`;
    logger.info(`Connecting to Redis at ${redisUrl}`, { service: 'connectToRedis' });

    redisClient = new Redis(redisUrl);
  } catch (err) {
    logger.error(`Failed to connect or ping Redis: ${err}`, { service: 'connectToRedis' });
  }

  return redisClient;
};

export { connectToRedis, redisClient };