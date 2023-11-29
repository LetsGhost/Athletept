import { Request, Response, NextFunction } from 'express';
import logger from '../../config/winstonLogger';
import { redisClient } from '../../config/redis'; // import the Redis client from server.ts

export function performanceLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', async () => { 
    const duration = Date.now() - start;
    const today = new Date().toISOString().slice(0, 10);

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
      console.log('Resource usage logged' + `[${timestamp}] CPU usage: ${cpuUsage}ms, Memory usage: ${rssMemUsage}MB, Heap used: ${heapUsed}MB`);
    }
  } catch(err) {
    logger.error(`Failed to log resource usage: ${err}`, {service: 'ResourceLogger'});
  }
}


