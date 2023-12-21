import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

// Routes
import connectToDatabase from './config/db.js';
import { connectToRedis } from './config/redis.js';

import { logResourceUsage, logRequestMethod } from './app/middleware/Performance.js';

import userRoutes from "./app/routes/UserRoutes.js";
import adminRoutes from "./app/routes/AdminRoutes.js";
import authRoutes from "./app/routes/AuthRoute.js";

import limiter from './app/middleware/Limiter.js';
import logger from './config/winstonLogger.js';

const server = express();

// Activate for production
if(process.env.ENV === "production"){
    server.use(limiter);
}

server.use(cors({
  origin: ['https://admin.athletept.de', 'https://athletept.de'], // replace with your allowed origins
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', "Set-Cookie"],
}));
server.options('*', cors(
  {
    origin: ['https://admin.athletept.de', 'https://athletept.de'], // add your localhost to allowed origins
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', "Set-Cookie"],
  }
));

server.use(bodyParser.json());
server.use(cookieParser());
server.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Define your CSP policy here
    },
  },
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
server.use(logRequestMethod);

server.use('/user', userRoutes);
server.use('/admin', adminRoutes);
server.use('/auth', authRoutes);

server.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`, { service: 'Server'});
});