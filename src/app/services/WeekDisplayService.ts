import {WeekDisplay} from '../models/WeekDisplayModel';
import UserModel from '../models/UserModel';

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
            console.log("Error creating week display in Service: ", error);
            return {
                success: false,
                code: 500,
                message: 'Internal Server Error',
            }
        }
    }

    async getWeekDisplay(userId: string) {
        try{
            const user = await UserModel.findById(userId);

            if(user){
                const weekDisplay = await WeekDisplay.findById(user.weekDisplay);
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
            console.log("Error getting week display in Service: ", error);
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
            console.log("Error updating week display in Service: ", error);
            return {
                success: false,
                code: 500,
                message: 'Internal Server Error',
            }
        }
    }
}

export default new WeekDisplayService();