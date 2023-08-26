import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('MONGODB_URI environment variable is not set.');
            throw new Error('MONGODB_URI environment variable is not set.');
        }

        await mongoose.connect(mongoURI);
        console.log('Connected to the database');
    } catch (err) {
        console.error(err);
    }
};

const getDatabase = () => {
    const dbName = process.env.DB_Name;
    if (!dbName) {
        throw new Error('DB_Name environment variable is not set.');
    }

    return mongoose.connection.collection(dbName);
};

export { connectToDatabase, getDatabase };