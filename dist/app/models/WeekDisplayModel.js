import mongoose, { Schema } from 'mongoose';
const trainingsWeekDisplaySchema = new Schema({
    trainingDone: [Number],
    trainingsWeek: [String],
    createdAt: { type: Date, default: Date.now },
    lastUpdate: { type: Date, default: Date.now }
});
const WeekDisplayModel = mongoose.model('WeekDisplay', trainingsWeekDisplaySchema);
export default WeekDisplayModel;
