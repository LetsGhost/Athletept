import mongoose, { Document, Model, Schema } from 'mongoose';

interface Trainingduration {
    coachingStartDate: string,
    coachingDurationMonths: [],
    coachingDuration: []
}

interface TrainingdurationDocument extends Document {
    trainingduration: Trainingduration;
}

interface TrainingDurationPlanModel extends Model<TrainingdurationDocument> {}

const trainingdurationSchema = new Schema<Trainingduration>({
    coachingStartDate: String,
    coachingDurationMonths: [],
    coachingDuration: []
})

const trainingDurationPlanSchema = new Schema<TrainingdurationDocument>({
    trainingduration: trainingdurationSchema
})

const TrainingDuration: TrainingDurationPlanModel = mongoose.model<TrainingdurationDocument, TrainingDurationPlanModel>('Trainingduration', trainingDurationPlanSchema);

export {TrainingDuration};


