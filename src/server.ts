import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';;
dotenv.config();

// Routes
import { connectToDatabase, } from "./config/db";
import userRoutes from "./app/routes/UserRoutes";
import adminRoutes from "./app/routes/AdminRoutes";
import authRoutes from "./app/routes/AuthRoute";

const server = express();

server.use(bodyParser.json());
server.use(cookieParser());

connectToDatabase()

server.use('/user', userRoutes);
server.use('/admin', adminRoutes);
server.use('/auth', authRoutes);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});