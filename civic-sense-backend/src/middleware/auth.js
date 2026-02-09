import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'civic_sense_secret_key_123';

export const verifyToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Legacy/Mock support
            if (process.env.NODE_ENV === 'development' && (token === 'mock-jwt-token' || token.startsWith('mock-'))) {
                req.user = {
                    id: 'mock_admin_id_123',
                    role: req.headers['x-mock-role'] || 'admin', // default to admin for mock
                    email: 'mock@civic.com'
                };
                return next();
            }

            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password_hash');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Auth error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (req.user.role !== role && req.user.role !== 'SUPERADMIN') {
            // Superadmin usually has access to everything, but stricly checking role:
            if (req.user.role !== role) {
                return res.status(403).json({ message: `Forbidden: Requires ${role} role` });
            }
        }

        next();
    };
};
