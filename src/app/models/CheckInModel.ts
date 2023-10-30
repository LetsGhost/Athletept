import mongoose, { Document, Model, Schema } from 'mongoose';

interface currentGrowth {
    answer: string;
    boolean: boolean;
}

interface problems{
    answer: string;
    boolean: boolean;
}

interface regeneration{
    answer: boolean;
}

interface change{
    answer: string;
    boolean: boolean;
}

interface checkIn {
    createdAt: Date;
    currentGrowth: currentGrowth;
    problems: problems;
    regeneration: regeneration;
    change: change;
}

interface CheckInDocument extends Document {
    checkIn: checkIn;
}

interface CheckInModel extends Model<CheckInDocument> {}

const currentGrowthSchema = new Schema<currentGrowth>({
    answer: String,
    boolean: Boolean,
});

const problemsSchema = new Schema<problems>({
    answer: String,
    boolean: Boolean,

})

const regenerationSchema = new Schema<regeneration>({
    answer: Boolean,
})

const changeSchema = new Schema<change>({
    answer: String,
    boolean: Boolean,
})

const checkInSchema = new Schema<checkIn>({
    createdAt: {type: Date, default: Date.now},
    currentGrowth: currentGrowthSchema,
    problems: problemsSchema,
    regeneration: regenerationSchema,
    change: changeSchema,
})

const checkInDocumentSchema = new Schema<checkIn>({
    checkIn: checkInSchema,
})
const CheckIn = mongoose.model<CheckInDocument, CheckInModel>('CheckIn', checkInDocumentSchema);

export {CheckIn}
