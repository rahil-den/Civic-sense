const ROLE_RANKS = {
    'USER': 1,
    'ADMIN': 2,
    'SUPERADMIN': 3
};

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // In production, verify actual JWT here.
    // For now, continuing with mock logic but ensuring alignment with requirements.

    if (authHeader || req.headers['x-mock-role']) {
        const role = req.headers['x-mock-role'] || 'ADMIN';
        req.user = {
            id: '507f1f77bcf86cd799439011', // Valid Mock ObjectId
            _id: '507f1f77bcf86cd799439011',
            email: 'admin@civic.com',
            role: role,
            rank: ROLE_RANKS[role] || 0
        };
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export const requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const requiredRank = ROLE_RANKS[requiredRole] || 99;
        const userRank = req.user.rank || ROLE_RANKS[req.user.role] || 0;

        if (userRank < requiredRank) {
            return res.status(403).json({ message: `Forbidden: Requires ${requiredRole} or higher` });
        }

        next();
    };
};
