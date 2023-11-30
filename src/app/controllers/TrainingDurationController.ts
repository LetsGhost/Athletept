import { Request, Response } from "express";
import trainingDurationService from "../services/TrainingdurationService";
import logger from "../../config/winstonLogger";

class TrainingDurationController{
    async createTrainingDuration(req: Request, res: Response){
        try{
            const userId = req.params.userId
        const trainingduration = req.body

        const {success, code, message, newTrainingduration} = await trainingDurationService.createTrainingduration(userId, trainingduration)

        if(success){
            logger.info('Trainingduration created', {service: 'TrainingDurationController.createTrainingduration'});
        }

        res.status(code).json({success, message, newTrainingduration})
        } catch(error){
            logger.error('Error creating trainingduration:', error, {service: 'TrainingDurationController.createTrainingduration'});
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }

    async getTrainingDuration(req: Request, res: Response){
        try{
            const userId = req.params.userId

            const {success, code, message, trainingduration} = await trainingDurationService.getTrainingduration(userId)
    
            res.status(code).json({success, message, trainingduration})
        } catch(error){
            logger.error('Error getting trainingduration:', error, {service: 'TrainingDurationController.getTrainingduration'});
            res.status(500).json({success: false, message: 'Internal Server Error'});
        }
    }
}

export default new TrainingDurationController();