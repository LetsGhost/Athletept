import jwt from 'jsonwebtoken';
import UserModel, {User} from '../models/UserModel';
import {Document} from 'mongoose';
import * as process from "process";

class AuthService {
    async loginUser(email: string, password: string, alwaysLogedIn: boolean) {
        try {
            const user: Document<User> | null = await UserModel.findOne({ email }).exec();
            const userRole = user as User;

            if (!user) {
                console.log('User not found');
                throw new Error('User not found');
            }

            const passwordMatch = await (user as User).comparePassword(password);

            if (!passwordMatch) {
                console.log('Password does not match');
                throw new Error('Password does not match');
            }

            // If the user set alwaysLogedIn to true, the token will be valid for 30 days
            if(alwaysLogedIn){
                const token = jwt.sign({userId: user._id, userRole: userRole.role}, process.env.TOKEN_SECRET!, {expiresIn: '30d'});
                const userId = user._id;

                return {
                    token,
                    userId
                }
            }

            const token = jwt.sign({userId: user._id, userRole: userRole.role}, process.env.TOKEN_SECRET!, {expiresIn: '3h'});
            const userId = user._id;

            return {
                token,
                userId
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async getUserFromToken(token: string) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {userId: string, userRole: string};
            const user = await UserModel.findById(decodedToken.userId).exec();
            return user?._id;
        } catch (error) {
            console.error('Get user from token error:', error);
            throw error;
        }
    }
}

export default new AuthService();
