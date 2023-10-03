import mongoose, { Document, Model, Schema } from 'mongoose';

interface Exercise {
    Exercises: string;
    Weight: number;
    Sets: number;
    WarmUpSets: number;
    Repetitions: string;
    Rest: string;
    Execution: string;
}

interface ExerciseDay {
    dayNumber: number;
    type: string;
    exercises: Exercise[];
}

interface ExercisePlanDocument extends Document {
    exerciseDays: ExerciseDay[];
}

interface ExercisePlanModel extends Model<ExercisePlanDocument> {}

const exerciseSchema = new Schema<Exercise>({
    Exercises: String,
    Weight: Number,
    Sets: Number,
    WarmUpSets: Number,
    Repetitions: String,
    Rest: String,
    Execution: String,
});

const exerciseDaySchema = new Schema<ExerciseDay>({
    dayNumber: Number,
    type: String,
    wamrup: []
    exercises: [exerciseSchema],
});

const exercisePlanSchema = new Schema<ExercisePlanDocument>({
    exerciseDays: [exerciseDaySchema],
});

const ExercisePlan: ExercisePlanModel = mongoose.model<ExercisePlanDocument, ExercisePlanModel>('ExercisePlan', exercisePlanSchema);

export {ExercisePlan};
