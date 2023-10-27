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

interface warmupExercise {
    Exercises: string;
}

interface warmupMaterials {
    Materials: string;
}

interface warmup {
    warmupExercise: warmupExercise[];
    warmupMaterials: warmupMaterials[];
}

interface ExerciseDay {
    dayNumber: number;
    type?: string;
    exercises: Exercise[];
    warmup: warmup[];
}

class ExercisePlanService {

    async createExercisePlanFromExcel(userId: string, exerciseFile: any, warmupFile: any) {
        try {
            // ExerciseFile Workbook
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(exerciseFile);

            const exercisePlan: ExerciseDay[] = [];

            const worksheet = workbook.getWorksheet(1);

            let currentDay: ExerciseDay | null = null;
            let previousType: string | null = null; // Store the previous type

            worksheet.eachRow((row, rowNumber) => {
                if (row.getCell(1).value === 'Nummer') return; // Skip the first row

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
                        type: row.getCell(2).value as string,
                        exercises: exercises,
                        warmup: [],
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

            // Create Warmup
            const workbook2 = new ExcelJS.Workbook();
            await workbook2.xlsx.readFile(warmupFile);

            const worksheet2 = workbook.getWorksheet(1);
            let currentDay2: ExerciseDay | null = null;
            let previousType2: string | null = null; // Store the previous type
            console.log(exercisePlan)

            worksheet2.eachRow((row, rowNumber) => {
                if(row.getCell(1).value === 'Nummer') return; // Skip the first row

                const currentDay = row.getCell(1).value as string;

                const exerciseplanDay = exercisePlan.find((day) => day.type === currentDay);

                if(currentDay === exerciseplanDay?.dayNumber.toString()){
                    const warmup: warmup[] = [];
                    warmup.push({
                        warmupExercise: [{
                            Exercises: row.getCell(4).value as string,
                        }],
                        warmupMaterials: [{
                            Materials: row.getCell(5).value as string,
                        }],
                    });
                    currentDay2 = {
                        dayNumber: exercisePlan.length + 1,
                        type: currentDay,
                        exercises: [],
                        warmup: warmup,
                    };
                    exercisePlan.push(currentDay2);
                }
            })
            console.log(exercisePlan)
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
                throw new Error("User not found!")
            }

            if (user) {
                return user.exercisePlan;
            }
            else {
                throw new Error("User does not have an exercise plan")
            }

        } catch (error) {
            throw new Error("Error getting the exercise plan")
        }
    }
}

export default new ExercisePlanService();