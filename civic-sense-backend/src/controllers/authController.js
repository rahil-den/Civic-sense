import User from '../models/User.js';
import AdminMeta from '../models/AdminMeta.js'; // Optional, for future use
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || 'civic_sense_secret_key_123';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

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
            role: user.role,
            token: generateToken(user._id),
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
            adminMeta,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'ID Token is required' });
        }

        let payload;

        // Mock verification for development if token starts with "mock-"
        if (idToken.startsWith('mock-')) {
            // Decoding mock token payload if valid JSON, else defaults
            try {
                const parts = idToken.split('.');
                payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            } catch (e) {
                payload = {
                    email: 'mockuser@example.com',
                    name: 'Mock User',
                    picture: 'https://placehold.co/100',
                    sub: 'mock_google_id_123'
                };
            }
        } else {
            // Real Google Verification
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        }

        const { email, name, picture, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (user) {
            // Start simple: If user exists, log them in. 
            // In a real app, you'd link the googleId to the user if not already linked.
            // For now, we update avatar if missing
            if (!user.avatar) {
                user.avatar = picture;
                await user.save();
            }
        } else {
            // Create user
            // Password is required by schema usually, so we set a random dummy password
            // or we'd modify schema to make password optional.
            // Using a dummy hash/random string here.
            user = await User.create({
                name,
                email,
                password_hash: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10),
                role: 'USER',
                avatar: picture,
                // googleId // Ideally add googleId to schema
            });
        }

        if (user.isBanned) {
            return res.status(403).json({ message: 'Account is banned' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(500).json({ message: 'Google Login Failed: ' + error.message });
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
