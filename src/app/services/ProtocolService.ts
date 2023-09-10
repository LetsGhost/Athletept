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

export const createProtocol = async (userId: string, protocol: Record<string, ProtocolExercise>, comment: Record<string, any>) => {
    try {
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

        // Find the user and update the exercise plan
        const user = await UserModel.findById(userId);
        if (user) {
            const protocolExercisePlanDocument = new ProtocolExercisePlan({
                exerciseDays: protocolExerciseDays
            });

            // Create and save the exercise plan using the ExercisePlan model
            const createdExercisePlan = await ProtocolExercisePlan.create(protocolExercisePlanDocument);
            user.protocolExercisePlan = createdExercisePlan._id;

            await user.save();

            return createdExercisePlan;
        }
    } catch (error) {
        console.log('Error creating ProtocolExercisePlan:', error);
        throw error;
    }
}

export const getProtocol = async (userId: string) => {
    try {
        const user = await UserModel.findById(userId).populate('protocolExercisePlan');
        if (user) {
            return user.protocolExercisePlan;
        }
    } catch (error) {
        console.log('Error getting ProtocolExercisePlan:', error);
        throw error;
    }
}