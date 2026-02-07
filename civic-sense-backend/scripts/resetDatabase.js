import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import bcrypt from 'bcryptjs';

import State from '../src/models/State.js';
import City from '../src/models/City.js';
import Area from '../src/models/Area.js';
import User from '../src/models/User.js';
import Issue from '../src/models/Issue.js';
import IssueStatusHistory from '../src/models/IssueStatusHistory.js';
import IssueResolution from '../src/models/IssueResolution.js';
import CommunityFeed from '../src/models/CommunityFeed.js';
import UserWarning from '../src/models/UserWarning.js';
import BannedIP from '../src/models/BannedIP.js';
import ReportExport from '../src/models/ReportExport.js';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const resetDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);

        // Drop all collections
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.drop();
        }
        console.log('All collections dropped');

        // Sync Indexes (this creates collections as well)
        await State.syncIndexes();
        await City.syncIndexes();
        await Area.syncIndexes();
        await User.syncIndexes();
        await Issue.syncIndexes();
        await IssueStatusHistory.syncIndexes();
        await IssueResolution.syncIndexes();
        await CommunityFeed.syncIndexes();
        await UserWarning.syncIndexes();
        await BannedIP.syncIndexes();
        await ReportExport.syncIndexes();

        console.log('Collections created');
        console.log('Indexes created');

        // Seed Data
        // 1. Create State
        const gujarat = await State.create({
            name: 'Gujarat',
            is_active: true
        });

        // 2. Create City
        const ahmedabad = await City.create({
            state_id: gujarat._id,
            name: 'Ahmedabad',
            is_active: true
        });

        // 3. Create Area
        const satellite = await Area.create({
            city_id: ahmedabad._id,
            name: 'Satellite'
        });

        // 4. Create Superadmin
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password', salt);

        await User.create({
            email: 'superadmin@civic.com',
            password_hash: passwordHash,
            role: 'SUPERADMIN',
            name: 'Super Admin',
            is_active: true
        });

        console.log('Seed inserted');
        console.log('State: Gujarat');
        console.log('City: Ahmedabad');
        console.log('Area: Satellite');
        console.log('Superadmin: superadmin@civic.com');
        console.log('Password: password');

        process.exit(0);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

rl.question('THIS WILL DELETE ALL DATA. Continue? y/n ', (answer) => {
    if (answer.toLowerCase() === 'y') {
        resetDatabase();
    } else {
        console.log('Aborted.');
        process.exit(0);
    }
    rl.close();
});
