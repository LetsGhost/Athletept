import { Request, Response } from 'express';
import WeightAnalyticsService from '../services/WeightAnalyticsService';

class WeightAnalyticsController {
    async createWeightAnalytics(req: Request, res: Response) {
        const userId = req.params.userId;

        const {success, code, message} = await WeightAnalyticsService.createWeightAnalytics(userId);

        return res.status(code).json({ success, message });
    }

    async getWeightAnalytics(req: Request, res: Response) {
        const userId = req.params.userId;

        const {success, code, message, weightAnalytics} = await WeightAnalyticsService.getWeightAnalytics(userId);

        return res.status(code).json({ success, message, weightAnalytics });
    }
}

export default new WeightAnalyticsController();