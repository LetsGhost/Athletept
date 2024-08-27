import mongoose, { Schema } from 'mongoose';
const trainingdurationSchema = new Schema({
    coachingStartDate: { type: Date, required: true, default: Date.now },
    coachingDurationMonths: [String],
    coachingDuration: [String]
});
const trainingDurationPlanSchema = new Schema({
    trainingduration: trainingdurationSchema,
    createdAt: { type: Date, required: true, default: Date.now },
});
const TrainingDurationModel = mongoose.model('Trainingduration', trainingDurationPlanSchema);
export default TrainingDurationModel;
