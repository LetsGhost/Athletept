import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
dotenv.config();

import { connectToDatabase, } from "./config/db";
import userRoutes from "./app/routes/UserRoutes";
import authRoutes from "./app/routes/AuthRoute";

const server = express();

server.use(bodyParser.json());
server.use(cookieParser());

connectToDatabase()

server.use('/user', userRoutes);
server.use('/auth', authRoutes);

server.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});