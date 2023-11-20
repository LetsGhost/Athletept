import ExcelJS from "exceljs";
import { Workbook, Worksheet, Row } from 'exceljs';
import UserModel from "../models/UserModel";
import {ExercisePlan} from "../models/ExercisePlanModel";
import timeUtils from "../utils/timeUtils";

interface Exercise {
    Exercises: string;
    Weight: number;
    Sets: number;
    WarmUpSets: number;
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
        weight: number;
        repetitions: number;
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
                        Repetitions: row.getCell(8).value as string,
                        Rest: row.getCell(9).value as string,
                        Execution: row.getCell(10).value as string,
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
                                    weight: warmupRow.getCell(6).value as number,
                                    repetitions: warmupRow.getCell(7).value as number,
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
                        Repetitions: row.getCell(8).value as string,
                        Rest: row.getCell(9).value as string,
                        Execution: row.getCell(10).value as string,
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
            console.log('Error processing the Excel file in Service:', error);
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
                        Repetitions: row.getCell(8).value as string,
                        Rest: row.getCell(9).value as string,
                        Execution: row.getCell(10).value as string,
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
                        Repetitions: row.getCell(8).value as string,
                        Rest: row.getCell(9).value as string,
                        Execution: row.getCell(10).value as string,
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
            console.log('Error processing the Excel file in ExerciseplanService.createExercersiePlanOnly:', error);
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    // TODO: Needs to be fixed, pls use a completly new approache 
    /*
    async createWarmupSingle(userId: string,  warmupFile: any) {
        // Find the user by ID and populate the exercisePlan
        const user = await UserModel.findById(userId).populate('exercisePlan') as unknown as { exercisePlan: ExerciseDay[] };

        // Check if the user and the exercisePlan exist
        if (!user || !user.exercisePlan) {
            console.log("User or exercise plan not found!");
            return {
                success: false,
                code: 404,
                message: "User or exercise plan not found!"
            }
        }

        console.log(user?.exercisePlan)

        const workbook = new ExcelJS.Workbook();
        const warmupWorkbook = new ExcelJS.Workbook();
        await warmupWorkbook.xlsx.readFile(warmupFile);

        const worksheet = workbook.getWorksheet(1);
        const warmupWorksheet = warmupWorkbook.getWorksheet(1);

        let currentType: string | null = null;
        let warmup: Warmup[] = [];

        warmupWorksheet?.eachRow((warmupRow: Row) => {
            if (warmupRow.getCell(1).value === 'Nummer') return; // Skip the first row

            const warmupType = warmupRow.getCell(1).value as string;

            if (warmupType !== currentType) {
                if (warmup.length > 0) {
                    // Push the current warmup to the corresponding day of the exercise plan
                    const dayIndex = (user.exercisePlan as ExerciseDay[]).findIndex(day => day.type === currentType);
                    if (dayIndex !== -1) {
                        (user.exercisePlan as ExerciseDay[])[dayIndex].warmup = warmup;
                    }
                }

                // Start a new warmup with the current row
                warmup = [];
                currentType = warmupType;
            }

            warmup.push({
                warmupExercise: {
                    Exercises: warmupRow.getCell(2).value as string,
                },
                warmupMaterials: {
                    Materials: warmupRow.getCell(3).value as string,
                },
            });
        });

        // Push the last warmup to the corresponding day of the exercise plan
        const populatedUser = await UserModel.findById(userId).populate('exercisePlan');

        if (!populatedUser || !Array.isArray(populatedUser.exercisePlan)) {
            console.log("User or exercise plan not found or exercise plan is not an array!");
            return {
                success: false,
                code: 404,
                message: "User or exercise plan not found or exercise plan is not an array!"
            }
        }

        // Use populatedUser instead of user in the rest of your code
        // Use populatedUser instead of user in the rest of your code
        const dayIndex = populatedUser.exerciseDays.findIndex(day => day.type === currentType);
        if (dayIndex !== -1) {
            populatedUser.exerciseDays[dayIndex].warmup = warmup;
        }

        console.log(populatedUser?.exerciseDays)

        return {
            success: true,
            code: 200,
            exercisePlan: user.exercisePlan
        }
    }
    */

    async getExercisePlan(userId: string) {
        try {
            const user = await UserModel.findById(userId).populate('exercisePlan');
            if(!user){
                console.log("User not found!");
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

        } catch (error) {
            console.log("Error while getting exercise plan in Service: ", error);
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }
}

export default new ExercisePlanService();