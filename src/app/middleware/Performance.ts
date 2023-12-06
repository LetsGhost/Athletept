import { Request, Response, NextFunction } from 'express';
import logger from '../../config/winstonLogger.js';
import { redisClient } from '../../config/redis.js'; // import the Redis client from server.ts

export async function logResourceUsage(): Promise<void> {
  try{
    const usage = process.cpuUsage();
    const memUsage = process.memoryUsage();

    const cpuUsage = ((usage.user + usage.system) / 1000).toFixed(2);
    const rssMemUsage = (memUsage.rss / 1024 / 1024).toFixed(2);
    const heapUsed = (memUsage.heapUsed / 1024 / 1024).toFixed(2);

    const timestamp = new Date().toISOString();

    if(redisClient){
      const key = 'resourceUsage';

      await redisClient.lpush(key, `[${timestamp}] CPU usage: ${cpuUsage}ms, Memory usage: ${rssMemUsage}MB, Heap used: ${heapUsed}MB`);
      await redisClient.ltrim(key, 0, 9); // Keep only the last 10 durations
      
    }
  } catch(err) {
    logger.error(`Failed to log resource usage: ${err}`, {service: 'ResourceLogger'});
  }
}

export async function logRequestMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
  const method = req.method;

  if (redisClient) {
    // Increment the count for the method in the Redis hash
    await redisClient.hincrby('methodCounters', method, 1);
  }

  next();
}


