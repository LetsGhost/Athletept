import mongoose, { Schema } from 'mongoose';
const protocolExerciseSchema = new Schema({
    Exercises: String,
    Weight: [Number],
    Repetitions: [Number]
});
const commentSchema = new Schema({
    Scale: Number,
    Notes: String
});
const protocolExerciseDaySchema = new Schema({
    dayNumber: Number,
    type: String,
    comment: commentSchema,
    exercises: [protocolExerciseSchema],
});
const protocolExercisePlanSchema = new Schema({
    exerciseDays: [protocolExerciseDaySchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const ProtocolExercisePlanModel = mongoose.model('ProtocolExercisePlan', protocolExercisePlanSchema);
export default ProtocolExercisePlanModel;
