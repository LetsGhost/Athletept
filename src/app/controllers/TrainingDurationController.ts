import { Request, Response } from "express";
import trainingDurationService from "../services/TrainingdurationService";

class TrainingDurationController{
    async createTrainingDuration(req: Request, res: Response){
        const userId = req.params.userId
        const trainingduration = req.body

        const {success, code, message, newTrainingduration} = await trainingDurationService.createTrainingduration(userId, trainingduration)

        res.status(code).json({success, message, newTrainingduration})
    }

    async getTrainingDuration(req: Request, res: Response){
        const userId = req.params.userId

        const {success, code, message, trainingduration} = await trainingDurationService.getTrainingduration(userId)

        res.status(code).json({success, message, trainingduration})
    }
}

export default new TrainingDurationController();