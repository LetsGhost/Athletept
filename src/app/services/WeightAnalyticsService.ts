import { WeightAnalyticsModel } from "../models/WeightAnalyticsModel";
import UserService from "./UserService";
import UserModel  from "../models/UserModel";
import { Schema, Model } from 'mongoose';

interface bodyWeight {
    lastWeight: number;
    actualWeight: number;
    weightGoal: number;
    weightStart: number;
}

interface bodyWeightGraphSixteenWeeks {
    weight: number[];
}

interface weightAnalyticsModel {
    createdAt: Date;
    bodyWeight: bodyWeight;
    bodyWeightGraphSixteenWeeks: bodyWeightGraphSixteenWeeks[];
}

interface WeightAnalyticsPlanModel extends Model<weightAnalyticsModel> {}

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
    async updateWeightAnalytics(userId: string, weight: number, oldWeight: number) {
        try {
            // Find the user and update the weight analytics
            const user = await UserModel.findById(userId);

            if(user){
                const weightAnalytics = await WeightAnalyticsModel.findById(user?.weightAnalytics);

                if(weightAnalytics){
                    weightAnalytics.bodyWeight.lastWeight = oldWeight;
                    weightAnalytics.bodyWeight.actualWeight = weight;

                    const weightGraph = weightAnalytics.bodyWeightGraphSixteenWeeks[0].weight;
                    weightGraph.splice(0, 1);
                    weightGraph.splice(15, 0, weight);

                    await weightAnalytics?.save();

                    return {
                        success: true,
                        code: 200,
                        weightAnalytics
                    }
                }
            }

            return {
                success: false,
                code: 404,
                message: "User not found"
            }
        } catch(error){
            console.log("Error updating weight analytics WeightAnalyticsService.updateWeightAnalytics()")
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }
    }

    async getWeightAnalytics(userId: string) {
        try {
            const user = await UserModel.findById(userId);

            if(user){
                const weightAnalytics = await WeightAnalyticsModel.findById(user?.weightAnalytics);

                if(weightAnalytics){
                    return {
                        success: true,
                        code: 200,
                        weightAnalytics
                    }
                }
            }

            return {
                success: false,
                code: 404,
                message: "User not found"
            }
        } catch(error){
            console.log("Error getting weight analytics WeightAnalyticsService.getWeightAnalytics()")
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }
    }
}

export default new WeightAnalyticsService();