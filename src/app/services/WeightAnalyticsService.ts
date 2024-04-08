import WeightAnalyticsModel, { weightAnalyticsDocument } from "../models/WeightAnalyticsModel.js";
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

            const weightAnalytics = new WeightAnalyticsModel({
                bodyWeight: {
                    lastWeight: userInfo?.currentWeight,
                    actualWeight: userInfo?.currentWeight,
                    weightGoal: userInfo?.targetWeight,
                    weightStart: userInfo?.currentWeight
                },
                bodyWeightGraphs: {
                    weekWeights: [],
                    allWeights: [{weight: userInfo?.currentWeight, date: new Date()}]
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

    // TODO: Implement system that checks if the weight number is way bigger than the last one if yes reject it
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

            const weightAnalytics = await UserModel.findById(userId).populate<{ weightAnalytics: weightAnalyticsDocument }>('weightAnalytics');

            // If the user doesn´t have a weight analytics throw an error
            if(!weightAnalytics?.weightAnalytics) {
                return {
                    success: false,
                    code: 404
                }
            }

            // Update lastWeight and actualWeight
            weightAnalytics.weightAnalytics.bodyWeight.lastWeight = weightAnalytics.weightAnalytics.bodyWeight.actualWeight;
            weightAnalytics.weightAnalytics.bodyWeight.actualWeight = weight

            // If the bodyWeightGraphs not exists create it
            if(!weightAnalytics.weightAnalytics.bodyWeightGraphs) {
                weightAnalytics.weightAnalytics.bodyWeightGraphs = {
                    weekWeights: [],
                    allWeights: []
                };
            }

            // Check if the weekWeight has any value
            if(weightAnalytics.weightAnalytics.bodyWeightGraphs.weekWeights.length === 0) {
                weightAnalytics.weightAnalytics.bodyWeightGraphs.weekWeights.push({
                    weight: weight,
                    date: new Date()
                });

                weightAnalytics.weightAnalytics.bodyWeightGraphs.allWeights.push({
                    weight: weight,
                    date: new Date()
                });
            }
            else {
                const numbers = []
   
                for(let key in weightAnalytics.weightAnalytics.bodyWeightGraphs.weekWeights) {
                    numbers.push(weightAnalytics.weightAnalytics.bodyWeightGraphs.weekWeights[key].weight);
                }
                numbers.push(weight);

                const sum = numbers.reduce((a, b) => a + b, 0);
                const avg = sum / numbers.length;

                weightAnalytics.weightAnalytics.bodyWeightGraphs.allWeights.pop();
                weightAnalytics.weightAnalytics.bodyWeightGraphs.allWeights.push({
                    weight: avg,
                    date: new Date()
                });

                weightAnalytics.weightAnalytics.bodyWeightGraphs.weekWeights.push({
                    weight: weight,
                    date: new Date()
                });
            }

            await weightAnalytics.weightAnalytics.save();

            return {
                success: true,
                code: 200,
                weightAnalytics: weightAnalytics.weightAnalytics
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

    async deleteWeight(userId: string, weightIndex: number){
        try{
            const weightAnalytics = await UserModel.findById(userId).populate<{ weightAnalytics: weightAnalyticsDocument }>('weightAnalytics');

            if(!weightAnalytics?.weightAnalytics){
                return {
                    success: false,
                    code: 404,
                    message: "Weight analytics not found"
                }
            }
            
            if(!weightAnalytics.weightAnalytics.bodyWeightGraphs.weekWeights[weightIndex]){
                return {
                    success: false,
                    code: 404,
                    message: "Weight not found"
                }
            }

            weightAnalytics.weightAnalytics.bodyWeightGraphs.weekWeights.splice(weightIndex, 1);
            weightAnalytics.weightAnalytics.bodyWeightGraphs.allWeights.pop();

            const numbers = []

            for(let key in weightAnalytics.weightAnalytics.bodyWeightGraphs.weekWeights) {
                numbers.push(weightAnalytics.weightAnalytics.bodyWeightGraphs.weekWeights[key].weight);
            }

            const sum = numbers.reduce((a, b) => a + b, 0);

            const avg = sum / numbers.length;

            weightAnalytics.weightAnalytics.bodyWeightGraphs.allWeights.pop();
            weightAnalytics.weightAnalytics.bodyWeightGraphs.allWeights.push({
                weight: avg,
                date: new Date()
            });

            await weightAnalytics.weightAnalytics.save();

            return {
                success: true,
                code: 200,
                weightAnalytics: weightAnalytics.weightAnalytics
            }

        } catch(error){
            logger.error('Error deleting weight:', error, {service: 'WeightAnalyticsService.deleteWeight'});
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