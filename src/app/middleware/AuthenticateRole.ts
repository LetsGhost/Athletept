import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import logger from "../../config/winstonLogger.js";
import getClientIp from "../utils/ipUtils.js";
import AuthService from "../services/AuthService.js";

interface CustomJwtPayload extends JwtPayload{
    userId: string;
    userRole: string;
}

class AuthenticateRole {
    async authenticateRole(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token;

            if (!token) {
                logger.warn('User tried to access admin Endpoints: ' + getClientIp(req) + " at " + req.path, {service: 'AuthenticateRole.authenticateRole'});
                return res.status(401).json({success: false, message: 'Unauthorized' });
            }

            await AuthService.authRole(token, req.path).then(({success, code, message}) => {
                if(!success){
                    logger.warn('User tried to access admin Endpoints with an invalid Role: ' + getClientIp(req) + " at " + req.path, {service: 'AuthenticateRole.authenticateRole'});
                    return res.status(code).json({success: false, message: message});
                }
            });

            next();
        } catch (error) {
            logger.error('Error authenticating role:', error, {service: 'AuthenticateRole.authenticateRole'});
            return res.status(401).json({success: false, message: 'Unauthorized' });
        }
    }
}

export default new AuthenticateRole();