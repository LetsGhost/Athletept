import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

class AuthenticateToken{
    async authenticateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token; // Assuming you set the token as 'token' cookie

            if (!token) {
                return res.status(401).json({ message: 'Token not provided' });
            }
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as { userId: string, userRole: string };

            req.params.userId = decodedToken.userId;
            req.params.userRole = decodedToken.userRole;

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}

export default new AuthenticateToken();