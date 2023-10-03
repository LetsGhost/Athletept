import mongoose, { Document, Model, Schema } from 'mongoose';

interface WarmupExercise {
    Exercises: string;
    Material: string;
}

interface WarmupExercisePlanDocument extends Document {
    warmup: WarmupExercise[];
}

interface WarmupExercisePlanModel extends Model<WarmupExercisePlanDocument> {}

const warmupSchema = new Schema<WarmupExercise>({
    Exercises: String,
    Material: String,
});

const warmupPlanSchema = new Schema<WarmupExercisePlanModel>({
    warmup: [warmupSchema],
});


export {warmupPlanSchema};
