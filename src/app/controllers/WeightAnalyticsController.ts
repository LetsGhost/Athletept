import { Request, Response } from 'express';
import WeightAnalyticsService from '../services/WeightAnalyticsService.js';
import logger from '../../config/winstonLogger.js';

class WeightAnalyticsController {
    async createWeightAnalytics(req: Request, res: Response) {
        try{
            const userId = req.params.userId;

            const {success, code, message} = await WeightAnalyticsService.createWeightAnalytics(userId);

            if(success){
                logger.info('Weight analytics created', {service: 'WeightAnalyticsController.createWeightAnalytics'});
            }

            return res.status(code).json({ success, message });
        } catch(error) {
            logger.error('Error creating weight analytics:', error, {service: 'WeightAnalyticsController.createWeightAnalytics'});
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }

    async getWeightAnalytics(req: Request, res: Response) {
        try{
            const userId = req.params.userId;

            const {success, code, message, weightAnalytics} = await WeightAnalyticsService.getWeightAnalytics(userId);
    
            return res.status(code).json({ success, message, weightAnalytics });
        } catch(error) {
            logger.error('Error getting weight analytics:', error, {service: 'WeightAnalyticsController.getWeightAnalytics'});
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }

    async updateBodyWeightArray(req: Request, res: Response) {
        try{
            const userId = req.params.userId;
            const weight = req.body.weight;

            const {success, code, weightAnalytics} = await WeightAnalyticsService.updateBodyWeightArray(userId, weight);

            if(success){
                logger.info('Body weight array updated', {service: 'WeightAnalyticsController.updateBodyWeightArray'});
            }
    
            return res.status(code).json({ success, weightAnalytics });
        } catch(error) {
            logger.error('Error updating body weight array:', error, {service: 'WeightAnalyticsController.updateBodyWeightArray'});
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }

    async deleteWeight(req: Request, res: Response) {
        try{
            const userId = req.params.userId;
            const index = req.params.index;

            const {success, code, message, weightAnalytics} = await WeightAnalyticsService.deleteWeight(userId, Number(index));

            if(success){
                logger.info('Weight deleted', {service: 'WeightAnalyticsController.deleteWeight'});
            }
    
            return res.status(code).json({ success, message, weightAnalytics });
        } catch(error) {
            logger.error('Error deleting weight:', error, {service: 'WeightAnalyticsController.deleteWeight'});
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }
}

export default new WeightAnalyticsController();