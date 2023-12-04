import { Request, Response } from 'express';
import WeekDisplayService from '../services/WeekDisplayService.js';
import logger from '../../config/winstonLogger.js';

class WeekDisplayController {
    async createWeekDisplay(req: Request, res: Response) {
        try{
            const { trainingsWeek } = req.body;
            const userId = req.params.userId;

            const { success, code, message, weekDisplay } = await WeekDisplayService.createWeekDisplay(userId, trainingsWeek);

            if(success){
                logger.info('Week display created', {service: 'WeekDisplayController.createWeekDisplay'});
            }
    
            res.status(code).json({success, message, weekDisplay});
        } catch(error) {
            logger.error('Error creating week display:', error, {service: 'WeekDisplayController.createWeekDisplay'});
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }

    async getWeekDisplay(req: Request, res: Response) {
        try{
            const userId = req.params.userId;

            const { success, code, message, weekDisplay } = await WeekDisplayService.getWeekDisplay(userId);
    
            res.status(code).json({success, message, weekDisplay});
        } catch(error) {
            logger.error('Error getting week display:', error, {service: 'WeekDisplayController.getWeekDisplay'});
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }

    async updateWeekDisplay(req: Request, res: Response) {
        try{
            const { trainingsWeek } = req.body;
            const userId = req.params.userId;

            const { success, code, message, weekDisplay } = await WeekDisplayService.updateWeekDisplay(userId, trainingsWeek);

            if(success){
                logger.info('Week display updated', {service: 'WeekDisplayController.updateWeekDisplay'});
            }
    
            res.status(code).json({success, message, weekDisplay});
        } catch(error) {
            logger.error('Error updating week display:', error, {service: 'WeekDisplayController.updateWeekDisplay'});
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }
}

export default new WeekDisplayController();