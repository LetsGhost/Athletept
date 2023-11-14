import mongoose, { Document, Model, Schema } from 'mongoose';

interface Trainingduration {
    coachingStartDate: string,
    coachingDurationMonths: [],
    coachingDuration: []
}

interface TrainingdurationDocument extends Document {
    trainingduration: Trainingduration;
    createdAt: Date;
}

interface TrainingDurationPlanModel extends Model<TrainingdurationDocument> {}

const trainingdurationSchema = new Schema<Trainingduration>({
    coachingStartDate: String,
    coachingDurationMonths: [],
    coachingDuration: []
})

const trainingDurationPlanSchema = new Schema<TrainingdurationDocument>({
    trainingduration: trainingdurationSchema,
    createdAt: { type: Date, required: true, default: Date.now },
})

const TrainingDuration: TrainingDurationPlanModel = mongoose.model<TrainingdurationDocument, TrainingDurationPlanModel>('Trainingduration', trainingDurationPlanSchema);

export {TrainingDuration};


