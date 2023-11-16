import mongoose, { Document, Model, Schema } from 'mongoose';

interface bodyWeight {
    lastWeight: number;
    actualWeight: number;
    weightGoal: number;
    weightStart: number;
}

interface bodyWeightGraphSixteenWeeks {
    weight: number[];
}

interface weightAnalyticsModel {
    createdAt: Date;
    bodyWeight: bodyWeight;
    bodyWeightGraphSixteenWeeks: bodyWeightGraphSixteenWeeks[];
}

interface WeightAnalyticsPlanModel extends Model<weightAnalyticsModel> {}

const bodyWeightSchema = new Schema<bodyWeight>({
    lastWeight: Number,
    actualWeight: Number,
    weightGoal: Number,
    weightStart: Number,
});

const bodyWeightGraphSixteenWeeksSchema = new Schema<bodyWeightGraphSixteenWeeks>({
    weight: [Number],
});

const weightAnalyticsSchema = new Schema<weightAnalyticsModel>({
    createdAt: { type: Date, required: true, default: Date.now },
    bodyWeight: bodyWeightSchema,
    bodyWeightGraphSixteenWeeks: [bodyWeightGraphSixteenWeeksSchema],
});

const WeightAnalyticsModel = mongoose.model<weightAnalyticsModel, WeightAnalyticsPlanModel>('WeightAnalytics', weightAnalyticsSchema);

export { WeightAnalyticsModel };