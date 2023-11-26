import { Request, Response } from 'express';
import authService from '../services/AuthService';
import timeUtils from '../utils/timeUtils';

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password, alwaysLogedIn } = req.body;

            const { success, code, message, token, userId } = await authService.loginUser(email, password, alwaysLogedIn);
            // If the user set alwaysLogedIn to true, the token will be valid for 30 days
            if (alwaysLogedIn){
                res.cookie('token', token, { httpOnly: true, maxAge: 2592000000, sameSite: 'none', secure: true });
                return res.status(code).json({ success, message, userId: userId });
            }

            res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'none', secure: true });
            return res.status(code).json({ success, message, userId: userId });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getUserFromToken(req: Request, res: Response) {
        try {
            const token = req.cookies.token;

            const { success, code, message, userId } = await authService.getUserFromToken(token);

            return res.status(code).json({ success, message, userId: userId });
        } catch (error) {
            console.error('Get user from token error:', error);
            return res.status(500).json({success: false, message: 'Internal Server error' });
        }
    }
}

export default new AuthController();
