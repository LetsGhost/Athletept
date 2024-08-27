import logger from "../../config/winstonLogger.js";
class ProtocolUtils {
    processRequest(protocol, comment) {
        try {
            const protocolExerciseDays = [];
            const dayNumber = protocol.dayNumber;
            const dayType = protocol.dayType;
            const exercises = protocol.exercises;
            for (const exerciseName in exercises) {
                if (exercises.hasOwnProperty(exerciseName)) {
                    const protocolExercise = {
                        Exercises: exerciseName,
                        Weight: exercises[exerciseName].Weight,
                        Repetitions: exercises[exerciseName].Repetitions,
                    };
                    // Check if there's already an exercise plan for the same day
                    const existingDay = protocolExerciseDays.find((day) => day.dayNumber === dayNumber);
                    if (existingDay) {
                        // If the day is the same, add the exercise to the existing day
                        existingDay.exercises.push(protocolExercise);
                    }
                    else {
                        // Otherwise, create a new exercise day
                        const protocolExerciseDay = {
                            dayNumber: dayNumber,
                            type: dayType,
                            comment: {
                                Scale: comment.Scale,
                                Notes: comment.Notes
                            },
                            exercises: [protocolExercise],
                        };
                        // Push the new exercise day to the list
                        protocolExerciseDays.push(protocolExerciseDay);
                    }
                }
            }
            return protocolExerciseDays;
        }
        catch (error) {
            logger.error('Error processing protocol request:', error, { service: 'ProtocolUtils.processRequest' });
            return [];
        }
    }
}
export default new ProtocolUtils();
