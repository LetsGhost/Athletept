import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Exercise {
    Exercises: string;
    Weight: string;
    Sets: number;
    WarmUpSets: number;
    WarmupWeight: string;
    WarmupRepetitions: string;
    Repetitions: string;
    Rest: string;
    Execution: string;
}

export interface warmupExercise {
    Exercises: string;
    weight: string;
    repetitions: string;
}

export interface warmupMaterials {
    Materials: string;
}

export interface warmup {
    warmupExercise: warmupExercise[];
    warmupMaterials: warmupMaterials[];
}

export interface ExerciseDay {
    dayNumber: number;
    weekDay: string;
    type: string;
    trainingDone: boolean;
    trainingMissed: boolean;
    exercises: Exercise[];
    warmup: warmup[];
}

export interface ExercisePlanDocument extends Document {
    createdAt: Date;
    exerciseDays: ExerciseDay[];
}

export interface ExercisePlanModel extends Model<ExercisePlanDocument> {}

const exerciseSchema = new Schema<Exercise>({
    Exercises: String,
    Weight: String,
    Sets: Number,
    WarmUpSets: Number,
    WarmupWeight: String,
    WarmupRepetitions: String,
    Repetitions: String,
    Rest: String,
    Execution: String,
});

const warmupExerciseSchema = new Schema<warmupExercise>({
    Exercises: String,
    weight: String,
    repetitions: String,
});

const warmupMaterialsSchema = new Schema<warmupMaterials>({
    Materials: String,
})

const warmupSchema = new Schema<warmup>({
    warmupExercise: [warmupExerciseSchema],
    warmupMaterials: [warmupMaterialsSchema],
})

const exerciseDaySchema = new Schema<ExerciseDay>({
    dayNumber: Number,
    weekDay: String,
    type: String,
    trainingDone: { type: Boolean, default: false, required: true },
    trainingMissed: { type: Boolean, default: false, required: true },
    exercises: [exerciseSchema],
    warmup: [warmupSchema],
});

const exercisePlanSchema = new Schema<ExercisePlanDocument>({
    createdAt: { type: Date, required: true, default: Date.now },
    exerciseDays: [exerciseDaySchema],
});

const ExercisePlanModel: ExercisePlanModel = mongoose.model<ExercisePlanDocument, ExercisePlanModel>('ExercisePlan', exercisePlanSchema);

export default ExercisePlanModel;
