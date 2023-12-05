import mongoose, { Document, Model, Schema } from 'mongoose';

interface currentGrowth {
    answer: string;
    answer2: string;
}

interface problems{
    answer: string;
    boolean: boolean;
}

interface regeneration{
    answer: string;
}

interface change{
    answer: string;
    boolean: boolean;
}

interface weight {
    weight: number;
}

interface checkIn {
    currentGrowth: currentGrowth;
    problems: problems;
    regeneration: regeneration;
    change: change;
    weight: weight;
}

interface checkInDocument extends Document {
    createdAt: Date;
    checkInStatus: boolean
    checkIn: checkIn;
}

interface CheckInModel extends Model<checkInDocument> {}

const currentGrowthSchema = new Schema<currentGrowth>({
    answer: String,
    answer2: String,
});

const problemsSchema = new Schema<problems>({
    answer: String,
    boolean: Boolean,

})

const regenerationSchema = new Schema<regeneration>({
    answer: String,
})

const changeSchema = new Schema<change>({
    answer: String,
    boolean: Boolean,
})

const weightSchema = new Schema<weight>({
    weight: Number,
})

const checkInSchema = new Schema<checkIn>({
    currentGrowth: currentGrowthSchema,
    problems: problemsSchema,
    regeneration: regenerationSchema,
    change: changeSchema,
    weight: weightSchema,
})

const checkInDocumentSchema = new Schema<checkInDocument>({
    createdAt: {type: Date, default: Date.now},
    checkInStatus: {type: Boolean, default: false},
    checkIn: checkInSchema,
})

const CheckIn = mongoose.model<checkInDocument>('CheckIn', checkInDocumentSchema);

export {CheckIn}
