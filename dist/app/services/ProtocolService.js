import UserModel from "../models/UserModel.js";
import ProtocolExercisePlanModel from "../models/ProtocolModel.js";
import ExercisePlanModel from "../models/ExercisePlanModel.js";
import WeekDisplayModel from "../models/WeekDisplayModel.js";
import templateUtils from "../utils/templateUtils.js";
import logger from "../../config/winstonLogger.js";
class ProtocolService {
    async createProtocol(userId, protocol) {
        try {
            const user = await UserModel.findById(userId);
            // Mark the training day as done
            async function markTrainingDayAsDone() {
                // Set the trainingDone property in the exercisePlan to true for the specific day of the protocol
                const exercisePlan = await ExercisePlanModel.findById(user?.exercisePlan);
                const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocol.dayNumber);
                if (exerciseDay) {
                    exerciseDay.trainingDone = true;
                    await exercisePlan?.save();
                }
                // Pushes the dayNumber of the protocol to the trainingDone array in the weekDisplay
                const weekDisplay = await WeekDisplayModel.findById(user?.weekDisplay);
                if (weekDisplay) {
                    weekDisplay.trainingDone.push(protocol.dayNumber);
                    await weekDisplay.save();
                }
            }
            // Check if the user already has an protocol
            // If yes then append the new protocol to the existing one
            if (user?.protocolExercisePlan) {
                const user = await UserModel.findById(userId).populate("protocolExercisePlan").exec();
                await markTrainingDayAsDone();
                // Append the new protocol to the existing one
                const existingProtocol = await ProtocolExercisePlanModel.findById(user?.protocolExercisePlan);
                if (existingProtocol) {
                    existingProtocol.exerciseDays = existingProtocol.exerciseDays.concat(protocol);
                    await existingProtocol.save();
                }
                return {
                    success: true,
                    code: 201,
                    newProtocol: existingProtocol,
                };
            }
            if (user) {
                await markTrainingDayAsDone();
                const protocolExercisePlanDocument = new ProtocolExercisePlanModel({
                    exerciseDays: protocol
                });
                // Create and save the exercise plan using the ExercisePlan model
                const createdExercisePlan = await ProtocolExercisePlanModel.create(protocolExercisePlanDocument);
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
                message: 'Internal server error',
            };
        }
        catch (error) {
            logger.error('Error creating ProtocolExercisePlan:', error, { service: 'ProtocolService.createProtocol' });
            return {
                success: false,
                code: 500,
                message: 'Error creating ProtocolExercisePlan',
            };
        }
    }
    async getProtocol(userId) {
        try {
            const user = await UserModel.findById(userId).populate('protocolExercisePlan');
            if (user) {
                return {
                    success: true,
                    code: 200,
                    protocol: user.protocolExercisePlan,
                };
            }
        }
        catch (error) {
            logger.error('Error getting ProtocolExercisePlan:', error, { service: 'ProtocolService.getProtocol' });
            return {
                success: false,
                code: 500,
                message: 'Internal server error',
            };
        }
    }
    async createBlankProtocol(userId, day, type) {
        try {
            const user = await UserModel.findById(userId);
            // Check if the user already has an protocol
            if (user?.protocolExercisePlan) {
                const user = await UserModel.findById(userId).populate("protocolExercisePlan").exec();
                const protocolExerciseDays = new ProtocolExercisePlanModel({
                    exerciseDays: [{
                            dayNumber: day,
                            type: type,
                            comment: {
                                Scale: 0,
                                Notes: ""
                            },
                            exercises: []
                        }]
                });
                // Set the trainingDone property in the exerciseplan to true for the specific day of the protocol
                const exercisePlan = await ExercisePlanModel.findById(user?.exercisePlan);
                const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays.exerciseDays[0].dayNumber);
                if (exerciseDay) {
                    exerciseDay.trainingDone = true;
                    await exercisePlan?.save();
                }
                // Pushes the dayNumber of the protocol to the trainingDone array in the weekDisplay
                const weekDisplay = await WeekDisplayModel.findById(user?.weekDisplay);
                if (weekDisplay) {
                    weekDisplay.trainingDone.push(day);
                    await weekDisplay.save();
                }
                // Append the new protocol to the existing one
                const existingProtocol = await ProtocolExercisePlanModel.findById(user?.protocolExercisePlan);
                if (existingProtocol) {
                    existingProtocol.exerciseDays = existingProtocol.exerciseDays.concat(protocolExerciseDays.exerciseDays);
                    await existingProtocol.save();
                }
                return {
                    success: true,
                    code: 201,
                    newProtocol: existingProtocol,
                };
            }
            const protocolExerciseDays = new ProtocolExercisePlanModel({
                exerciseDays: [{
                        dayNumber: day,
                        type: type,
                        comment: {
                            Scale: 0,
                            Notes: ""
                        },
                        exercises: []
                    }]
            });
            // Set the trainingDone property in the exercisePlan to true for the specific day of the protocol
            const exercisePlan = await ExercisePlanModel.findById(user?.exercisePlan);
            const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays.exerciseDays[0].dayNumber);
            if (exerciseDay) {
                exerciseDay.trainingDone = true;
                await exercisePlan?.save();
            }
            if (user) {
                const protocolExercisePlanDocument = new ProtocolExercisePlanModel({
                    exerciseDays: protocolExerciseDays
                });
                // Create and save the exercise plan using the ExercisePlan model
                const createdExercisePlan = await ProtocolExercisePlanModel.create(protocolExercisePlanDocument);
                user.protocolExercisePlan = createdExercisePlan._id;
                await user.save();
                // Pushes the dayNumber of the protocol to the trainingDone array in the weekDisplay
                const weekDisplay = await WeekDisplayModel.findById(user?.weekDisplay);
                if (weekDisplay) {
                    weekDisplay.trainingDone.push(day);
                    await weekDisplay.save();
                }
                return {
                    success: true,
                    code: 201,
                    newProtocol: createdExercisePlan,
                };
            }
        }
        catch (error) {
            logger.error('Error creating ProtocolExercisePlan:', error, { service: 'ProtocolService.createBlankProtocol' });
            return {
                success: false,
                code: 500,
                message: 'Internal server error',
            };
        }
    }
    async downloadProtocol(userId) {
        try {
            // Get the protocol
            const user = await UserModel.findById(userId).populate('protocolExercisePlan');
            const userInfo = await UserModel.findById(userId).populate('exercisePlan');
            if (!user) {
                return {
                    success: false,
                    code: 500,
                };
            }
            const templatePath = "protocol.ejs";
            const html = templateUtils.renderTemplateWithData(templatePath, { protocolExercisePlan: user?.protocolExercisePlan });
            const pdfBuffer = await templateUtils.generatePdfFromTemplate(html);
            return {
                success: true,
                code: 200,
                pdfBuffer,
                userInfo
            };
        }
        catch (error) {
            logger.error('Error downloading ProtocolExercisePlan:', error, { service: 'ProtocolService.downloadProtocol' });
            return {
                success: false,
                code: 500,
                message: 'Internal server error',
            };
        }
    }
}
export default new ProtocolService();
