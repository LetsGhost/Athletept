import mongoose, { Schema } from 'mongoose';
const exerciseSchema = new Schema({
    name: { type: String, required: true },
    topWeight: { type: Number, required: true },
    lastWeights: { type: [Number], required: true },
    date: { type: Date, required: true }
});
const topExercisesSchema = new Schema({
    exercises: [exerciseSchema]
});
const exerciseRankingSchema = new Schema({
    exercises: [exerciseSchema]
});
const exerciseAnalyticsSchema = new Schema({
    topExercises: topExercisesSchema,
    exerciseRanking: exerciseRankingSchema,
    createdAt: { type: Date, default: Date.now }
});
const ExerciseAnalyticsModel = mongoose.model('ExerciseAnalytics', exerciseAnalyticsSchema);
export default ExerciseAnalyticsModel;
