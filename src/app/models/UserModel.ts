import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface User extends Document {
    createdAt: Date;
    email: string;
    password: string;
    role: 'admin' | 'user';
    userInfo: {
        name: string;
        goal: string;
        focus: string;
        targetWeight: number;
        currentWeight: number;
        DOB: Date;
        gender: string;
        sports: string;
        location: string;
        conditions: string;
        times: string;
        frequency: string;
        cardio: string;
        issues: string;
    }
    exercisePlan: mongoose.Schema.Types.ObjectId;
    oldProtocol: Array<String>;
    protocolExercisePlan: mongoose.Schema.Types.ObjectId;
    messages: mongoose.Schema.Types.ObjectId[];
    oldCheckIn: Array<String>;
    checkIn: mongoose.Schema.Types.ObjectId;
    weekDisplay: mongoose.Schema.Types.ObjectId;
    trainingduration: mongoose.Schema.Types.ObjectId;
    weightAnalytics: mongoose.Schema.Types.ObjectId;
    exerciseAnalytics: mongoose.Schema.Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<User>({
    createdAt: { type: Date, required: true, default: Date.now },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    userInfo: {
        name: { type: String, required: true },
        goal: { type: String, required: true },
        focus: { type: String, required: true },
        targetWeight: { type: Number, required: true },
        currentWeight: { type: Number, required: true },
        DOB: { type: Date, required: true },
        gender: { type: String, required: true },
        sports: { type: String, required: true },
        location: { type: String, required: true },
        conditions: { type: String, required: true },
        times: { type: String, required: true },
        frequency: { type: String, required: true },
        cardio: { type: String, required: true },
        issues: { type: String, required: true }
    },
    exercisePlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExercisePlan'
    },
    oldProtocol: [String],
    protocolExercisePlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProtocolExercisePlan'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    oldCheckIn: [String],
    checkIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CheckIn'
    },
    weekDisplay: {},
    trainingduration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainingduration'
    },
    weightAnalytics: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeightAnalytics'
    },
    exerciseAnalytics: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExerciseAnalytics'
    }
});

// Hash the password before saving
userSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) return next();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model<User>('User', userSchema);

export default UserModel;
