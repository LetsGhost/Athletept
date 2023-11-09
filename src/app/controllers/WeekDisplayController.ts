import { Request, Response } from 'express';
import WeekDisplayService from '../services/WeekDisplayService';

class WeekDisplayController {
    async createWeekDisplay(req: Request, res: Response) {
        try{
            const { trainingsWeek } = req.body;
            const userId = req.params.userId;

            const { success, code, message, weekDisplay } = await WeekDisplayService.createWeekDisplay(userId, trainingsWeek);
    
            res.status(code).json({success, message, weekDisplay});
        } catch(error) {
            console.log("Error creating week display in Controller: ", error);
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }

    async getWeekDisplay(req: Request, res: Response) {
        try{
            const userId = req.params.userId;

            const { success, code, message, weekDisplay } = await WeekDisplayService.getWeekDisplay(userId);
    
            res.status(code).json({success, message, weekDisplay});
        } catch(error) {
            console.log("Error getting week display in Controller: ", error);
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }

    async updateWeekDisplay(req: Request, res: Response) {
        try{
            const { trainingsWeek } = req.body;
            const userId = req.params.userId;

            const { success, code, message, weekDisplay } = await WeekDisplayService.updateWeekDisplay(userId, trainingsWeek);
    
            res.status(code).json({success, message, weekDisplay});
        } catch(error) {
            console.log("Error updating week display in Controller: ", error);
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }
}

export default new WeekDisplayController();