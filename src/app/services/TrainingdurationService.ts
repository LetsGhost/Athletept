import TrainingDurationModel, { Trainingduration } from '../models/TrainingdurationModel.js';
import UserModel from '../models/UserModel.js';
import logger from '../../config/winstonLogger.js';

import mongoose from 'mongoose';

class TrainingdurationService{

    async createTrainingduration(userId: string, trainingduration: Trainingduration){
        try{
            const user = await UserModel.findById(userId)

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            const newTrainingduration = new TrainingDurationModel({
                trainingduration: trainingduration
            })

            await newTrainingduration.save()

            user.trainingduration = newTrainingduration._id as mongoose.Schema.Types.ObjectId;
            await user.save()

            return {
                success: true,
                code: 200,
                newTrainingduration
            }
        } catch(error){
            logger.error('Error creating trainingduration:', error, {service: 'TrainingdurationService.createTrainingduration'});
            return {
                success: false,
                code: 500,
                message: 'Internal server error'
            }
        }
    }

    async getTrainingduration(userId: string){
        try{
            const user = await UserModel.findById(userId).populate('trainingduration')

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            return {
                success: true,
                code: 200,
                trainingduration: user.trainingduration
            }
        } catch(error){
            logger.error('Error getting trainingduration:', error, {service: 'TrainingdurationService.getTrainingduration'});
            return {
                success: false,
                code: 500,
                message: 'Internal server error'
            }
        }
    }
}

export default new TrainingdurationService();