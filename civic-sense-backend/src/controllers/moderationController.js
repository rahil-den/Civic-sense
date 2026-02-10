import User from '../models/User.js';
import Warning from '../models/Warning.js';
import { logAction } from '../utils/auditLogger.js';
import Notification from '../models/Notification.js';

// Get Flagged Users
export const getFlaggedUsers = async (req, res) => {
    try {
        // Aggregate warnings by user
        const flaggedUsers = await Warning.aggregate([
            {
                $group: {
                    _id: "$userId",
                    warningCount: { $sum: 1 },
                    lastViolation: { $last: "$reason" },
                    lastWarningDate: { $last: "$createdAt" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $project: {
                    id: "$_id",
                    name: "$userInfo.name",
                    email: "$userInfo.email",
                    avatar: "$userInfo.avatar",
                    status: {
                        $cond: {
                            if: "$userInfo.isBanned",
                            then: "banned",
                            else: "active"
                        }
                    },
                    warningCount: 1,
                    lastViolation: 1,
                    lastWarningDate: 1
                }
            },
            { $sort: { lastWarningDate: -1 } }
        ]);

        res.json(flaggedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Issue Warning
export const issueWarning = async (req, res) => {
    try {
        const { userId, issueId, reason } = req.body;

        const warning = await Warning.create({
            userId,
            issueId,
            reason,
            issuedBy: req.user.id || req.user._id
        });

        // Notify User
        await Notification.create({
            userId,
            title: 'Warning Issued',
            message: `You have received a warning: ${reason}`,
            type: 'WARNING'
        });

        await logAction(req.user.id, 'ISSUE_WARNING', 'User', userId, { reason });

        res.status(201).json(warning);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ban User
export const banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isBanned = true;
        await user.save();

        await logAction(req.user.id, 'BAN_USER', 'User', id, { reason });

        res.json({ message: 'User banned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
