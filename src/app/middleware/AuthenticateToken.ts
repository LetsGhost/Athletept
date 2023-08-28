import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

// Middleware to check JWT token from cookie
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // Assuming you set the token as 'token' cookie

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decodedToken = jwt.verify(token, 'your-secret-key');

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
