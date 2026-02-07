import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from './src/models/Report.js'; // Adjust path as needed
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const checkIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const indexes = await Report.listIndexes();
        console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error checking indexes:', error);
    }
};

checkIndexes();
