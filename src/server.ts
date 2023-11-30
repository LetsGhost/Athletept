import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
dotenv.config();

// Routes
import connectToDatabase from './config/db';
import { connectToRedis } from './config/redis';

import { logResourceUsage } from './app/middleware/Performance';

import userRoutes from "./app/routes/UserRoutes";
import adminRoutes from "./app/routes/AdminRoutes";
import authRoutes from "./app/routes/AuthRoute";

import limiter from './app/middleware/Limiter';
import logger from './config/winstonLogger';

const server = express();

// Activate for production
if(process.env.ENV === "production"){
    server.use(limiter);
}


server.use(bodyParser.json());
server.use(cookieParser());
server.use(cors());
server.use(helmet({
    contentSecurityPolicy: false, // set to false if you have issues with your app
    dnsPrefetchControl: false, // controls browser DNS prefetching
    frameguard: { action: 'deny' }, // prevent clickjacking
    hidePoweredBy: true, // hide X-Powered-By header
    hsts: { maxAge: 60 }, // HTTP Strict Transport Security
    ieNoOpen: true, // X-Download-Options for IE8+
    noSniff: true, // X-Content-Type-Options
    permittedCrossDomainPolicies: true, // restrict Adobe Flash and Acrobat
    referrerPolicy: { policy: 'same-origin' }, // Referrer-Policy header
    xssFilter: true, // X-XSS-Protection
}));

connectToDatabase()
connectToRedis();

setInterval(logResourceUsage, 60 * 60 * 1000);
logResourceUsage();

server.use('/user', userRoutes);
server.use('/admin', adminRoutes);
server.use('/auth', authRoutes);

server.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`, { service: 'Server'});
});