import { CheckIn } from "../models/CheckInModel.js"
import UserModel from "../models/UserModel.js";
import { Document, Model } from 'mongoose';
import WeightAnalyticsService from "./WeightAnalyticsService.js";
import timeUtils from "../utils/timeUtils.js";
import logger from "../../config/winstonLogger.js";
import templateUtils from "../utils/templateUtils.js";

interface currentGrowth {
    answer: string;
    answer2: string
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
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            // Populate the checkIn field
            const userCheckIn = await UserModel.findById(userId).populate('checkIn');

            if(userCheckIn?.checkIn){
                // Cast userCheckIn to CheckInModel
                const currentCheckIn = (userCheckIn?.checkIn as unknown) as checkInDocument;

                // Calculates the date that should be one week ago
                const currentDate = new Date();

                const currentWeekNumber = timeUtils.getWeekNumber(currentDate);
                const createdAtWeekNumber = timeUtils.getWeekNumber(currentCheckIn?.createdAt);

                if(createdAtWeekNumber < currentWeekNumber){ //<- When the createdAt is located last week it is set true

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
                code: 201,
                checkIn: newCheckIn
            }

                        
        } catch(err){
            logger.error(`Internal server error: ${err}`, {service: 'CheckInService.createCheckIn'});
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
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            const userCheckIn = await UserModel.findById(userId).populate('checkIn');
            const currentCheckIn = (userCheckIn?.checkIn as unknown) as checkInDocument;

            if(!currentCheckIn){
                logger.error('Check-in not found', {service: 'CheckInService.getCheckIn'});
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
            logger.error(`Internal server error: ${err}`, {service: 'CheckInService.getCheckIn'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async downloadCheckIn(userId: string){
        try{
            const user = await UserModel.findById(userId)

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            const userCheckIn = await UserModel.findById(userId).populate('checkIn');
            if(!userCheckIn?.checkIn){
                logger.error('Check-in not found', {service: 'CheckInService.downloadCheckIn'});
                return {
                    success: false,
                    code: 404,
                    message: "Check-in not found"
                }
            }

            const templatePath = "checkIn.ejs";
            const html = templateUtils.renderTemplateWithData(templatePath, { checkIn: userCheckIn?.checkIn });
            const pdfBuffer = await templateUtils.generatePdfFromTemplate(html);

            return {
                success: true,
                code: 200,
                pdfBuffer,
                userInfo: user
            }
        } catch(err){
            logger.error(`Internal server error: ${err}`, {service: 'CheckInService.downloadCheckIn'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async getCheckInStatus(userId: string){
        try{
            const user = await UserModel.findById(userId)

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            const userCheckIn = await UserModel.findById(userId).populate('checkIn');
            const currentCheckIn = (userCheckIn?.checkIn as unknown) as checkInDocument;

            if(!currentCheckIn){
                return {
                    success: true,
                    code: 404,
                    checkInStatus: false,
                }
            }

            // Calculates the date that should be one week ago
            const currentDate = new Date();

            const currentWeekNumber = timeUtils.getWeekNumber(currentDate);
            const createdAtWeekNumber = timeUtils.getWeekNumber(currentCheckIn?.createdAt);

            if(createdAtWeekNumber < currentWeekNumber){ //<- When the createdAt is located last week it is set true
                currentCheckIn.checkInStatus = false;
                await currentCheckIn.save();

                return {
                    success: true,
                    code: 200,
                    checkInStatus: false
                }
            }

            return {
                success: true,
                code: 200,
                checkInStatus: currentCheckIn.checkInStatus
            }
        } catch(err){
            logger.error(`Internal server error: ${err}`, {service: 'CheckInService.getCheckInStatus'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }
}

export default new CheckInService();