import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

// Routes
import { connectToDatabase, } from "./config/db";
import userRoutes from "./app/routes/UserRoutes";
import adminRoutes from "./app/routes/AdminRoutes";
import authRoutes from "./app/routes/AuthRoute";

import limiter from './app/middleware/Limiter';
import logger from './config/winstonLogger';

const server = express();

// Activate for production
//server.use(limiter);

server.use(bodyParser.json());
server.use(cookieParser());
server.use(cors());

connectToDatabase()

server.use('/user', userRoutes);
server.use('/admin', adminRoutes);
server.use('/auth', authRoutes);

server.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`, { service: 'Server'});
});