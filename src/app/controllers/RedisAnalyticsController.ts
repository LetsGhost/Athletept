import { Request, Response } from 'express';
import RedisAnalyticsService from '../services/RedisAnalyticsService';

class RedisAnalyticsController {
    async getDurations(req: Request, res: Response) {
        const path = req.params.path;
        const durations = await RedisAnalyticsService.getDurations(path);
        res.json(durations);
    }
}

export default new RedisAnalyticsController();