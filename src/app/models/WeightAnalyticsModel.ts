import mongoose, { Model, Schema } from 'mongoose';

export interface bodyWeight {
    lastWeight: number;
    actualWeight: number;
    weightGoal: number;
    weightStart: number;
}

export interface bodyWeightGraphSixteenWeeks {
    weight: number[];
}

export interface weightAnalyticsModel {
    createdAt: Date;
    bodyWeight: bodyWeight;
    bodyWeightGraphSixteenWeeks: bodyWeightGraphSixteenWeeks[];
}

export interface WeightAnalyticsPlanModel extends Model<weightAnalyticsModel> {}

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

export default WeightAnalyticsModel;