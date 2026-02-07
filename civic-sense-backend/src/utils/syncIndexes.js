import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Issue from '../models/Issue.js';

dotenv.config();

const syncIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);

        console.log('Syncing Issue indexes...');
        await Issue.syncIndexes();
        console.log('Issue Indexes synced successfully');

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

syncIndexes();
