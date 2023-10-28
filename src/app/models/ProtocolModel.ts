import mongoose, { Document, Model, Schema } from 'mongoose';

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

const protocolExerciseSchema = new Schema<ProtocolExercise>({
    Exercises: String,
    Weight: String,
    Repetitions: String
});

const commentSchema = new Schema<Comment>({
    Scale: Number,
    Changes: String,
    Problems: String
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

const ProtocolExercisePlan: ProtocolExercisePlanModel = mongoose.model<ProtocolExercisePlanDocument, ProtocolExercisePlanModel>('ProtocolExercisePlan', protocolExercisePlanSchema);

export { ProtocolExercisePlan };
