import { Request, Response } from 'express';
import authService from '../services/AuthService';

class AuthController {
    async login(req: Request, res: Response) {
        const { email, password, alwaysLogedIn } = req.body;

        try {
            const { token, userId } = await authService.loginUser(email, password, alwaysLogedIn);

            // If the user set alwaysLogedIn to true, the token will be valid for 30 days
            if (alwaysLogedIn){
                res.cookie('token', token, { httpOnly: true, maxAge: 2592000000 });
                return res.json({ message: 'Authentication successful', userid: userId });
            }

            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

            return res.json({ message: 'Authentication successful', userid: userId });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ message: 'Authentication failed' });
        }
    }

    async getUserFromToken(req: Request, res: Response) {
        const token = req.cookies.token;

        try {
            const user = await authService.getUserFromToken(token);

            return res.json({ userid: user });
        } catch (error) {
            console.error('Get user from token error:', error);
            res.status(401).json({ message: 'Authentication failed' });
        }
    }
}

export default new AuthController();
