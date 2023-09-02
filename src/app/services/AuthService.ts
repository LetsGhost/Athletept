import jwt from 'jsonwebtoken';
import UserModel, {User} from '../models/UserModel';
import {Document} from 'mongoose';
import * as process from "process";

class AuthService {
    async loginUser(email: string, password: string) {
        try {
            const user: Document<User> | null = await UserModel.findOne({ email }).exec();
            const userRole = user as User;

            if (!user) {
                console.log('User not found');
                throw new Error('Authentication failed');
            }

            const passwordMatch = await (user as User).comparePassword(password);

            if (!passwordMatch) {
                console.log('Password does not match');
                throw new Error('Authentication failed');
            }

            return jwt.sign({userId: user._id, userRole: userRole.role}, process.env.TOKEN_SECRET!, {expiresIn: '3h'});
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}

export default new AuthService();
