import { WeightAnalyticsModel } from "../models/WeightAnalyticsModel";
import UserService from "./UserService";
import UserModel  from "../models/UserModel";
import { Schema } from 'mongoose';

class WeightAnalyticsService {
    async createWeightAnalytics(userId: string) {
        try {
            const user = await UserService.getUserById(userId);
            const userInfo = user?.user?.userInfo;

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            let weightGraph = [];

            for(let i = 0; i < 16; i++){
                weightGraph.push(userInfo?.currentWeight);
            }

            const weightAnalytics = new WeightAnalyticsModel({
                bodyWeight: {
                    lastWeight: userInfo?.currentWeight,
                    actualWeight: userInfo?.currentWeight,
                    weightGoal: userInfo?.targetWeight,
                    weightStart: userInfo?.currentWeight
                },
                bodyWeightGraphSixteenWeeks: {
                    weight: weightGraph
                }
            })
            
            // Find the user and update the exercise plan
            const userMongoose = await UserModel.findById(userId);

            if(userMongoose){
                const createdAnalytics = await WeightAnalyticsModel.create(weightAnalytics);
                userMongoose.weightAnalytics = createdAnalytics._id as unknown as Schema.Types.ObjectId;
                await userMongoose?.save();
            }

            return {
                success: true,
                code: 200,
                weightAnalytics
            }
        } catch(error){
            console.log("Error creating weight analytics WeightAnalyticsService.createWeightAnalytics()")
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }        
    }

    // TODO: Patch the analytics after every checkIn and push the new values to it
}

export default new WeightAnalyticsService();