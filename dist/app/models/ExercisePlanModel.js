import mongoose, { Schema } from 'mongoose';
const exerciseSchema = new Schema({
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
const warmupExerciseSchema = new Schema({
    Exercises: String,
    weight: String,
    repetitions: String,
});
const warmupMaterialsSchema = new Schema({
    Materials: String,
});
const warmupSchema = new Schema({
    warmupExercise: [warmupExerciseSchema],
    warmupMaterials: [warmupMaterialsSchema],
});
const exerciseDaySchema = new Schema({
    dayNumber: Number,
    weekDay: String,
    type: String,
    trainingDone: { type: Boolean, default: false, required: true },
    trainingMissed: { type: Boolean, default: false, required: true },
    exercises: [exerciseSchema],
    warmup: [warmupSchema],
});
const exercisePlanSchema = new Schema({
    createdAt: { type: Date, required: true, default: Date.now },
    exerciseDays: [exerciseDaySchema],
});
const ExercisePlanModel = mongoose.model('ExercisePlan', exercisePlanSchema);
export default ExercisePlanModel;
