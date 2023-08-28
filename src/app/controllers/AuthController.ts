import { Request, Response } from 'express';
import authService from '../services/AuthService';

const authController = {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const token = await authService.loginUser(email, password);

            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

            return res.json({ message: 'Authentication successful' });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ message: 'Authentication failed' });
        }
    },
};

export default authController;
