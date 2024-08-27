import mongoose, { Schema } from 'mongoose';
const bodyWeightSchema = new Schema({
    lastWeight: Number,
    actualWeight: Number,
    weightGoal: Number,
    weightStart: Number,
});
const bodyWeight = new Schema({
    weight: Number,
    date: Date,
});
const bodyWeightGraphsSchema = new Schema({
    weekWeights: [bodyWeight],
    allWeights: [bodyWeight],
});
const weightAnalyticsSchema = new Schema({
    createdAt: { type: Date, required: true, default: Date.now },
    bodyWeight: bodyWeightSchema,
    bodyWeightGraphs: bodyWeightGraphsSchema,
});
const WeightAnalyticsModel = mongoose.model('WeightAnalytics', weightAnalyticsSchema);
export default WeightAnalyticsModel;
