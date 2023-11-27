import { Request, Response, NextFunction } from 'express';
import logger from '../../config/winstonLogger';

export function performanceLogger(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    res.on('finish', () => { 
        const duration = Date.now() - start;
        logger.info(`Request to ${req.path} took ${duration}ms`, {service: 'PerformanceLogger'});
    });
    next();
}