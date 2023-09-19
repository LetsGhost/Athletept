import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// Routes
import { connectToDatabase, } from "./config/db";
import userRoutes from "./app/routes/UserRoutes";
import adminRoutes from "./app/routes/AdminRoutes";
import authRoutes from "./app/routes/AuthRoute";

const server = express();

// Dkjsakdas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.use(bodyParser.json());
server.use(cookieParser());
server.use('/public', express.static(path.join(__dirname, 'public')));

connectToDatabase()

server.use('/user', userRoutes);
server.use('/admin', adminRoutes);
server.use('/auth', authRoutes);

server.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});