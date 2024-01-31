import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import cron from 'node-cron';

dotenv.config();

// DB´s connections
import connectToDatabase from './config/db.js';

// Schedules
import dbSchedule from './app/utils/dbSchedule.js';

// Routes
import userRoutes from "./app/routes/UserRoutes.js";
import adminRoutes from "./app/routes/AdminRoutes.js";
import authRoutes from "./app/routes/AuthRoute.js";

// Logger
import logger from './config/winstonLogger.js';

const server = express();

// Enable trust proxy
server.set('trust proxy', 1);

// Cors configuration
if(process.env.ENV === "production") {
  server.use(cors({
    origin: [String(process.env.ADDRESS1), String(process.env.ADDRESS2)],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', "Set-Cookie"],
  }));
  server.options('*', cors(
    {
      origin: [String(process.env.ADDRESS1), String(process.env.ADDRESS2)],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', "Set-Cookie"],
    }
  ));
} else {
  server.use(cors({
    origin: [String(process.env.DEV_ADDRESS)],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', "Set-Cookie"],
  }));
  server.options('*', cors(
    {
      origin: [String(process.env.DEV_ADDRESS)],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', "Set-Cookie"],
    }
  ));
}

server.use(bodyParser.json());
server.use(cookieParser());
server.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
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

cron.schedule('0 0 * * 1', dbSchedule); // Run every Monday at 00:00

server.use('/user', userRoutes);
server.use('/admin', adminRoutes);
server.use('/auth', authRoutes);

server.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${process.env.PORT}`, { service: 'Server' });
});