import User from './src/models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Hacky script to create first superadmin
// Run manually: node create_superadmin.js

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const exists = await User.findOne({ email: 'super@civic.com' });
        if (exists) {
            console.log('Super Admin already exists');
            process.exit();
        }

        const superAdmin = await User.create({
            name: 'Super Administrator',
            email: 'super@civic.com',
            password_hash: 'super123', // Pre-save hook will hash this
            role: 'SUPERADMIN'
        });

        console.log('Super Admin Created:', superAdmin.email);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createSuperAdmin();
