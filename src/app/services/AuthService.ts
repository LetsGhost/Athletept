import jwt from 'jsonwebtoken';
import UserModel, {User} from '../models/UserModel.js';
import {Document} from 'mongoose';
import * as process from "process";
import logger from '../../config/winstonLogger.js';


class AuthService {
    async loginUser(email: string, password: string, alwaysLogedIn: boolean) {
        try {
            const user: Document<User> | null = await UserModel.findOne({ email }).exec();
            const userRole = user as User;

            if (!user) {
                return {
                    success: false,
                    code: 404,
                    message: 'Authentication failed'
                }
            }

            const passwordMatch = await (user as User).comparePassword(password);

            if (!passwordMatch) {
                return {
                    success: false,
                    code: 401,
                    message: 'Authentication failed'
                }
            }

            // If the user set alwaysLogedIn to true, the token will be valid for 30 days
            if(alwaysLogedIn){
                const token = jwt.sign({userId: user._id, userRole: userRole.role}, process.env.TOKEN_SECRET!, {expiresIn: '30d'});
                const userId = user._id;

                return {
                    success: true,
                    code: 200,
                    token,
                    userId,
                    role: userRole.role
                }
            }

            const token = jwt.sign({userId: user._id, userRole: userRole.role}, process.env.TOKEN_SECRET!, {expiresIn: '3h'});
            const userId = user._id;

            return {
                success: true,
                code: 200,
                token,
                userId,
                role: userRole.role
            }
        } catch (error) {
            logger.error('Internal server error', {service: 'AuthService.loginUser'});
            return {
                success: false,
                code: 500,
                message: "Internal server error"
            }
        }
    }

    async getUserFromToken(token: string) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {userId: string, userRole: string};
            const user = await UserModel.findById(decodedToken.userId).exec();

            if(!token){
                logger.error('No token found', {service: 'AuthService.getUserFromToken'});
                return {
                    success: false,
                    code: 404,
                    message: "No token found"
                }
            }

            return {
                success: true,
                code: 200,
                userId: user?._id
            };
        } catch (error) {
            logger.error(`Internal server error: ${error}`, {service: 'AuthService.getUserFromToken'});
            return {
                success: false,
                code: 500,
                message: 'Internal server error'
            }
        }
    }
}

export default new AuthService();
