import {Document, Model} from "mongoose";

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
    createdAt: Date;
}

interface ProtocolExercisePlanModel extends Model<ProtocolExercisePlanDocument> {}

class ProtocolUtils {
    processRequest(protocol: Record<string, ProtocolExercise>, comment: Record<string, any>){
        try{
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

            return protocolExerciseDays;
        } catch(error){
            console.log(error);
            throw new Error('Error processing protocol request in protocolUtils.ts');
        }
    }
}

export default new ProtocolUtils();