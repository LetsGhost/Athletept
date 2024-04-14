import mongoose, { Document, Model, Schema } from 'mongoose';

export interface currentGrowth {
    answer: string;
    answer2: string;
}

export interface problems{
    answer: string;
    boolean: boolean;
}

export interface regeneration{
    answer: string;
}

export interface change{
    answer: string;
    boolean: boolean;
}

export interface checkIn {
    currentGrowth: currentGrowth;
    problems: problems;
    regeneration: regeneration;
    change: change;
}

export interface checkInDocument extends Document {
    createdAt: Date;
    checkInStatus: boolean
    checkIn: checkIn;
}

export interface CheckInModel extends Model<checkInDocument> {}

const currentGrowthSchema = new Schema<currentGrowth>({
    answer: {type: String, default: 'Nichts'},
    answer2: {type: String, default: 'Nichts'},
});

const problemsSchema = new Schema<problems>({
    answer: {type: String, default: 'Nichts'},
    boolean: {type: Boolean, default: false},

})

const regenerationSchema = new Schema<regeneration>({
    answer: {type: String, default: 'Nichts'},
})

const changeSchema = new Schema<change>({
    answer: {type: String, default: 'Nichts'},
    boolean: {type: Boolean, default: false},
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

const CheckInModel = mongoose.model<checkInDocument>('CheckIn', checkInDocumentSchema);

export default CheckInModel;
