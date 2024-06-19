import { Request, Response } from 'express';
import authService from '../services/AuthService.js';
import logger from '../../config/winstonLogger.js';
import {getClientIp} from '../utils/ipUtils.js';
import dotenv from 'dotenv';
dotenv.config();

class AuthController {

    // TODO: maby use the TLD "athletept.de" to authenticate for multiple services
    async login(req: Request, res: Response) {
        try {
            const { email, password, alwaysLogedIn } = req.body;

            const { success, code, message, token, userId, role } = await authService.loginUser(email, password, alwaysLogedIn);

            if (alwaysLogedIn){

                if(process.env.ENV === "dev"){
                    res.cookie('token', token, { httpOnly: true, maxAge: 2592000000, sameSite: 'none', secure: false, path: "/"});
                }

                res.cookie('token', token, { httpOnly: true, maxAge: 2592000000, sameSite: 'none', secure: true, path: "/", domain: "backend.athletept.de"});

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
            }

            if(process.env.ENV === "production"){
                res.cookie('token', token, { httpOnly: true, maxAge: 18000000, sameSite: 'none', secure: false, path: "/"});
            }

            res.cookie('token', token, { 
                httpOnly: true, 
                maxAge: 18000000, 
                sameSite: 'none', 
                secure: true, 
                path: "/", 
                domain: "backend.athletept.de" 
            });

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
}

export default new AuthController();
