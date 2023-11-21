import mongoose from 'mongoose';
import logger from './winstonLogger';

const connectToDatabase = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            logger.error('MONGODB_URI environment variable is not set.');
            throw new Error('MONGODB_URI environment variable is not set.');
        }

        await mongoose.connect(mongoURI);
        logger.info('Connected to MongoDB.');
    } catch (err) {
        logger.error('Failed to connect to MongoDB.', err);
    }
};

export { connectToDatabase };