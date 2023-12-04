import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import logger from "../../config/winstonLogger.js";
import getClientIp from "../utils/ipUtils.js";

interface CustomJwtPayload extends JwtPayload{
    userId: string;
    userRole: string;
}

class AuthenticateRole {
    authenticateRole(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({success: false, message: 'Unauthorized' });
            }

            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as CustomJwtPayload;

            if(decodedToken.userRole !== 'admin') {
                logger.warn('User tried to acces admin Endpoints: ' + getClientIp(req) + " at " + req.path, {service: 'AuthenticateRole.authenticateRole'});
                return res.status(401).json({success: false, message: 'Unauthorized' });
            }

            next();
        } catch (error) {
            logger.error('Error authenticating role:', error, {service: 'AuthenticateRole.authenticateRole'});
            return res.status(401).json({success: false, message: 'Unauthorized' });
        }
    }
}

export default new AuthenticateRole();