import Redis from 'ioredis';
import logger from './winstonLogger';

let redisClient: Redis | null = null;

const connectToRedis = async (): Promise<Redis | null> => {
  // redis://:password@localhost:6379
  try {    
    const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
    console.log(`REDIS_URL: ${redisUrl}`); // Add this line
    if (!redisUrl) {
      logger.error('REDIS_URL is not defined', { service: 'connectToRedis' });
      return null;
    }

    logger.info(`Connecting to Redis at ${redisUrl}`, { service: 'connectToRedis' });

    redisClient = new Redis(redisUrl);

    redisClient.on('error', (err) => {
      console.error('Error connecting to Redis:', err);
    });
  } catch (err) {
    logger.error(`Failed to connect or ping Redis: ${err}`, { service: 'connectToRedis' });
  }

  return redisClient;
};

export { connectToRedis, redisClient };