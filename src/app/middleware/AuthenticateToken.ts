import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import logger from '../../config/winstonLogger.js';
import getClientIp from '../utils/ipUtils.js';

class AuthenticateToken{
    authenticateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token;

            if (!token) {
                logger.warn('User tried to access user Endpoints without an Token: ' + " at " + req.path + " " + getClientIp(req), {service: 'AuthenticateRole.authenticateToken'});
                return res.status(401).json({success: false, message: 'Unauthorized' });
            }

            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as { userId: string, userRole: string };

            if(!decodedToken) {
                logger.warn('User tried to access user Endpoints with an invalid Token: ' + " at " + req.path + " " + getClientIp(req), {service: 'AuthenticateRole.authenticateToken'});
                return res.status(401).json({success: false, message: 'Unauthorized' });
            }

            next();
        } catch (error) {
            logger.error('Error authenticating token:', error, {service: 'AuthenticateToken.authenticateToken'});
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}

export default new AuthenticateToken();