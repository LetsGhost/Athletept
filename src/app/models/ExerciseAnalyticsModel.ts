import mongoose, { Document, Model, Schema } from 'mongoose';

export interface exercise extends Document {
  name: string;
  topWeight: number;
  lastWeights: number[];
  date: Date
}

export interface exerciseModel extends Model<exercise> {}

export interface topExercises {
  exercises: mongoose.Schema.Types.ObjectId[];
}

export interface exerciseRanking {
  exercises: mongoose.Schema.Types.ObjectId[];
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
  lastWeights: {type: [Number], required: true},
  date: {type: Date, required: true}
});

const topExercisesSchema = new Schema<topExercises>({
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise' 
  }]
});

const exerciseRankingSchema = new Schema<exerciseRanking>({
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }]
});

const exerciseAnalyticsSchema = new Schema<exerciseAnalyticsDocument>({
  topExercises: topExercisesSchema,
  exerciseRanking: exerciseRankingSchema,
  createdAt: {type: Date, default: Date.now}
});

const ExerciseModel = mongoose.model<exercise, exerciseModel>('Exercise', exerciseSchema);
const ExerciseAnalyticsModel = mongoose.model<exerciseAnalyticsDocument, exerciseAnalyticsModel>('ExerciseAnalytics', exerciseAnalyticsSchema);

export default ExerciseAnalyticsModel;
export { ExerciseModel };
