import User from './src/models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const createDemoAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = 'admin@civic.gov';
        const exists = await User.findOne({ email });
        if (exists) {
            console.log('Admin already exists');
            process.exit();
        }

        const adminUser = await User.create({
            name: 'Demo Admin',
            email: email,
            password_hash: 'password123', // Pre-save hook will hash this
            role: 'ADMIN'
        });

        console.log('Admin User Created:', adminUser.email);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createDemoAdmin();
