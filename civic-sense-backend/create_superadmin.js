import Admin from './src/models/Admin.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Hacky script to create first superadmin since routes are protected
// Run manually: node create_superadmin.js

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('super123', salt);

        const superAdmin = await Admin.create({
            email: 'super@civic.com',
            password: hashedPassword,
            role: 'SUPERADMIN',
            department: 'HEADQUARTERS',
            cityAccess: ['ALL']
        });

        console.log('Super Admin Created:', superAdmin.email);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createSuperAdmin();
