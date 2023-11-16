import { Request, Response } from 'express';
import WeightAnalyticsService from '../services/WeightAnalyticsService';

class WeightAnalyticsController {
    async createWeightAnalytics(req: Request, res: Response) {
        const userId = req.params.userId;

        const {success, code, message} = await WeightAnalyticsService.createWeightAnalytics(userId);

        return res.status(code).json({ success, message });
    }
}

export default new WeightAnalyticsController();