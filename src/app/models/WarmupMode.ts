import mongoose, { Document, Model, Schema } from 'mongoose';

interface WarmupExercise {
    Exercises: string;
    Material: string;
}

interface WarmupExerciseDay {
    dayNumber: number;
    type: string;
    exercises: WarmupExercise[];
}

interface WarmupExercisePlanDocument extends Document {
    exerciseDays: WarmupExerciseDay[];
}

interface WarmupExercisePlanModel extends Model<WarmupExercisePlanDocument> {}

const exerciseSchema = new Schema<WarmupExercise>({
    Exercises: String,
    Material: String,
});

const exerciseDaySchema = new Schema<WarmupExerciseDay>({
    dayNumber: Number,
    type: String,
    exercises: [exerciseSchema],
});

const exercisePlanSchema = new Schema<WarmupExercisePlanDocument>({
    exerciseDays: [exerciseDaySchema],
});

const WarmupExercisePlan: WarmupExercisePlanModel = mongoose.model<WarmupExercisePlanDocument, WarmupExercisePlanModel>('Warmup', exercisePlanSchema);

export {WarmupExercisePlan};
