import {Request, Response} from "express";
import {getExercisePlan} from "../services/ExercisePlanService";

export const getExercisePlanController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // Get the exercise plan
        const exercisePlan = await getExercisePlan(userId);

        res.status(200).json({ message: 'Exercise plan retrieved successfully', exercisePlan: exercisePlan });
    } catch (error) {
        res.status(400).json({ message: 'Exercise plan retrieval failed', error: error });
    }
}