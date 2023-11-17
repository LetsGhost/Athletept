import {Document, Model} from "mongoose";

interface ProtocolExercise {
    Exercises: string;
    Weight: string;
    Repetitions: string;
}

interface Comment{
    Scale: number;
    Notes: string
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
    processRequest(protocol: Record<string, any>, comment: Record<string, any>){
        try{
            const protocolExerciseDays: ProtocolExerciseDay[] = [];
    
            const dayNumber = protocol.dayNumber;
            const dayType = protocol.dayType;
            const exercises = protocol.exercises;
    
            for (const exerciseName in exercises) {
                if (exercises.hasOwnProperty(exerciseName)){
                    const protocolExercise: ProtocolExercise = {
                        Exercises: exerciseName,
                        Weight: exercises[exerciseName].Weight,
                        Repetitions: exercises[exerciseName].Repetitions,
                    }
    
                    // Check if there's already an exercise plan for the same day
                    const existingDay = protocolExerciseDays.find((day) => day.dayNumber === dayNumber);
    
                    if (existingDay) {
                        // If the day is the same, add the exercise to the existing day
                        existingDay.exercises.push(protocolExercise);
                    } else {
                        // Otherwise, create a new exercise day
                        const protocolExerciseDay: ProtocolExerciseDay = {
                            dayNumber: dayNumber,
                            type: dayType,
                            comment: {
                                Scale: comment.Scale,
                                Notes: comment.Notes
                            },
                            exercises: [protocolExercise],
                        }
    
                        // Push the new exercise day to the list
                        protocolExerciseDays.push(protocolExerciseDay);
                    }
                }
            }
    
            return protocolExerciseDays;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}

export default new ProtocolUtils();