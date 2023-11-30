import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import logger from '../../config/winstonLogger';

class AuthenticateToken{
    async authenticateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token; // Assuming you set the token as 'token' cookie

            if (!token) {
                return res.status(401).json({success: false, message: 'Unauthorized' });
            }

            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as { userId: string, userRole: string };

            req.params.userId = decodedToken.userId;
            req.params.userRole = decodedToken.userRole;

            next();
        } catch (error) {
            logger.error('Error authenticating token:', error, {service: 'AuthenticateToken.authenticateToken'});
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}

export default new AuthenticateToken();