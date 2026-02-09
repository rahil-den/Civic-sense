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

        user.warningCount = (user.warningCount || 0) + 1;

        // Auto-ban logic
        // If warning count hits 3, ban the user automatically
        if (user.warningCount >= 3) {
            user.isBanned = true;
        }

        await user.save();

        // Create warning record
        // Assuming Warning model exists and is imported correctly
        if (Warning) {
            await Warning.create({
                userId,
                issueId: issueId || null,
                reason,
                issuedBy: req.user.id || req.user._id
            });
        }

        res.json({
            message: 'User warned successfully',
            warningCount: user.warningCount,
            isBanned: user.isBanned
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manual Ban/Unban User
export const toggleBanUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is trying to ban a superadmin (safety check)
        if (user.role === 'SUPERADMIN') {
            return res.status(403).json({ message: 'Cannot ban a Super Admin' });
        }

        user.isBanned = !user.isBanned;
        await user.save();

        res.json({
            message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
            isBanned: user.isBanned
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
