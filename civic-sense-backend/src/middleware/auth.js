// Mock JWT verification for foundation
// In production, use jsonwebtoken library to verify actual tokens

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        // Imitate decoding - normally verify(token, secret)
        // For development/foundation without frontend auth yet, we allow a bypass 
        // OR checks for a specific "mock" token

        // Mock User payload
        // You can change role here to test different permissions
        req.user = {
            id: 'mock_admin_id_123',
            email: 'admin@civic.com',
            role: req.headers['x-mock-role'] || 'ADMIN', // Allow simulation via header
            department: 'Health',
            cityAccess: ['New York', 'Los Angeles']
        };
        next();
    } else {
        // Allow mock role simulation even without Authorization header for easier testing
        const mockRole = req.headers['x-mock-role'];

        req.user = {
            id: mockRole ? 'mock_admin_id_123' : 'guest_id',
            role: mockRole || 'GUEST',
            email: mockRole ? 'admin@civic.com' : undefined
        };
        next();
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
