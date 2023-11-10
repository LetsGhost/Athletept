import ExcelJS from "exceljs";
import UserModel from "../models/UserModel";
import {ExercisePlan} from "../models/ExercisePlanModel";

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
    };
    warmupMaterials: {
        Materials: string;
    };
}

interface ExerciseDay {
    dayNumber: number;
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
                                },
                                warmupMaterials: {
                                    Materials: warmupRow.getCell(3).value as string,
                                },
                            });
                        }
                    });

                    currentDay = {
                        dayNumber: exercisePlan.length + 1,
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
            }

        } catch (error) {
            console.log('Error processing the Excel file in Service:', error);
        }
    };

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

            if (user) {
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