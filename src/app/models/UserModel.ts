import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface User extends Document {
    email: string;
    password: string;
    role: 'admin' | 'user';
    userInfo: {}
    exercisePlan: mongoose.Schema.Types.ObjectId;
    protocolExercisePlan: mongoose.Schema.Types.ObjectId;
    warmup: mongoose.Schema.Types.ObjectId;
    messages: mongoose.Schema.Types.ObjectId[];
    checkIn: mongoose.Schema.Types.ObjectId;
    weekDisplay: mongoose.Schema.Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    userInfo: {},
    exercisePlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExercisePlan'
    },
    protocolExercisePlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProtocolExercisePlan'
    },
    warmup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warmup'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    checkIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CheckIn'
    },
    weekDisplay: {}
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
