import jwt from 'jsonwebtoken';
import UserModel, {User} from '../models/UserModel'; // Make sure to import the 'User' type as well
import {Document} from 'mongoose';

class AuthService {
    async loginUser(email: string, password: string) {
        try {
            const user: Document<User> | null = await UserModel.findOne({ email }).exec();

            if (!user) {
                throw new Error('Authentication failed');
            }

            const passwordMatch = await (user as User).comparePassword(password);

            if (!passwordMatch) {
                throw new Error('Authentication failed');
            }

            return jwt.sign({userId: user._id}, 'your-secret-key', {expiresIn: '1h'});
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();
