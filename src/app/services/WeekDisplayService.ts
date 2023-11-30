import {WeekDisplay} from '../models/WeekDisplayModel';
import UserModel from '../models/UserModel';
import timeUtils from '../utils/timeUtils';
import logger from '../../config/winstonLogger';

interface TrainingWeekDisplayModel extends Document {
    trainingDone: number[];
    trainingsWeek: string[];
    createdAt: Date;
    lastUpdate: Date;
}

class WeekDisplayService {
    async createWeekDisplay(userId: string, trainingsWeek: Array<string>) {
        try{
            const user = await UserModel.findById(userId);

            if(user){
                const trainingsWeekDisplay = new WeekDisplay({
                    trainingsWeek
                });
        
                const weekDisplay = await trainingsWeekDisplay.save();

                const createdWeekDisplay = await WeekDisplay.create(weekDisplay);
                user.weekDisplay = createdWeekDisplay._id;
                await user.save();
                
                return {
                    success: true,
                    code: 201,
                    weekDisplay: createdWeekDisplay
                }
            }
            
            return {
                success: false,
                code: 404,
                message: 'User not found'
            }
        } catch (error) {
            logger.error('Error creating week display:', error, {service: 'WeekDisplayService.createWeekDisplay'});
            return {
                success: false,
                code: 500,
                message: 'Internal Server Error',
            }
        }
    }

    async getWeekDisplay(userId: string) {
        try{
            const user = await UserModel.findById(userId).populate('weekDisplay');

            if(user){
                const weekDisplay = await WeekDisplay.findById(user.weekDisplay);

                if(!weekDisplay){

                    return {
                        success: false,
                        code: 404,
                        message: 'Week display not found'
                    }
                }
                // Calculates the date that should be one week ago
                const currentDate = new Date();

                const currentWeekNumber = timeUtils.getWeekNumber(currentDate);
                const createdAtWeekNumber = timeUtils.getWeekNumber(weekDisplay.lastUpdate);

                if(createdAtWeekNumber < currentWeekNumber){ //<- When the createdAt is located last week it is set true
                    weekDisplay.trainingDone = []
                    weekDisplay.lastUpdate = new Date();
                    weekDisplay.save();

                    return {
                        success: true,
                        code: 200,
                        weekDisplay
                    }
                }

                return {
                    success: true,
                    code: 200,
                    weekDisplay
                }
            }

            return {
                success: false,
                code: 404,
                message: 'User not found'
            }
        } catch(error){
            logger.error('Error getting week display:', error, {service: 'WeekDisplayService.getWeekDisplay'});
            return {
                success: false,
                code: 500,
                message: 'Internal Server Error',
            }
        }
    }

    async updateWeekDisplay(userId: string, trainingsWeek: Array<string>) {
        try{
            const user = await UserModel.findById(userId);

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: 'User not found'
                }
            }

            const weekDisplay = await WeekDisplay.findById(user.weekDisplay);

            if(!weekDisplay){
                return {
                    success: false,
                    code: 404,
                    message: 'Week display not found'
                }
            }

            weekDisplay.trainingsWeek = trainingsWeek;
            await weekDisplay.save();

            return {
                success: true,
                code: 200,
                weekDisplay
            }
        } catch(error){
            logger.error('Error updating week display:', error, {service: 'WeekDisplayService.updateWeekDisplay'});
            return {
                success: false,
                code: 500,
                message: 'Internal Server Error',
            }
        }
    }
}

export default new WeekDisplayService();