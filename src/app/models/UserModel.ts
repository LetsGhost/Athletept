import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

interface User extends Document {
    uuid: string;
    email: string;
    password: string;
}

const userSchema = new Schema<User>({
    uuid: { type: String, default: uuidv4, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
