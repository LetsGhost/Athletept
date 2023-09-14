import {Request, Response} from "express";
import exercisePlanService from "../services/ExercisePlanService";

class ExercisePlanController {
    async getExercisePlan(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            // Get the exercise plan
            const exercisePlan = await exercisePlanService.getExercisePlan(userId);

            res.status(200).json({ message: 'Exercise plan retrieved successfully', exercisePlan: exercisePlan });
        } catch (error) {
            res.status(400).json({ message: 'Exercise plan retrieval failed', error: error });
        }
    }
}

export default new ExercisePlanController();