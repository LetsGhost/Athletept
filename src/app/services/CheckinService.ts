import { CheckIn } from "../models/CheckInModel"
import UserModel from "../models/UserModel";
import { Document, Model } from 'mongoose';
import WeightAnalyticsService from "./WeightAnalyticsService";

interface currentGrowth {
    answer: string;
    boolean: boolean;
}

interface problems{
    answer: string;
    boolean: boolean;
}

interface regeneration{
    boolean: boolean;
}

interface change{
    answer: string;
    boolean: boolean;
}

interface weight {
    weight: number;
}

interface checkIn {
    currentGrowth: currentGrowth;
    problems: problems;
    regeneration: regeneration;
    change: change;
    weight: weight;
}

interface checkInDocument extends Document {
    createdAt: Date;
    checkInStatus: boolean
    checkIn: checkIn;
}

interface CheckInModel extends Model<checkInDocument> {}

interface request {
    currentGrowth: { answer: string, boolean: boolean },
    problems: { answer: string, boolean: boolean },
    regeneration: { boolean: boolean },
    change: { answer: string, boolean: boolean }
    weight: { weight: number }
    checkInStatus: boolean
}

class CheckInService {
    async createCheckIn(userId: string, checkIn: request){
        try{
            const user = await UserModel.findById(userId)
            
            if(!user){
                console.log("User not found")
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            // Populate the checkIn field
            const userCheckIn = await UserModel.findById(userId).populate('checkIn');
            // Cast userCheckIn to CheckInModel
            const currentCheckIn = (userCheckIn?.checkIn as unknown) as checkInDocument;

            // Calculates the date that should be one week ago
            const currentDate = new Date();

            if(currentDate.getDay() === 1 && currentDate > currentCheckIn?.createdAt){ //<- If its Monday and the createdAt date is less than the current date is later then currentDate than ist true!

                await UserModel.findByIdAndUpdate(userId, {
                    $push: { oldCheckIn: user?.checkIn },
                    $unset: { checkIn: "" }
                });
                
                const currentGrowth = checkIn.currentGrowth
                const problems = checkIn.problems
                const regeneration = checkIn.regeneration
                const change = checkIn.change
                const weight = checkIn.weight

                await WeightAnalyticsService.updateWeightAnalytics(userId, weight.weight, user?.userInfo?.currentWeight)

                const newCheckIn = new CheckIn({
                    checkIn: {
                        currentGrowth: currentGrowth,
                        problems: problems,
                        regeneration: regeneration,
                        change: change,
                        weight: weight,
                    },
                    checkInStatus: true,
                })
                await newCheckIn.save()

                user.checkIn = newCheckIn._id
                await user.save()

                return {
                    success: true,
                    code: 201,
                    checkIn: newCheckIn
                }
            }
            
            if(currentCheckIn?.checkInStatus){
                return {
                    success: false,
                    code: 400,
                    message: "Check-in already done for this week"
                }
            }

            const currentGrowth = checkIn.currentGrowth
            const problems = checkIn.problems
            const regeneration = checkIn.regeneration
            const change = checkIn.change
            const weight = checkIn.weight

            await WeightAnalyticsService.updateWeightAnalytics(userId, weight.weight, user?.userInfo?.currentWeight)

            const newCheckIn = new CheckIn({
                checkIn: {
                    currentGrowth: currentGrowth,
                    problems: problems,
                    regeneration: regeneration,
                    change: change,
                    weight: weight,
                },
                checkInStatus: true,
            })
            await newCheckIn.save()

            user.checkIn = newCheckIn._id
            await user.save()

            return {
                success: true,
                code: 200,
                checkIn: newCheckIn
            }            
        } catch(err){
            console.log("Error while creating check-in in CheckInService.createCheckIn: ", err)
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async getCheckIn(userId: string){
        try{
            const user = await UserModel.findById(userId)

            if(!user){
                console.log("User not found")
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            const userCheckIn = await UserModel.findById(userId).populate('checkIn');
            const currentCheckIn = (userCheckIn?.checkIn as unknown) as checkInDocument;

            if(!currentCheckIn){
                console.log("Check-in not found")
                return {
                    success: false,
                    code: 404,
                    message: "Check-in not found"
                }
            }

            return {
                success: true,
                code: 200,
                checkIn: currentCheckIn
            }
        } catch(err){
            console.log("Error while getting check-in in CheckInService.getCheckIn: ", err)
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async getCheckInById(checkInId: string){
        try{
            const checkIn = await CheckIn.findById(checkInId)

            if(!checkIn){
                console.log("Check-in not found")
                return {
                    success: false,
                    code: 404,
                    message: "Check-in not found"
                }
            }

            return {
                success: true,
                code: 200,
                checkIn: checkIn
            }
        } catch(err){
            console.log("Error while getting check-in in CheckInService.getCheckInById: ", err)
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }
}

export default new CheckInService();