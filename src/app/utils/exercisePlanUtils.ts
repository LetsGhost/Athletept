import ExcelJS, { Row } from "exceljs";
import logger from "../../config/winstonLogger.js";
import ExercisePlanModel, { Exercise, warmup, ExerciseDay } from "../models/ExercisePlanModel.js";

async function createExercisePlan() {
 try{

 } catch (error) {
    logger.error(`Error in createExercisePlan: ${error.message}`);
 }
}