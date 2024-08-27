import ExcelJS from "exceljs";
import logger from "../../config/winstonLogger.js";
async function createExercisePlan(exerciseFile) {
    try {
        // ExerciseFile Workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(exerciseFile);
        const exercisePlan = [];
        const worksheet = workbook.getWorksheet(1);
        let currentDay = null;
        let previousType = null;
        worksheet?.eachRow((row) => {
            if (row.getCell(1).value === 'Name')
                return; // Skip the first row
            const currentType = row.getCell(1).value; // Is the nummer of the day
            if (currentType !== previousType) {
                // If the training type in the first cell has changed, it's a new day
                const exercises = [];
                exercises.push({
                    Exercises: row.getCell(3).value,
                    Weight: row.getCell(4).value,
                    Sets: row.getCell(5).value,
                    WarmUpSets: row.getCell(6).value,
                    WarmupWeight: row.getCell(7).value,
                    WarmupRepetitions: row.getCell(8).value,
                    Repetitions: row.getCell(9).value,
                    Rest: row.getCell(10).value,
                    Execution: row.getCell(11).value,
                });
                currentDay = {
                    dayNumber: exercisePlan.length + 1,
                    weekDay: row.getCell(2).value,
                    type: row.getCell(1).value,
                    trainingDone: false,
                    trainingMissed: false,
                    exercises: exercises,
                    warmup: [],
                };
                exercisePlan.push(currentDay);
                // Update the previous type
                previousType = currentType;
            }
            else {
                // Append exercises to the current day
                currentDay?.exercises.push({
                    Exercises: row.getCell(3).value,
                    Weight: row.getCell(4).value,
                    Sets: row.getCell(5).value,
                    WarmUpSets: row.getCell(6).value,
                    WarmupWeight: row.getCell(7).value,
                    WarmupRepetitions: row.getCell(8).value,
                    Repetitions: row.getCell(9).value,
                    Rest: row.getCell(10).value,
                    Execution: row.getCell(11).value,
                });
            }
        });
        // Define the rules to check if the excel is processed correctly
        if (exercisePlan) {
            const exercisePlanDays = exercisePlan;
            // 1. Check if the exercise plan has more than 7 days
            if (exercisePlanDays.length > 7) {
                return {
                    success: false,
                    code: 400,
                    message: "The exercise plan has more than 7 days"
                };
            }
            // 2. Check if any value is null or undefined
            for (const day of exercisePlanDays) {
                // Check if any property of day is null or undefined
                for (const key in day) {
                    const value = day[key];
                    if (value === null || value === undefined) {
                        return {
                            success: false,
                            code: 400,
                            message: `The exercise plan contains null or undefined values`
                        };
                    }
                }
                // Check if any value in exercises is null or undefined
                for (const exercise of day.exercises) {
                    for (const key in exercise) {
                        const value = exercise[key];
                        if (value === null || value === undefined) {
                            return {
                                success: false,
                                code: 400,
                                message: `The exercise plan contains null or undefined values`
                            };
                        }
                    }
                }
            }
            // 3. Check if an exerciseDay has atleast one exercise
            for (const day of exercisePlanDays) {
                if (day.exercises.length < 1) {
                    return {
                        success: false,
                        code: 400,
                        message: `The exercise plan has a day without exercises`
                    };
                }
            }
        }
        return {
            success: true,
            exercisePlan: exercisePlan,
        };
    }
    catch (error) {
        logger.error(`Error in createExercisePlan: ${error}`, { service: "ExercisePlanUtils.createExercisePlan" });
        return {
            success: false,
        };
    }
}
// TODO: Define some rule for the warmup
async function createWarmup(exercisePlan, warmupFile) {
    try {
        if (!exercisePlan) {
            logger.error(`Error in createWarmup: exercisePlan is null or undefined`, { service: "ExercisePlanUtils.createWarmup" });
            return {
                success: false,
            };
        }
        // ExerciseFile Workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(warmupFile);
        const worksheet = workbook.getWorksheet(1);
        let previousDay = 0;
        let exercisePlanModified = exercisePlan;
        worksheet?.eachRow((row) => {
            if (row.getCell(1).value === 'Nummer')
                return; // Skip the first row
            const currentDay = row.getCell(1).value;
            if (currentDay != previousDay) {
                const warmup = {
                    warmupExercise: [],
                    warmupMaterials: [],
                };
                warmup.warmupExercise.push({
                    Exercises: row.getCell(2).value,
                    weight: row.getCell(4).value,
                    repetitions: row.getCell(5).value,
                });
                warmup.warmupMaterials.push({
                    Materials: row.getCell(3).value,
                });
                exercisePlanModified[currentDay - 1].warmup.push(warmup);
                previousDay = currentDay;
            }
        });
        return {
            success: true,
            exercisePlan: exercisePlanModified,
        };
    }
    catch (error) {
        logger.error(`Error in createWarmup: ${error}`, { service: "ExercisePlanUtils.createWarmup" });
        return {
            success: false,
        };
    }
}
export { createExercisePlan, createWarmup, };
