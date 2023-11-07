import {WeekDisplay} from '../models/WeekDisplayModel';
import UserModel from '../models/UserModel';

class WeekDisplayService {
    async createWeekDisplay(userId: string, trainingsWeek: Array<string>) {
        try{
            const trainingsWeekDisplay = new WeekDisplay({
                trainingsWeek
            });
    
            const weekDisplay = await trainingsWeekDisplay.save();

            const user = await UserModel.findById(userId);
            if(!user){
                throw new Error('User not found');
                return false;
            }

            if (user) {
                // Create and save the exercise plan using the ExercisePlan model
                const createdWeekDisplay = await WeekDisplay.create(weekDisplay);
                user.weekDisplay = createdWeekDisplay._id;
                await user.save();

                return trainingsWeekDisplay;
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new WeekDisplayService();