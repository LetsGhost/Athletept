import UserModel from "../models/UserModel.js";
import ExercisePlanModel, { ExercisePlanDocument } from "../models/ExercisePlanModel.js";
import logger from "../../config/winstonLogger.js";
import WeekDisplayModel from "../models/WeekDisplayModel.js";
import { createExercisePlan, createWarmup } from "../utils/exercisePlanUtils.js";

class ExercisePlanService {

    async createExercisePlanFromExcel(userId: string, exerciseFile: any, warmupFile: any) {
        try {
            
            const user = await UserModel.findById(userId);

            // Delete the previous exercise plan
            if (user?.exercisePlan) {
                await ExercisePlanModel.findByIdAndDelete(user.exercisePlan);
            }

            const { success, exercisePlan } = await createExercisePlan(exerciseFile);
            const { success: success2, exercisePlan: exercisePlanFinal } = await createWarmup(exercisePlan, warmupFile);

            if(!success || !success2){
                logger.error(`Error processing the Excel file`, {service: 'ExercisePlanService.createExercisePlanFromExcel'});
                return {
                    success: false,
                    code: 500,
                    message: "Internal Server error"
                }
            }

            if (user) {
                const exercisePlanDocument = new ExercisePlanModel({
                    exerciseDays: exercisePlanFinal,
                });

                // Create and save the exercise plan using the ExercisePlan model
                const createdExercisePlan = await ExercisePlanModel.create(exercisePlanDocument);
                user.exercisePlan = createdExercisePlan._id;
                await user.save();

                // Reset the trainingDone array
                const weekDisplay = await WeekDisplayModel.findById(user.weekDisplay);
                if (weekDisplay) {
                    weekDisplay.trainingDone = [];
                    await weekDisplay.save();
                }

                return {
                    success: true,
                    code: 200,
                    exercisePlan: createdExercisePlan
                }
            }

            return {
                success: false,
                code: 404,
                message: "User not found!"
            }

        } catch (error) {
            logger.error(`Error processing the Excel file: ${error}`, {service: 'ExercisePlanService.createExercisePlanFromExcel'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    };

    async createExercisePlanOnly(userId: string, exerciseFile: any) {
        try {
            const { success, exercisePlan } = await createExercisePlan(exerciseFile);

            // Find the user and update the exercise plan
            const user = await UserModel.findById(userId);

            // Delete the previous exercise plan
            if (user?.exercisePlan) {
                await ExercisePlanModel.findByIdAndDelete(user.exercisePlan);
            }

            if (user) {
                const exercisePlanDocument = new ExercisePlanModel({
                    exerciseDays: exercisePlan,
                });

                // Create and save the exercise plan using the ExercisePlan model
                const createdExercisePlan = await ExercisePlanModel.create(exercisePlanDocument);
                user.exercisePlan = createdExercisePlan._id;
                await user.save();

                return {
                    success: true,
                    code: 200,
                    exercisePlan: createdExercisePlan
                }
            }

            return {
                success: false,
                code: 404,
                message: "User not found!"
            }
        } catch (error) {
            logger.error(`Error processing the Excel file: ${error}`, {service: 'ExercisePlanService.createExercisePlanOnly'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    // TODO: Needs to be fixed, pls use a completely new approach 
    async createWarmupSingle(userId: string, warmupFile: any) {
        try {
            const user = await UserModel.findById(userId).populate('exercisePlan') as any;
            
            if (!user) {
                return {
                    success: false,
                    code: 404,
                    message: "User not found!"
                }
            }

            const { success, exercisePlan } = await createWarmup(user.exercisePlan.exerciseDays, warmupFile);

            if (!success) {
                return {
                    success: false,
                    code: 500,
                    message: "Internal Server error"
                }
            }

            user.exercisePlan.exerciseDays = exercisePlan;
            await user.save();

            return {
                success: true,
                code: 200,
                exercisePlan: exercisePlan
            }
        } catch (error) {
            logger.error(`Error processing the Excel file: ${error}`, { service: 'ExercisePlanService.createWarmupSingle' });
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async getExercisePlan(userId: string) {
        try {
            const user = await UserModel.findById(userId).populate('exercisePlan');
            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found!"
                }
            }

            if (user && user.exercisePlan) {
                return {
                    success: true,
                    code: 200,
                    exercisePlan: user.exercisePlan
                }
            }

            return {
                success: false,
                code: 404,
            }

        } catch (error) {
            logger.error(`Error getting the exercise plan: ${error}`, {service: 'ExercisePlanService.getExercisePlan'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }
}

export default new ExercisePlanService();