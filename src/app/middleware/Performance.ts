import { Request, Response, NextFunction } from 'express';
import logger from '../../config/winstonLogger';
import { redisClient } from '../../config/redis'; // import the Redis client from server.ts

export function performanceLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', async () => { 
    const duration = Date.now() - start;
    const today = new Date().toISOString().slice(0, 10);
    logger.info(`Request to ${req.path} took ${duration}ms`, {service: 'PerformanceLogger'});

    if (redisClient) {
      try {
        // Store the request duration in Redis
        const pathParts = req.path.split('/');
        const key = `${pathParts[1]}:durations`; // Use only the first part of the path
        await redisClient.lpush(key, `[${today}]Execution duration: ${duration}ms`);
        await redisClient.ltrim(key, 0, 9); // Keep only the last 10 durations
      } catch (err) {
        logger.error(`Failed to store request duration in Redis: ${err}`, { service: 'PerformanceLogger' });
      }
    }
  });

  next();
}