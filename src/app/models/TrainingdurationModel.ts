import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Trainingduration {
    coachingStartDate: Date,
    coachingDurationMonths: string[],
    coachingDuration: string[]
}

export interface TrainingdurationDocument extends Document {
    trainingduration: Trainingduration;
    createdAt: Date;
}

export interface TrainingDurationPlanModel extends Model<TrainingdurationDocument> {}

const trainingdurationSchema = new Schema<Trainingduration>({
    coachingStartDate: { type: Date, required: true, default: Date.now },
    coachingDurationMonths: [String],
    coachingDuration: [String]
})

const trainingDurationPlanSchema = new Schema<TrainingdurationDocument>({
    trainingduration: trainingdurationSchema,
    createdAt: { type: Date, required: true, default: Date.now },
})

const TrainingDurationModel: TrainingDurationPlanModel = mongoose.model<TrainingdurationDocument, TrainingDurationPlanModel>('Trainingduration', trainingDurationPlanSchema);

export default TrainingDurationModel;


