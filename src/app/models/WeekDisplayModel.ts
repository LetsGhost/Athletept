import mongoose, { Document, Model, Schema } from 'mongoose';

interface TrainingWeekDisplayModel extends Document {
    trainingDone: number[];
    trainingsWeek: string[];
}

const trainingsWeekDisplaySchema = new Schema<TrainingWeekDisplayModel>({
    trainingDone: [Number],
    trainingsWeek: [String]
});

const WeekDisplay: Model<TrainingWeekDisplayModel> = mongoose.model<TrainingWeekDisplayModel>('WeekDisplay', trainingsWeekDisplaySchema);

export default WeekDisplay;