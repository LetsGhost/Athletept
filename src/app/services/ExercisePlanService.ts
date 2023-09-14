import ExcelJS from "exceljs";
import UserModel from "../models/UserModel";
import {ExercisePlan} from "../models/ExercisePlanModel";
import {Document, Model} from "mongoose";

interface Exercise {
    Exercises: string;
    Weight: number;
    Sets: number;
    WarmUpSets: number;
    Repetitions: string;
    Rest: string;
    Execution: string;
}

interface ExerciseDay {
    dayNumber: number;
    type?: string;
    exercises: Exercise[];
}

interface ExercisePlanDocument extends Document {
    exerciseDays: ExerciseDay[];
}

interface ExercisePlanModel extends Model<ExercisePlanDocument> {}

class ExercisePlanService {

    async createExercisePlanFromExcel(userId: string, filePath: string) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);

            const exercisePlan: ExerciseDay[] = [];

            const worksheet = workbook.getWorksheet(1);

            let currentDay: ExerciseDay | null = null;
            let previousType: string | null = null; // Store the previous type

            worksheet.eachRow((row, rowNumber) => {
                if (row.getCell(1).value === 'Numer') return; // Skip the first row (header

                const currentType = row.getCell(1).value as string;

                if (currentType !== previousType) {
                    // If the training type in the first cell has changed, it's a new day
                    const exercises: Exercise[] = [];

                    exercises.push({
                        Exercises: row.getCell(4).value as string,
                        Weight: row.getCell(5).value as number,
                        Sets: row.getCell(6).value as number,
                        WarmUpSets: row.getCell(7).value as number,
                        Repetitions: row.getCell(8).value as string,
                        Rest: row.getCell(9).value as string,
                        Execution: row.getCell(10).value as string,
                    });

                    currentDay = {
                        dayNumber: exercisePlan.length + 1,
                        type: currentType,
                        exercises: exercises,
                    };
                    exercisePlan.push(currentDay);

                    // Update the previous type
                    previousType = currentType;
                } else {
                    // Append exercises to the current day
                    currentDay?.exercises.push({
                        Exercises: row.getCell(4).value as string,
                        Weight: row.getCell(5).value as number,
                        Sets: row.getCell(6).value as number,
                        WarmUpSets: row.getCell(7).value as number,
                        Repetitions: row.getCell(8).value as string,
                        Rest: row.getCell(9).value as string,
                        Execution: row.getCell(10).value as string,
                    });
                }
            });

            // Find the user and update the exercise plan
            const user = await UserModel.findById(userId);
            if (user) {
                const exercisePlanDocument = new ExercisePlan({
                    exerciseDays: exercisePlan,
                });

                // Create and save the exercise plan using the ExercisePlan model
                const createdExercisePlan = await ExercisePlan.create(exercisePlanDocument);
                user.exercisePlan = createdExercisePlan._id;
                await user.save();
            }
        } catch (error) {
            console.error('Error processing the Excel file:', error);
        }
    };

    async getExercisePlan(userId: string) {
        try {
            const user = await UserModel.findById(userId).populate('exercisePlan');
            if(!user){
                console.log("User not found!")
                throw new Error("User not found!")
            }

            if (user) {
                return user.exercisePlan;
            }
            else {
                throw new Error("User does not have an exercise plan")
            }

        } catch (error) {
            console.error('Error getting the exercise plan:', error);
            throw new Error("Error getting the exercise plan")
        }
    }
}

export default new ExercisePlanService();