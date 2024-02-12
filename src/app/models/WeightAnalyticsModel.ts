import mongoose, { Model, Schema, Document } from 'mongoose';

export interface bodyWeight {
    lastWeight: number;
    actualWeight: number;
    weightGoal: number;
    weightStart: number;
}

export interface bodyWeightGraphSixteenWeeks {
    weight: number[];
}

export interface bodyWeightGraphs {
    weekWeights: weekWeight[];
    allWeights: allWeight[];
}

export interface weekWeight {
    weight: number,
    date: Date
}

export interface allWeight {
    weight: number,
    date: Date
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

const bodyWeightWeekWeight = new Schema<weekWeight>({
    weight: Number,
    date: { type: Date, default: Date.now }
})

const bodyWeightAllWeight = new Schema<allWeight>({
    weight: Number,
    date: { type: Date, default: Date.now }
})

const bodyWeightGraphsSchema = new Schema<bodyWeightGraphs>({
    weekWeights: [bodyWeightWeekWeight],
    allWeights: [bodyWeightAllWeight],
});

const weightAnalyticsSchema = new Schema<weightAnalyticsDocument>({
    createdAt: { type: Date, required: true, default: Date.now },
    bodyWeight: bodyWeightSchema,
    bodyWeightGraphSixteenWeeks: [bodyWeightGraphSixteenWeeksSchema],
    bodyWeightGraphs: bodyWeightGraphsSchema,
});

const WeightAnalyticsModel = mongoose.model<weightAnalyticsDocument, WeightAnalyticsPlanModel>('WeightAnalytics', weightAnalyticsSchema);

export default WeightAnalyticsModel;