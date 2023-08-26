import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from "./app/routes/UserRoutes.ts";
dotenv.config();

import { connectToDatabase, } from "./config/db.ts";

const server = express();

server.use(bodyParser.json());

connectToDatabase()

server.use('/user', userRoutes);

server.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});