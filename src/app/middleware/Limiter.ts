import rateLimit from 'express-rate-limit';
import logger from '../../config/winstonLogger.js';
import { Request, Response, NextFunction } from 'express';
import getClientIp from '../utils/ipUtils.js';
import dotenv from 'dotenv';
dotenv.config();

// Define the rate limit rule
const limiter = rateLimit({
  windowMs: Number(process.env.LIMITER_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.LIMITER_MAX) || 100, // limit each IP to 100 requests per windowMs
  handler: (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIp(req);
    logger.warn(`Rate limit exceeded by IP: ${ip}`, {service: 'Limiter'});
    res.status(429).send("Too many requests from this IP, please try again later.");
  }
});

export default limiter;