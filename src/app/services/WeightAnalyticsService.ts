import WeightAnalyticsModel, { weightAnalyticsModel, weightAnalyticsDocument } from "../models/WeightAnalyticsModel.js";
import UserService from "./UserService.js";
import UserModel  from "../models/UserModel.js";
import { Schema } from 'mongoose';
import logger from "../../config/winstonLogger.js";

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
                },
                bodyWeightGraphs: {
                    weekWeights: [],
                    allWeights: [userInfo?.currentWeight]
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
            logger.error('Error creating weight analytics:', error, {service: 'WeightAnalyticsService.createWeightAnalytics'});
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }        
    }

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
            logger.error('Error updating weight analytics:', error, {service: 'WeightAnalyticsService.updateWeightAnalytics'});
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }
    }

    // TODO: Implement system that checks if the weight number is way bigger than the last one if yes reject it
    // TODO: Update the last value from allWeight in the week
    async updateBodyWeightArray(userId: string, weight: number) {
        try{
            // Get the user from the DB
            const user = await UserModel.findById(userId)

            // If the user doesn´t exists throw an error
            if(!user) {
                return {
                    success: false,
                    code: 404
                }
            }

            const WeightAnalytics: weightAnalyticsDocument | null = await WeightAnalyticsModel.findById(user?.weightAnalytics);

            // If the user doesn´t have a weight analytics throw an error
            if(!WeightAnalytics) {
                return {
                    success: false,
                    code: 404
                }
            }
            // If the bodyWeightGraphs not exists create it
            if(!WeightAnalytics.bodyWeightGraphs) {
                WeightAnalytics.bodyWeightGraphs = {
                    weekWeights: [],
                    allWeights: []
                };
            }

            // Check if the weekWeight has any value
            if(WeightAnalytics.bodyWeightGraphs.weekWeights.length === 0) {
                WeightAnalytics.bodyWeightGraphs.weekWeights.push({
                    weight: weight,
                    date: new Date()
                });

                WeightAnalytics.bodyWeightGraphs.allWeights.push({
                    weight: weight,
                    date: new Date()
                });
            }
            else {
                const numbers = []
   
                for(let key in WeightAnalytics.bodyWeightGraphs.weekWeights) {
                    numbers.push(WeightAnalytics.bodyWeightGraphs.weekWeights[key].weight);
                }
                numbers.push(weight);

                const sum = numbers.reduce((a, b) => a + b, 0);
                const avg = sum / numbers.length;

                WeightAnalytics.bodyWeightGraphs.allWeights.push({
                    weight: avg,
                    date: new Date()
                });

                WeightAnalytics.bodyWeightGraphs.weekWeights.push({
                    weight: weight,
                    date: new Date()
                });
            }

            if (WeightAnalytics) {
                await WeightAnalytics.save();
            }

            return {
                success: true,
                code: 200,
                weightAnalytics: WeightAnalytics
            }
        } catch(error){
            logger.error('Error updating body weight array:', error, {service: 'WeightAnalyticsService.updateBodyWeightArray'});
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
            logger.error('Error getting weight analytics:', error, {service: 'WeightAnalyticsService.getWeightAnalytics'});
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }
    }
}

export default new WeightAnalyticsService();