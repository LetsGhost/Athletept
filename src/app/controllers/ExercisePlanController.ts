import {Request, Response} from "express";
import exercisePlanService from "../services/ExercisePlanService";
import fs from "fs";
import path from "path";

class ExercisePlanController {
    async getExercisePlan(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            // Get the exercise plan
            const result = await exercisePlanService.getExercisePlan(userId);

            if (result && 'success' in result) {
                const { success, code, message, exercisePlan } = result;
                return res.status(code).json({ success, message, exercisePlan });
            } else {
                console.log('Unexpected response from exercisePlanService.getExercisePlan');
                throw new Error('Unexpected response from exercisePlanService.getExercisePlan');
            }
        } catch (error) {
            console.log("Error while getting exercise plan in Controller: ", error);
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async createExercisePlanOnly(req: Request, res: Response) {
        try{
            const { userId } = req.params;

            if (!req.files) {
                console.log("No files were uploaded.")
                return res.status(400).json({ success: false, message: 'No files were uploaded.' });
            }

            // I don´t know why this has to be here, but it works
            const uploadedFilePath = path.join();

            // Getting the files
            const excelFiles = req.files as Express.Multer.File[]

            // That`s very stupid I know but it works
            const toString = JSON.stringify(excelFiles)
            const toJSON = JSON.parse(toString)

            const exerciseFilePath = toJSON["exerciseFile"][0].path

            const { success, code, message, exercisePlan } = await exercisePlanService.createExercisePlanOnly(userId, exerciseFilePath); 
            
            res.status(code).json({ success, message, exercisePlan });
        } catch (error) {  
            console.log("Error while creating exercise plan in Controller: ", error);
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async createWarmupOnly(req: Request, res: Response) {
        try{
            const { userId } = req.params;

            if (!req.files) {
                console.log("No files were uploaded.")
                return res.status(400).json({ success: false, message: 'No files were uploaded.' });
            }

            // I don´t know why this has to be here, but it works
            const uploadedFilePath = path.join();

            // Getting the files
            const excelFiles = req.files as Express.Multer.File[]

            // That`s very stupid I know but it works
            const toString = JSON.stringify(excelFiles)
            const toJSON = JSON.parse(toString)

            const warmupFilePath = toJSON["warmupFile"][0].path

            const { success, code, message, exercisePlan } = await exercisePlanService.createWarmupSingle(userId, warmupFilePath); 
            
            res.status(code).json({ success, message, exercisePlan });
        } catch (error) {  
            console.log("Error while creating exercise plan in Controller: ", error);
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

}

export default new ExercisePlanController();