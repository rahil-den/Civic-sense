import User from '../models/User.js';
import Warning from '../models/Warning.js';

// Get Users (Admin view)
export const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};

        if (role) query.role = role;

        const users = await User.find(query).select('-password_hash');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Warn User
export const warnUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason, issueId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.warningCount += 1;

        // Auto-ban logic
        if (user.warningCount >= 3) {
            user.isBanned = true;
        }

        await user.save();

        await Warning.create({
            userId,
            issueId: issueId || null,
            reason,
            issuedBy: req.user.id || req.user._id
        });

        res.json({
            message: 'User warned successfully',
            warningCount: user.warningCount,
            isBanned: user.isBanned
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
