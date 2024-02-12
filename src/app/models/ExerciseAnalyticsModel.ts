import mongoose, { Document, Model, Schema } from 'mongoose';

export interface exercise{
  name: string;
  topWeight: number;
  lastWeight: number;
  date: Date
}

export interface topExercises {
  exercises: exercise[];
}

export interface exerciseRanking {
  exercises: exercise[];
}

export interface exerciseAnalyticsDocument extends Document{
  topExercises: topExercises;
  exerciseRanking: exerciseRanking;
  createdAt: Date;
}

export interface exerciseAnalyticsModel extends Model<exerciseAnalyticsDocument> {}

const exerciseSchema = new Schema<exercise>({
  name: {type: String, required: true},
  topWeight: {type: Number, required: true},
  lastWeight: {type: Number, required: true},
  date: {type: Date, required: true}
});

const topExercisesSchema = new Schema<topExercises>({
  exercises: [exerciseSchema]
});

const exerciseRankingSchema = new Schema<exerciseRanking>({
  exercises: [exerciseSchema]
});

const exerciseAnalyticsSchema = new Schema<exerciseAnalyticsDocument>({
  topExercises: topExercisesSchema,
  exerciseRanking: exerciseRankingSchema,
  createdAt: {type: Date, default: Date.now}
});

const ExerciseAnalyticsModel = mongoose.model<exerciseAnalyticsDocument, exerciseAnalyticsModel>('ExerciseAnalytics', exerciseAnalyticsSchema);

export default ExerciseAnalyticsModel;
