import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Issue from '../models/Issue.js';

dotenv.config();

const verifyIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);

        const indexes = await Issue.listIndexes();
        console.log('Current Issue Indexes:', indexes);

        const hasGeo = indexes.some(idx => idx.key.location === '2dsphere');
        // Check camelCase fields
        const hasStatus = indexes.some(idx => idx.key.status === 1);
        const hasCity = indexes.some(idx => idx.key.cityId === 1 && idx.key.status === 1);

        if (!hasGeo) console.error("❌ Missing 2dsphere index on location!");
        if (!hasStatus) console.error("❌ Missing status index!");
        if (!hasCity) console.error("❌ Missing cityId+status index!");

        if (hasGeo && hasStatus && hasCity) {
            console.log("✅ All critical indexes verified.");
        } else {
            console.log("⚠️ Some indexes missing, running sync...");
            await Issue.syncIndexes();
            console.log("✅ Sync complete.");
        }

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

verifyIndexes();
