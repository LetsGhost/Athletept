import mongoose, { Document, Model, Schema } from 'mongoose';

interface ProtocolExercise {
    Exercises: string;
    Weight: number;
    Sets: number;
    WarmUpSets: number;
    Repetitions: string;
    Rest: string;
    Execution: string;
}

interface ProtocolExerciseDay {
    dayNumber: number;
    type: string;
    exercises: ProtocolExercise[];
}

interface ProtocolExercisePlanDocument extends Document {
    exerciseDays: ProtocolExerciseDay[];
}

interface ProtocolExercisePlanModel extends Model<ProtocolExercisePlanDocument> {}

const protocolExerciseSchema = new Schema<ProtocolExercise>({
    Exercises: String,
    Weight: Number,
    Sets: Number,
    WarmUpSets: Number,
    Repetitions: String,
    Rest: String,
    Execution: String,
});

const protocolExerciseDaySchema = new Schema<ProtocolExerciseDay>({
    dayNumber: Number,
    type: String,
    exercises: [protocolExerciseSchema],
});

const protocolExercisePlanSchema = new Schema<ProtocolExercisePlanDocument>({
    exerciseDays: [protocolExerciseDaySchema],
});

const ProtocolExercisePlan: ProtocolExercisePlanModel = mongoose.model<ProtocolExercisePlanDocument, ProtocolExercisePlanModel>('ProtocolExercisePlan', protocolExercisePlanSchema);

export { ProtocolExercisePlan };
