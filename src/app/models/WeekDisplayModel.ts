import mongoose, { Document, Model, Schema } from 'mongoose';

interface TrainingWeekDisplayModel extends Document {
    trainingDone: number[];
    trainingsWeek: string[];
    createdAt: Date;
    lastUpdate: Date;
}

const trainingsWeekDisplaySchema = new Schema<TrainingWeekDisplayModel>({
    trainingDone: [Number],
    trainingsWeek: [String],
    createdAt: {type: Date, default: Date.now},
    lastUpdate: {type: Date, default: Date.now}
});

const WeekDisplayModel: Model<TrainingWeekDisplayModel> = mongoose.model<TrainingWeekDisplayModel>('WeekDisplay', trainingsWeekDisplaySchema);

export default WeekDisplayModel