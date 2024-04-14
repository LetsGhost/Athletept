import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ProtocolExercise {
    Exercises: string;
    Weight: number[];
    Repetitions: number[];
}

export interface Comment{
    Scale: number;
    Notes: string
}

export interface ProtocolExerciseDay {
    dayNumber: number;
    type: string;
    comment: Comment;
    exercises: ProtocolExercise[];
}

export interface ProtocolExercisePlanDocument extends Document {
    exerciseDays: ProtocolExerciseDay[];
    createdAt: Date;
}

export interface ProtocolExercisePlanModel extends Model<ProtocolExercisePlanDocument> {}

const protocolExerciseSchema = new Schema<ProtocolExercise>({
    Exercises: String,
    Weight: [Number],
    Repetitions: [Number]
});

const commentSchema = new Schema<Comment>({
    Scale: Number,
    Notes: String
});

const protocolExerciseDaySchema = new Schema<ProtocolExerciseDay>({
    dayNumber: Number,
    type: String,
    comment: commentSchema,
    exercises: [protocolExerciseSchema],
});

const protocolExercisePlanSchema = new Schema<ProtocolExercisePlanDocument>({
    exerciseDays: [protocolExerciseDaySchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ProtocolExercisePlanModel: ProtocolExercisePlanModel = mongoose.model<ProtocolExercisePlanDocument, ProtocolExercisePlanModel>('ProtocolExercisePlan', protocolExercisePlanSchema);

export default ProtocolExercisePlanModel;
