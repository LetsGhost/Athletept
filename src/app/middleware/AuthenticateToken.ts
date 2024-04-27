import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import logger from '../../config/winstonLogger.js';
import getClientIp from '../utils/ipUtils.js';

import AuthService from '../services/AuthService.js';

class AuthenticateToken{
    async authenticateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token;

            if (!token) {
                logger.warn('User tried to access user Endpoints without an Token: ' + " at " + req.path + " " + getClientIp(req), {service: 'AuthenticateToken.authenticateToken'});
                return res.status(401).json({success: false, message: 'Unauthorized' });
            }

            await AuthService.authToken(token, req.params.userId, req.path).then(({success, code, message}) => {
                if(!success){
                    return res.status(code).json({success: false, message: message});
                }
            });

            if(req.path.startsWith("/admin")){
                await AuthService.authRole(token, req.path).then(({success, code, message}) => {
                    if(!success){
                        return res.status(code).json({success: false, message: message});
                    }
                });
            }

            next();
        } catch (error) {
            logger.error('Error authenticating token:', error, {service: 'AuthenticateToken.authenticateToken'});
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}

export default new AuthenticateToken();