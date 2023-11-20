import {TrainingDuration} from '../models/TrainingdurationModel';
import UserModel from '../models/UserModel';

interface Trainingduration {
    coachingStartDate: string,
    coachingDurationMonths: string[],
    coachingDuration: string[]
}

interface TrainingdurationDocument extends Document {
    trainingduration: Trainingduration;
    createdAt: Date;
}

class TrainingdurationService{

    async createTrainingduration(userId: string, trainingduration: Trainingduration){
        const user = await UserModel.findById(userId)

        if(!user){
            return {
                success: false,
                code: 404,
                message: "User not found"
            }
        }

        const newTrainingduration = new TrainingDuration({
            trainingduration: trainingduration
        })

        await newTrainingduration.save()

        user.trainingduration = newTrainingduration._id
        await user.save()

        return {
            success: true,
            code: 200,
            newTrainingduration
        }
    }

    async getTrainingduration(userId: string){
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
    }
}

export default new TrainingdurationService();