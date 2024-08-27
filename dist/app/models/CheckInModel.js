import mongoose, { Schema } from 'mongoose';
const currentGrowthSchema = new Schema({
    answer: { type: String, default: 'Nichts' },
    answer2: { type: String, default: 'Nichts' },
});
const problemsSchema = new Schema({
    answer: { type: String, default: 'Nichts' },
    boolean: { type: Boolean, default: false },
});
const regenerationSchema = new Schema({
    answer: { type: String, default: 'Nichts' },
});
const changeSchema = new Schema({
    answer: { type: String, default: 'Nichts' },
    boolean: { type: Boolean, default: false },
});
const checkInSchema = new Schema({
    currentGrowth: currentGrowthSchema,
    problems: problemsSchema,
    regeneration: regenerationSchema,
    change: changeSchema,
});
const checkInDocumentSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    checkInStatus: { type: Boolean, default: false },
    checkIn: checkInSchema,
});
const CheckInModel = mongoose.model('CheckIn', checkInDocumentSchema);
export default CheckInModel;
