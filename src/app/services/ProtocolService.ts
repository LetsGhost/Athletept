import UserModel from "../models/UserModel";
import {ProtocolExercisePlan} from "../models/ProtocolModel";
import {Document, Model} from "mongoose";
import {ExercisePlan} from "../models/ExercisePlanModel";

interface ProtocolExercise {
    Exercises: string;
    Weight: string;
    Repetitions: string;
}

interface Comment{
    Scale: number;
    Changes: string;
    Problems: string;
}

interface ProtocolExerciseDay {
    dayNumber: number;
    type: string;
    comment: Comment;
    exercises: ProtocolExercise[];
}

interface ProtocolExercisePlanDocument extends Document {
    exerciseDays: ProtocolExerciseDay[];
}

interface ProtocolExercisePlanModel extends Model<ProtocolExercisePlanDocument> {}

class ProtocolService{
    async createProtocol (userId: string, protocol: Record<string, ProtocolExercise>, comment: Record<string, any>) {
        try {

            const user = await UserModel.findById(userId);

            // Check if the user already has an protocol
            if (user?.protocolExercisePlan) {
                // Update the existing one with a new one
                const protocolExerciseDays: ProtocolExerciseDay[] = [];

                for (const key in protocol) {
                    //console.log(key);
                    if (protocol.hasOwnProperty(key)){
                        const [day, type, exerciseName] = key.split('-');
                        const dayInt = parseInt(day);

                        const protocolExercise: ProtocolExercise = {
                            Exercises: exerciseName,
                            Weight: protocol[key].Weight,
                            Repetitions: protocol[key].Repetitions,
                        }

                        // Check if there's already an exercise plan for the same day
                        const existingDay = protocolExerciseDays.find((day) => day.dayNumber === dayInt);

                        if (existingDay) {
                            // If the day is the same, add the exercise to the existing day
                            existingDay.exercises.push(protocolExercise);
                        } else {
                            // Otherwise, create a new exercise day
                            const protocolExerciseDay: ProtocolExerciseDay = {
                                dayNumber: dayInt,
                                type: type,
                                comment: {
                                    Scale: comment.Scale,
                                    Changes: comment.Changes,
                                    Problems: comment.Problems,
                                },
                                exercises: [protocolExercise],
                            }

                            // Push the new exercise day to the list
                            protocolExerciseDays.push(protocolExerciseDay);
                        }
                    }
                }

                // Set the trainingDone property in the exerciseplan to true for the specific day of the protocol
                const exercisePlan = await ExercisePlan.findById(user?.exercisePlan);
                const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays[0].dayNumber);
                if (exerciseDay) {
                    exerciseDay.trainingDone = true;
                    await exercisePlan?.save();
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

            const protocolExerciseDays: ProtocolExerciseDay[] = [];

            for (const key in protocol) {
                if (protocol.hasOwnProperty(key)){
                    const [day, type, exerciseName] = key.split('-');
                    const dayInt = parseInt(day);

                    const protocolExercise: ProtocolExercise = {
                        Exercises: exerciseName,
                        Weight: protocol[key].Weight,
                        Repetitions: protocol[key].Repetitions,
                    }

                    // Check if there's already an exercise plan for the same day
                    const existingDay = protocolExerciseDays.find((day) => day.dayNumber === dayInt);

                    if (existingDay) {
                        // If the day is the same, add the exercise to the existing day
                        existingDay.exercises.push(protocolExercise);
                    } else {
                        // Otherwise, create a new exercise day
                        const protocolExerciseDay: ProtocolExerciseDay = {
                            dayNumber: dayInt,
                            type: type,
                            comment: {
                                Scale: comment.Scale,
                                Changes: comment.Changes,
                                Problems: comment.Problems,
                            },
                            exercises: [protocolExercise],
                        }

                        // Push the new exercise day to the list
                        protocolExerciseDays.push(protocolExerciseDay);
                    }
                }
            }

            // Set the trainingDone property in the exerciseplan to true for the specific day of the protocol
            const exercisePlan = await ExercisePlan.findById(user?.exercisePlan);
            const exerciseDay = exercisePlan?.exerciseDays.find((day) => day.dayNumber === protocolExerciseDays[0].dayNumber);
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

                return {
                    success: true,
                    code: 201,
                    newProtocol: createdExercisePlan,
                };
                
            }
        } catch (error) {
            console.log('Error creating ProtocolExercisePlan:', error);
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
            console.log('Error getting ProtocolExercisePlan:', error);
            return {
                success: false,
                code: 500,
                message: 'Internal server error',
            };
        }
    }
}

export default new ProtocolService();