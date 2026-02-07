import User from '../models/User.js';
import AdminMeta from '../models/AdminMeta.js'; // Optional, for future use
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create User (password_hash sets implicitly via pre-save hook using 'password_hash' field if passed, 
        // but our schema expects 'password_hash' to be the field name for the hash.
        // Wait, the pre-save hook in NEW User model checks `this.password_hash`. 
        // So we must pass `password_hash: password` to trigger it.

        const user = await User.create({
            name,
            email,
            password_hash: password,
            role: role || 'USER'
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.isBanned) {
            return res.status(403).json({ message: 'Account is banned' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // TODO: Generate and return JWT token
        // For now, return user info.
        // If Admin, maybe fetch AdminMeta?
        let adminMeta = null;
        if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
            adminMeta = await AdminMeta.findOne({ userId: user._id });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            adminMeta, // helper for frontend
            token: "mock-jwt-token"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password_hash');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
