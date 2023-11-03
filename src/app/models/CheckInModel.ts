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
    currentGrowth: currentGrowth;
    problems: problems;
    regeneration: regeneration;
    change: change;
}

interface checkInDocument extends Document {
    createdAt: Date;
    checkInStatus: boolean
    checkIn: checkIn;
}

interface CheckInModel extends Model<checkInDocument> {}

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
    currentGrowth: currentGrowthSchema,
    problems: problemsSchema,
    regeneration: regenerationSchema,
    change: changeSchema,
})

const checkInDocumentSchema = new Schema<checkInDocument>({
    createdAt: {type: Date, default: Date.now},
    checkInStatus: {type: Boolean, default: false},
    checkIn: checkInSchema,
})

const CheckIn = mongoose.model<checkInDocument>('CheckIn', checkInDocumentSchema);

export {CheckIn}
