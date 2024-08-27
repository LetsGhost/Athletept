import rateLimit from 'express-rate-limit';
import logger from '../../config/winstonLogger.js';
import getClientIp from '../utils/ipUtils.js';
import dotenv from 'dotenv';
dotenv.config();
// Define the rate limit rule
const rateLimiter = rateLimit({
    windowMs: Number(process.env.LIMITER_WINDOW_MS) || 24 * 60 * 60 * 1000, // 15 minutes
    max: Number(process.env.LIMITER_MAX) || 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        const ip = getClientIp(req);
        logger.warn(`Rate limit exceeded by IP: ${ip}`, { service: 'Limiter' });
        res.status(429).send("Too many requests from this IP, please try again later.");
    }
});
export default rateLimiter;
