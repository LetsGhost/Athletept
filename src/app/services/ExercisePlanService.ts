import ExcelJS from "exceljs";
import { Workbook, Worksheet, Row } from 'exceljs';
import UserModel from "../models/UserModel.js";
import {ExercisePlan} from "../models/ExercisePlanModel.js";
import timeUtils from "../utils/timeUtils.js";
import logger from "../../config/winstonLogger.js";
import { WeekDisplay } from "../models/WeekDisplayModel.js";

interface Exercise {
    Exercises: string;
    Weight: number;
    Sets: number;
    WarmUpSets: number;
    WarmupWeight: number,
    WarmupRepetitions: number,
    Repetitions: string;
    Rest: string;
    Execution: string;
}

interface Warmup {
    warmupExercise: {
        Exercises: string;
        weight: number;
        repetitions: number;
    };
    warmupMaterials: {
        Materials: string;
    };
}

interface ExerciseDay {
    dayNumber: number;
    weekDay?: string;
    type?: string;
    exercises: Exercise[];
    warmup: Warmup[];
}

class ExercisePlanService {

    async createExercisePlanFromExcel(userId: string, exerciseFile: any, warmupFile: any) {
        try {
            // ExerciseFile Workbook
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(exerciseFile);

            // WarmupFile Workbook
            const warmupWorkbook = new ExcelJS.Workbook();
            await warmupWorkbook.xlsx.readFile(warmupFile);

            const exercisePlan: ExerciseDay[] = [];

            const worksheet = workbook.getWorksheet(1);
            const warmupWorksheet = warmupWorkbook.getWorksheet(1);

            let currentDay: ExerciseDay | null = null;
            let previousType: string | null = null; // Store the previous type

            worksheet?.eachRow((row, rowNumber) => {
                if (row.getCell(1).value === 'Nummer') return; // Skip the first row

                const currentType = row.getCell(1).value as string; // Is the nummer of the day

                if (currentType !== previousType) {
                    // If the training type in the first cell has changed, it's a new day
                    const exercises: Exercise[] = [];
                    const warmup: Warmup[] = [];

                    exercises.push({
                        Exercises: row.getCell(4).value as string,
                        Weight: row.getCell(5).value as number,
                        Sets: row.getCell(6).value as number,
                        WarmUpSets: row.getCell(7).value as number,
                        WarmupWeight: row.getCell(8).value as number,
                        WarmupRepetitions: row.getCell(9).value as number,
                        Repetitions: row.getCell(10).value as string,
                        Rest: row.getCell(11).value as string,
                        Execution: row.getCell(12).value as string,
                    });

                    warmupWorksheet?.eachRow((warmupRow, warmupRowNumber) => {
                        if (warmupRow.getCell(1).value === 'Nummer') return; // Skip the first row

                        const warmupType = warmupRow.getCell(1).value as string;

                        if (warmupType === currentType) {
                            warmup.push({
                                warmupExercise: {
                                    Exercises: warmupRow.getCell(2).value as string,
                                    weight: warmupRow.getCell(4).value as number,
                                    repetitions: warmupRow.getCell(5).value as number,
                                },
                                warmupMaterials: {
                                    Materials: warmupRow.getCell(3).value as string,
                                },
                            });
                        }
                    });

                    currentDay = {
                        dayNumber: exercisePlan.length + 1,
                        weekDay: row.getCell(3).value as string,
                        type: row.getCell(2).value as string,
                        exercises: exercises,
                        warmup: warmup,
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
                        WarmupWeight: row.getCell(8).value as number,
                        WarmupRepetitions: row.getCell(9).value as number,
                        Repetitions: row.getCell(10).value as string,
                        Rest: row.getCell(11).value as string,
                        Execution: row.getCell(12).value as string,
                    });
                }
            });

            const user = await UserModel.findById(userId);

            // Delete the previous exercise plan
            if (user?.exercisePlan) {
                await ExercisePlan.findByIdAndDelete(user.exercisePlan);
            }

            if (user) {
                const exercisePlanDocument = new ExercisePlan({
                    exerciseDays: exercisePlan,
                });

                // Create and save the exercise plan using the ExercisePlan model
                const createdExercisePlan = await ExercisePlan.create(exercisePlanDocument);
                user.exercisePlan = createdExercisePlan._id;
                await user.save();

                // Reset the trainingDone array
                const weekDisplay = await WeekDisplay.findById(user.weekDisplay);
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
            // ExerciseFile Workbook
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(exerciseFile);

            const exercisePlan: ExerciseDay[] = [];

            const worksheet = workbook.getWorksheet(1);

            let currentDay: ExerciseDay | null = null;
            let previousType: string | null = null; // Store the previous type

            worksheet?.eachRow((row, rowNumber) => {
                if (row.getCell(1).value === 'Nummer') return; // Skip the first row

                const currentType = row.getCell(1).value as string; // Is the nummer of the day

                if (currentType !== previousType) {
                    // If the training type in the first cell has changed, it's a new day
                    const exercises: Exercise[] = [];
                    const warmup: Warmup[] = [];

                    exercises.push({
                        Exercises: row.getCell(4).value as string,
                        Weight: row.getCell(5).value as number,
                        Sets: row.getCell(6).value as number,
                        WarmUpSets: row.getCell(7).value as number,
                        WarmupWeight: row.getCell(8).value as number,
                        WarmupRepetitions: row.getCell(9).value as number,
                        Repetitions: row.getCell(10).value as string,
                        Rest: row.getCell(11).value as string,
                        Execution: row.getCell(12).value as string,
                    });

                    currentDay = {
                        dayNumber: exercisePlan.length + 1,
                        weekDay: row.getCell(3).value as string,
                        type: row.getCell(2).value as string,
                        exercises: exercises,
                        warmup: warmup,
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
                        WarmupWeight: row.getCell(8).value as number,
                        WarmupRepetitions: row.getCell(9).value as number,
                        Repetitions: row.getCell(10).value as string,
                        Rest: row.getCell(11).value as string,
                        Execution: row.getCell(12).value as string,
                    });
                }
            });


            // Find the user and update the exercise plan
            const user = await UserModel.findById(userId);

            // Delete the previous exercise plan
            if (user?.exercisePlan) {
                await ExercisePlan.findByIdAndDelete(user.exercisePlan);
            }

            if (user) {
                const exercisePlanDocument = new ExercisePlan({
                    exerciseDays: exercisePlan,
                });

                // Create and save the exercise plan using the ExercisePlan model
                const createdExercisePlan = await ExercisePlan.create(exercisePlanDocument);
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
            const user = await UserModel.findById(userId).populate('exercisePlan');
            
            if (!user) {
                return {
                    success: false,
                    code: 404,
                    message: "User not found!"
                }
            }

            if (user.exercisePlan) {
                // Process the warmup Excel file here
                // Set the warmup data into the corresponding day of the exercise plan
    
                // Example code to process the warmup Excel file
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.readFile(warmupFile);
                const worksheet = workbook.getWorksheet(1);
    
                // Iterate over the rows of the worksheet and extract the warmup data
                worksheet?.eachRow((row: Row, rowNumber: number) => {
                    // Extract the warmup data from the row and set it into the corresponding day of the exercise plan
                    const dayNumber = row.getCell(1).value;
                    const warmupExercise = row.getCell(2).value;
                    const warmupMaterial = row.getCell(3).value;
                    const warmupWeight = row.getCell(4).value;
                    const repetitions = row.getCell(5).value;
    
                    // Find the corresponding day in the exercise plan
                    const exerciseDay = (user.exercisePlan as any).exerciseDays.find((day: ExerciseDay) => day.dayNumber === dayNumber);
                    if (exerciseDay) {
                        // Set the warmup data into the exercise day
                        exerciseDay.warmup.push({
                            warmupExercise: {
                                Exercises: warmupExercise,
                                weight: warmupWeight,
                                repetitions: repetitions
                            },
                            warmupMaterials: {
                                Materials: warmupMaterial, // Set the materials value here
                            }
                        });
                    }
                });

                await (user.exercisePlan as any).save();
    
                return {
                    success: true,
                    code: 200,
                    exercisePlan: user.exercisePlan
                }
            } else {
                return {
                    success: false,
                    code: 404,
                    message: "Exercise plan not found for the user"
                }
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

                const currentDate = new Date();
                const createdAt = (user.exercisePlan as any).createdAt;
                
                const currentDayNumber = timeUtils.getWeekNumber(currentDate);
                const createdAtWeekNumber = timeUtils.getWeekNumber(createdAt);

                if(currentDayNumber > createdAtWeekNumber){
                    // Set trainingDone to false for every day
                    (user.exercisePlan as any).exerciseDays.forEach((day: any) => {
                        day.trainingDone = false;
                    });
                    await (user.exercisePlan as any).save();
                }

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