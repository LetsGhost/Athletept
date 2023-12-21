import { Request, Response } from 'express';
import authService from '../services/AuthService.js';
import logger from '../../config/winstonLogger.js';
import {getClientIp} from '../utils/ipUtils.js';

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password, alwaysLogedIn } = req.body;

            const { success, code, message, token, userId, role } = await authService.loginUser(email, password, alwaysLogedIn);

            if (alwaysLogedIn){
                res.cookie('token', token, { httpOnly: true, maxAge: 2592000000, sameSite: 'lax', secure: true, path: "/"});
                return res.status(code).json({ success, message, userId: userId, role: role });
            }

            res.cookie('token', token, { httpOnly: true, maxAge: 3600000, sameSite: 'lax', secure: true, path: "/" });

            if(success){
                logger.info('User logged in: ' + getClientIp(req), {service: 'AuthController.login', userId: userId, role: role});
            }
            else{
                switch(code)
                {
                    case 404:
                        logger.warn('Invalid email: ' + getClientIp(req) , {service: 'AuthController.login'});
                        break;
                    case 401:
                        logger.warn('Invalid password: ' + getClientIp(req), {service: 'AuthController.login'});
                        break;

                }
            }

            return res.status(code).json({ success, message, userId: userId, role: role });
        } catch (error) {
            logger.error('Internal server error' + error, {service: 'AuthController.login'});
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getUserFromToken(req: Request, res: Response) {
        try {
            const token = req.cookies.token;

            const { success, code, message, userId } = await authService.getUserFromToken(token);

            if(success){
                logger.info('User retrieved from token: '+ userId, {service: 'AuthController.getUserFromToken'});
            }

            logger.info('User retrieved from token', {service: 'AuthController.getUserFromToken', userId: userId});

            return res.status(code).json({ success, message, userId: userId });
        } catch (error) {
            logger.error('Internal server error'+ error, {service: 'AuthController.getUserFromToken'});
            return res.status(500).json({success: false, message: 'Internal Server error' });
        }
    }
}

export default new AuthController();
