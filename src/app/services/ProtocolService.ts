import UserModel from "../models/UserModel.js";
import {ProtocolExercisePlan} from "../models/ProtocolModel.js";
import {Document, Model} from "mongoose";
import {ExercisePlan} from "../models/ExercisePlanModel.js";
import timeUtils from "../utils/timeUtils.js";
import protocolUtils from "../utils/protocolUtils.js";
import { WeekDisplay } from "../models/WeekDisplayModel.js";
import templateUtils from "../utils/templateUtils.js";
import logger from "../../config/winstonLogger.js";

interface ProtocolExercise {
    Exercises: string;
    Weight: string;
    Repetitions: string;
}

interface Comment{
    Scale: number;
    Notes: string;
}

interface ProtocolExerciseDay {
    dayNumber: number;
    type: string;
    comment: Comment;
    exercises: ProtocolExercise[];
}

interface ProtocolExercisePlanDocument extends Document {
    exerciseDays: ProtocolExerciseDay[];
    createdAt: Date;
}

class ProtocolService{
    async createProtocol (userId: string, protocol: Record<string, ProtocolExercise>, comment: Record<string, any>) {
        try {

            const user = await UserModel.findById({ _id: { $eq: userId }});

            // Check if the user already has an protocol
            if (user?.protocolExercisePlan) {

                const user = await UserModel.findById({ _id: { $eq: userId } }).populate("protocolExercisePlan").exec();
                const createdAt = (user?.protocolExercisePlan as any as ProtocolExercisePlanDocument).createdAt;

                // Calculates the date that should be one week ago
                const currentDate = new Date();

                const createdAtWeekNumber = timeUtils.getWeekNumber(createdAt);
                const currentWeekNumber = timeUtils.getWeekNumber(currentDate);


                // If the createdAt date is older than one week, move the protocol to the oldProtocol array and create a new one
                if(createdAtWeekNumber < currentWeekNumber) {
                    await UserModel.findByIdAndUpdate(userId, {
                        $push: { oldProtocol: user?.protocolExercisePlan },
                        $unset: { protocolExercisePlan: "" }
                    });

                    const protocolExerciseDays = protocolUtils.processRequest(protocol, comment);

                    // Set the trainingDone property in the exercisePlan to true for the specific day of the protocol
                    const exercisePlan = await ExercisePlan.findById(user?.exercisePlan);
                    const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays[0].dayNumber);
                    if (exerciseDay) {
                        exerciseDay.trainingDone = true;
                        await exercisePlan?.save();
                        console.log("exercisePlan saved");
                    }

                    // Pushes the dayNumber of the protocol to the trainingDone array in the weekDisplay
                    const weekDisplay = await WeekDisplay.findById(user?.weekDisplay);
                    if(weekDisplay){
                        weekDisplay.trainingDone.push(protocolExerciseDays[0].dayNumber);
                        await weekDisplay.save();
                    }

                    if (user) {
                        const protocolExercisePlanDocument = new ProtocolExercisePlan({
                            exerciseDays: protocolExerciseDays
                        });

                        // Create and save the exercise plan using the ExercisePlan model
                        const createdExercisePlan = await ProtocolExercisePlan.create(protocolExercisePlanDocument);
                        user.protocolExercisePlan = createdExercisePlan._id;

                        await user.save();

                        return {
                            success: true,
                            code: 201,
                            newProtocol: createdExercisePlan,
                        };
                        
                    }

                    return {
                        success: false,
                        code: 500,
                        message: "Internal Server error"
                    }
                }

                const protocolExerciseDays = protocolUtils.processRequest(protocol, comment);

                // Set the trainingDone property in the exerciseplan to true for the specific day of the protocol
                const exercisePlan = await ExercisePlan.findById(user?.exercisePlan);
                const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays[0].dayNumber);
                if (exerciseDay) {
                    exerciseDay.trainingDone = true;
                    await exercisePlan?.save();
                }

                // Pushes the dayNumber of the protocol to the trainingDone array in the weekDisplay
                const weekDisplay = await WeekDisplay.findById(user?.weekDisplay);
                if(weekDisplay){
                    weekDisplay.trainingDone.push(protocolExerciseDays[0].dayNumber);
                    await weekDisplay.save();
                }

                // Append the new protocol to the existing one
                const existingProtocol = await ProtocolExercisePlan.findById(user?.protocolExercisePlan);
                if (existingProtocol) {
                    existingProtocol.exerciseDays = existingProtocol.exerciseDays.concat(protocolExerciseDays);
                    await existingProtocol.save();
                }

                return {
                    success: true,
                    code: 201,
                    newProtocol: existingProtocol,
                }
            }

            const protocolExerciseDays = protocolUtils.processRequest(protocol, comment);

            // Set the trainingDone property in the exercisePlan to true for the specific day of the protocol
            const exercisePlan = await ExercisePlan.findById(user?.exercisePlan);
            const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays[0].dayNumber);
            if (exerciseDay) {
                exerciseDay.trainingDone = true;
                await exercisePlan?.save();
                console.log(await exerciseDay.trainingDone);
            }

            if (user) {
                const protocolExercisePlanDocument = new ProtocolExercisePlan({
                    exerciseDays: protocolExerciseDays
                });

                // Create and save the exercise plan using the ExercisePlan model
                const createdExercisePlan = await ProtocolExercisePlan.create(protocolExercisePlanDocument);
                user.protocolExercisePlan = createdExercisePlan._id;

                await user.save();

                // Pushes the dayNumber of the protocol to the trainingDone array in the weekDisplay
                const weekDisplay = await WeekDisplay.findById(user?.weekDisplay);

                if(weekDisplay){
                    weekDisplay.trainingDone.push(protocolExerciseDays[0].dayNumber);
                    await weekDisplay.save();
                }

                return {
                    success: true,
                    code: 201,
                    newProtocol: createdExercisePlan,
                };
                
            }
        } catch (error) {
            logger.error('Error creating ProtocolExercisePlan:', error, {service: 'ProtocolService.createProtocol'});
            return {
                success: false,
                code: 500,
                message: 'Error creating ProtocolExercisePlan',
            };
        }
    }

    async getProtocol (userId: string) {
        try {
            const user = await UserModel.findById(userId).populate('protocolExercisePlan');
            if (user) {
                return {
                    success: true,
                    code: 200,
                    protocol: user.protocolExercisePlan,
                }
            }
        } catch (error) {
            logger.error('Error getting ProtocolExercisePlan:', error, {service: 'ProtocolService.getProtocol'});
            return {
                success: false,
                code: 500,
                message: 'Internal server error',
            };
        }
    }

    async createBlankProtocol (userId: string, day: number, type: string) {
        try{
            const user = await UserModel.findById(userId);
            // Check if the user already has an protocol
            if (user?.protocolExercisePlan) {

                const user = await UserModel.findById(userId).populate("protocolExercisePlan").exec();
                const createdAt = (user?.protocolExercisePlan as any as ProtocolExercisePlanDocument).createdAt;

                // Calculates the date that should be one week ago
                const currentDate = new Date();

                const createdAtWeekNumber = timeUtils.getWeekNumber(createdAt);
                const currentWeekNumber = timeUtils.getWeekNumber(currentDate);


                // If the createdAt date is older than one week, move the protocol to the oldProtocol array and create a new one
                if(createdAtWeekNumber < currentWeekNumber) {
                    await UserModel.findByIdAndUpdate(userId, {
                        $push: { oldProtocol: user?.protocolExercisePlan },
                        $unset: { protocolExercisePlan: "" }
                    });

                    const protocolExerciseDays = new ProtocolExercisePlan({
                        exerciseDays: [{
                            dayNumber: day,
                            type: type,
                            comment: {
                                Scale: 0,
                                Notes: ""
                            },
                            exercises: []
                        }]
                    })

                    // Set the trainingDone property in the exercisePlan to true for the specific day of the protocol
                    const exercisePlan = await ExercisePlan.findById(user?.exercisePlan);
                    const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays.exerciseDays[0].dayNumber);
                    if (exerciseDay) {
                        exerciseDay.trainingMissed = true;
                        await exercisePlan?.save();
                    }

                    // Pushes the dayNumber of the protocol to the trainingDone array in the weekDisplay
                    const weekDisplay = await WeekDisplay.findById(user?.weekDisplay);
                    if(weekDisplay){
                        weekDisplay.trainingDone.push(day);
                        await weekDisplay.save();
                    }

                    if (user) {
                        const protocolExercisePlanDocument = new ProtocolExercisePlan({
                            exerciseDays: protocolExerciseDays
                        });

                        // Create and save the exercise plan using the ExercisePlan model
                        const createdExercisePlan = await ProtocolExercisePlan.create(protocolExercisePlanDocument);
                        user.protocolExercisePlan = createdExercisePlan._id;

                        await user.save();

                        return {
                            success: true,
                            code: 201,
                            newProtocol: createdExercisePlan,
                        };
                        
                    }

                    return {
                        success: false,
                        code: 500,
                        message: "Internal Server error"
                    }
                }

                const protocolExerciseDays = new ProtocolExercisePlan({
                    exerciseDays: [{
                        dayNumber: day,
                        type: type,
                        comment: {
                            Scale: 0,
                            Notes: ""
                        },
                        exercises: []
                    }]
                })
                            

                // Set the trainingDone property in the exerciseplan to true for the specific day of the protocol
                const exercisePlan = await ExercisePlan.findById(user?.exercisePlan);
                const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays.exerciseDays[0].dayNumber);
                if (exerciseDay) {
                    exerciseDay.trainingDone = true;
                    await exercisePlan?.save();
                }

                // Pushes the dayNumber of the protocol to the trainingDone array in the weekDisplay
                const weekDisplay = await WeekDisplay.findById(user?.weekDisplay);
                if(weekDisplay){
                    weekDisplay.trainingDone.push(day);
                    await weekDisplay.save();
                }

                // Append the new protocol to the existing one
                const existingProtocol = await ProtocolExercisePlan.findById(user?.protocolExercisePlan);
                if (existingProtocol) {
                    existingProtocol.exerciseDays = existingProtocol.exerciseDays.concat(protocolExerciseDays.exerciseDays);
                    await existingProtocol.save();
                }

                return {
                    success: true,
                    code: 201,
                    newProtocol: existingProtocol,
                }
            }

            const protocolExerciseDays = new ProtocolExercisePlan({
                exerciseDays: [{
                    dayNumber: day,
                    type: type,
                    comment: {
                        Scale: 0,
                        Notes: ""
                    },
                    exercises: []
                }]
            })

            // Set the trainingDone property in the exercisePlan to true for the specific day of the protocol
            const exercisePlan = await ExercisePlan.findById(user?.exercisePlan);
            const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays.exerciseDays[0].dayNumber);
            if (exerciseDay) {
                exerciseDay.trainingDone = true;
                await exercisePlan?.save();
            }

            if (user) {
                const protocolExercisePlanDocument = new ProtocolExercisePlan({
                    exerciseDays: protocolExerciseDays
                });

                // Create and save the exercise plan using the ExercisePlan model
                const createdExercisePlan = await ProtocolExercisePlan.create(protocolExercisePlanDocument);
                user.protocolExercisePlan = createdExercisePlan._id;

                await user.save();

                // Pushes the dayNumber of the protocol to the trainingDone array in the weekDisplay
                const weekDisplay = await WeekDisplay.findById(user?.weekDisplay);

                if(weekDisplay){
                    weekDisplay.trainingDone.push(day);
                    await weekDisplay.save();
                }

                return {
                    success: true,
                    code: 201,
                    newProtocol: createdExercisePlan,
                };
                
            }
        } catch(error) {
            logger.error('Error creating ProtocolExercisePlan:', error, {service: 'ProtocolService.createBlankProtocol'});
            return {
                success: false,
                code: 500,
                message: 'Internal server error',
            };
        }
    }

    async downloadProtocol (userId: string) {
        try{
            // Get the protocol
            const user = await UserModel.findById(userId).populate('protocolExercisePlan');
            const userInfo = await UserModel.findById(userId).populate('exercisePlan');

            if (!user) {
                return {
                    success: false,
                    code: 500,
                }
            }

            const templatePath = "protocol.ejs";
            const html = templateUtils.renderTemplateWithData(templatePath, { protocolExercisePlan: user?.protocolExercisePlan });
            const pdfBuffer = await templateUtils.generatePdfFromTemplate(html);

            return {
                success: true,
                code: 200,
                pdfBuffer,
                userInfo
            }
        } catch(error) {
            logger.error('Error downloading ProtocolExercisePlan:', error, {service: 'ProtocolService.downloadProtocol'});
            return {
                success: false,
                code: 500,
                message: 'Internal server error',
            };
        }
    }
}

export default new ProtocolService();