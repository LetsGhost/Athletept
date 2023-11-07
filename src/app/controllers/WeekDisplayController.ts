import { Request, Response } from 'express';
import WeekDisplayService from '../services/WeekDisplayService';

class WeekDisplayController {
    async createWeekDisplay(req: Request, res: Response) {
        try{
            const { userId, trainingsWeek } = req.body;

            const trainingsWeekDisplay = await WeekDisplayService.createWeekDisplay(userId, trainingsWeek);
    
            if(trainingsWeekDisplay == false){
                res.status(404).json({Success: false, error: "User not found"});
            }
    
            res.status(201).json({Success: true, trainingsWeekDisplay});
        } catch(error) {
            throw error;
        }
    }
}

export default new WeekDisplayController();