import mongoose, { Schema, model, Document, Types, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

// Models for deletion
import CheckInModel from './CheckInModel';
import ExerciseAnalyticsModel from './ExerciseAnalyticsModel';
import WeightAnalyticsModel from './WeightAnalyticsModel';
import MessageModel from './MessagModel';
import WeekDisplayModel from './WeekDisplayModel';
import TrainingDurationModel from './TrainingdurationModel';
import ExercisePlanModel from './ExercisePlanModel';
import ProtocolExercisePlanModel from './ProtocolModel';

export interface User extends Document {
    _id: any;
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

// Delete all related documents when a user is deleted
userSchema.pre('findOneAndDelete', async function (next) {
    const user = this.getQuery() as unknown as User;

    try {
        // Delete referenced objects
        if (user.checkIn && user.oldCheckIn) {
            await CheckInModel.findByIdAndDelete(user.checkIn);

            for (const checkInId of user.oldCheckIn) {
                await CheckInModel.findByIdAndDelete(checkInId);
            }
        }
        if (user.exerciseAnalytics) {
            await ExerciseAnalyticsModel.findByIdAndDelete(user.exerciseAnalytics);
        }
        if (user.weightAnalytics) {
            await WeightAnalyticsModel.findByIdAndDelete(user.weightAnalytics);
        }
        if (user.messages && user.messages.length > 0) {
            await MessageModel.deleteMany({ _id: { $in: user.messages } });
        }
        if(user.weekDisplay){
            await WeekDisplayModel.findByIdAndDelete(user.weekDisplay);
        }
        if(user.trainingduration){
            await TrainingDurationModel.findByIdAndDelete(user.trainingduration);
        }
        if(user.exercisePlan){
            await ExercisePlanModel.findByIdAndDelete(user.exercisePlan);
        }
        if(user.protocolExercisePlan && user.oldProtocol){
            await ProtocolExercisePlanModel.findByIdAndDelete(user.protocolExercisePlan);

            for (const protocolId of user.oldProtocol) {
                await ProtocolExercisePlanModel.findByIdAndDelete(protocolId);
            }
        }

        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

const UserModel = model<User>('User', userSchema);

export default UserModel;
