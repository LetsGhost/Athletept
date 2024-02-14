import mongoose, { Model, Schema, Document } from 'mongoose';

export interface bodyWeight {
    lastWeight: number;
    actualWeight: number;
    weightGoal: number;
    weightStart: number;
}

// TODO: Remove this graph
export interface bodyWeightGraphSixteenWeeks {
    weight: number[];
}

export interface bodyWeightGraphs {
    weekWeights: weight[];
    allWeights: weight[];
}

export interface weight{
    weight: number;
    date: Date;
}

export interface weightAnalyticsModel {
    createdAt: Date;
    bodyWeight: bodyWeight;
    bodyWeightGraphSixteenWeeks: bodyWeightGraphSixteenWeeks[];
    bodyWeightGraphs: bodyWeightGraphs;
}

export interface weightAnalyticsDocument extends weightAnalyticsModel, Document {}

export interface WeightAnalyticsPlanModel extends Model<weightAnalyticsDocument> {}

const bodyWeightSchema = new Schema<bodyWeight>({
    lastWeight: Number,
    actualWeight: Number,
    weightGoal: Number,
    weightStart: Number,
});

const bodyWeightGraphSixteenWeeksSchema = new Schema<bodyWeightGraphSixteenWeeks>({
    weight: [Number],
});

const bodyWeight = new Schema<weight>({
    weight: Number,
    date: Date,
});

const bodyWeightGraphsSchema = new Schema<bodyWeightGraphs>({
    weekWeights: [bodyWeight],
    allWeights: [bodyWeight],
});

const weightAnalyticsSchema = new Schema<weightAnalyticsDocument>({
    createdAt: { type: Date, required: true, default: Date.now },
    bodyWeight: bodyWeightSchema,
    bodyWeightGraphSixteenWeeks: [bodyWeightGraphSixteenWeeksSchema],
    bodyWeightGraphs: bodyWeightGraphsSchema,
});

const WeightAnalyticsModel = mongoose.model<weightAnalyticsDocument, WeightAnalyticsPlanModel>('WeightAnalytics', weightAnalyticsSchema);

export default WeightAnalyticsModel;