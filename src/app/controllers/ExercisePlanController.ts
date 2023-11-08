import {Request, Response} from "express";
import exercisePlanService from "../services/ExercisePlanService";

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
}

export default new ExercisePlanController();