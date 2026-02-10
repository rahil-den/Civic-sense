import Issue from '../models/Issue.js';
import IssueStatusHistory from '../models/IssueStatusHistory.js';
import IssueResolution from '../models/IssueResolution.js';
import CommunityFeed from '../models/CommunityFeed.js';
import Notification from '../models/Notification.js';
import { invalidateCache } from '../utils/cacheHandler.js';
import { logAction } from '../utils/auditLogger.js';
import City from '../models/City.js';
import IssueCategory from '../models/IssueCategory.js';

// Create Issue
export const createIssue = async (req, res) => {
    try {
        const { stateId, cityId, areaId, categoryId, title, description, images, location } = req.body;

        // Auto-derive stateId if missing but cityId present
        let finalStateId = stateId;
        if (!finalStateId && cityId) {
            const city = await City.findById(cityId);
            if (city) finalStateId = city.stateId;
        }

        const issue = await Issue.create({
            userId: req.user.id || req.user._id,
            stateId: finalStateId,
            cityId,
            areaId,
            categoryId,
            title,
            description,
            images, // Array of strings
            location
        });

        // Fetch category name for feed/logs
        const categoryDoc = await IssueCategory.findById(categoryId);
        const categoryName = categoryDoc ? categoryDoc.name : 'Unknown';

        // Add to Community Feed
        await CommunityFeed.create({
            issueId: issue._id,
            eventType: 'REPORTED',
            message: `New issue reported: ${title} (${categoryName})`
        });

        await logAction(req.user.id, 'CREATE_ISSUE', 'Issue', issue._id, { categoryId, cityId });

        // Invalidate Cache
        await invalidateCache(cityId, finalStateId);

        // Emit Socket Event
        const io = req.app.get('io');
        if (io) {
            io.emit('issueCreated', { issue });
            io.emit('analyticsUpdated', { cityId: cityId });
        }

        res.status(201).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Issues (filtered)
export const getIssues = async (req, res) => {
    try {
        const { cityId, status, categoryId, userId } = req.query;
        let query = {};

        if (cityId) query.cityId = cityId;
        if (status) query.status = status;
        if (categoryId) query.categoryId = categoryId;
        if (userId) query.userId = userId;
        if (req.query.mine === 'true') query.userId = req.user.id || req.user._id;

        const issues = await Issue.find(query)
            .populate('userId', 'name avatar')
            .populate('areaId', 'name')
            .populate('categoryId', 'name icon')
            .sort({ createdAt: -1 });

        res.json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Issue Details
export const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('userId', 'name avatar')
            .populate('stateId', 'name')
            .populate('cityId', 'name')
            .populate('areaId', 'name')
            .populate('categoryId', 'name icon')
            .populate('timeline.by', 'name avatar');

        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        const history = await IssueStatusHistory.find({ issueId: issue._id }).sort({ createdAt: 1 }).populate('changedBy', 'name');
        const resolution = await IssueResolution.findOne({ issueId: issue._id }).populate('resolvedBy', 'name');

        res.json({ issue, history, resolution });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Status (Admin)
export const updateStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const issue = await Issue.findById(req.params.id);

        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        const oldStatus = issue.status;
        issue.status = status;

        issue.timeline.push({
            action: 'STATUS_CHANGE',
            by: req.user.id || req.user._id,
            note: `Status updated to ${status}. Remarks: ${remarks || 'None'}`,
            timestamp: new Date()
        });

        await issue.save();

        try {
            // Safe helper for ID
            const actorId = req.user._id ? req.user._id : (req.user.id && req.user.id.length === 24 ? req.user.id : null);

            // Only create history/log if we have a valid ID or if we decide to allow invalid IDs (which we shouldn't for ObjectId fields)
            // If actorId is null (e.g. mock user with non-ObjectId), we might skip history changedBy or use a placeholder if the schema allowed string.
            // But Schema says ObjectId. So we must pass valid ObjectId or null.

            await IssueStatusHistory.create({
                issueId: issue._id,
                oldStatus: oldStatus,
                newStatus: status,
                changedBy: actorId, // Pass null if invalid/mock
                remarks
            });

            await CommunityFeed.create({
                issueId: issue._id,
                eventType: 'UPDATED',
                message: `Issue status updated to ${status}`
            });

            // Notify User
            await Notification.create({
                userId: issue.userId,
                title: 'Issue Update',
                message: `Your issue "${issue.title}" status has been updated to ${status}.`,
                type: 'STATUS'
            });

            // Safe log action
            if (actorId) {
                await logAction(actorId, 'UPDATE_STATUS', 'Issue', issue._id, { oldStatus, newStatus: status });
            }

            // Invalidate Cache
            await invalidateCache(issue.cityId, issue.stateId);

            // Emit Socket Event
            const io = req.app.get('io');
            if (io) {
                io.emit('issueUpdated', { issueId: issue._id, status });
                io.emit('analyticsUpdated', { cityId: issue.cityId });
            }
        } catch (postUpdateError) {
            console.error('Post-update error in issueController:', postUpdateError);
            // Don't fail the request since issue is already updated
        }

        if (!res.headersSent) {
            res.json({ success: true, issue });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Resolve Issue (Admin)
export const resolveIssue = async (req, res) => {
    try {
        const { resolutionNotes, resolvedImage } = req.body;
        const issue = await Issue.findById(req.params.id);

        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        const oldStatus = issue.status;
        issue.status = 'SOLVED'; // Using 'SOLVED' as per user dictionary

        issue.timeline.push({
            action: 'SOLVED',
            by: req.user.id || req.user._id,
            note: resolutionNotes || 'Issue resolved',
            timestamp: new Date()
        });

        await issue.save();

        await IssueResolution.create({
            issueId: issue._id,
            resolvedImage: resolvedImage,
            resolutionNotes: resolutionNotes,
            resolvedBy: req.user.id || req.user._id
        });

        await IssueStatusHistory.create({
            issueId: issue._id,
            oldStatus: oldStatus,
            newStatus: 'SOLVED',
            changedBy: req.user.id || req.user._id,
            remarks: 'Issue resolved'
        });

        await CommunityFeed.create({
            issueId: issue._id,
            eventType: 'SOLVED',
            message: `Issue solved!`
        });

        // Notify User
        await Notification.create({
            userId: issue.userId,
            title: 'Issue Resolved',
            message: `Great news! Your issue "${issue.title}" has been resolved.`,
            type: 'STATUS'
        });

        await logAction(req.user.id, 'RESOLVE_ISSUE', 'Issue', issue._id, { resolutionNotes });

        // Invalidate Cache
        await invalidateCache(issue.cityId, issue.stateId);

        // Emit Socket Event
        const io = req.app.get('io');
        if (io) {
            io.emit('issueUpdated', { issueId: issue._id, status: 'SOLVED' });
            io.emit('analyticsUpdated', { cityId: issue.cityId });
        }

        res.json({ message: 'Issue resolved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Duplicate/Important Issues (Admin)
export const getDuplicateIssues = async (req, res) => {
    try {
        const cityId = req.query.cityId || req.user.cityAccess?.[0];

        if (!cityId) {
            return res.status(400).json({ message: 'City ID required' });
        }

        // Find all active issues in city
        const issues = await Issue.find({
            cityId,
            status: { $in: ['REPORTED', 'IN_PROGRESS'] }
        }).populate('categoryId userId');

        // Group by proximity and category
        const duplicates = [];
        const processed = new Set();

        for (let i = 0; i < issues.length; i++) {
            if (processed.has(issues[i]._id.toString())) continue;

            // Find nearby issues with same category but different user
            const nearby = await Issue.find({
                _id: { $ne: issues[i]._id },
                cityId,
                categoryId: issues[i].categoryId._id,
                status: { $in: ['REPORTED', 'IN_PROGRESS'] },
                userId: { $ne: issues[i].userId._id },
                location: {
                    $near: {
                        $geometry: issues[i].location,
                        $maxDistance: 500 // 500 meters
                    }
                }
            }).populate('categoryId userId');

            if (nearby.length > 0) {
                duplicates.push({
                    primaryIssue: issues[i],
                    relatedIssues: nearby,
                    count: nearby.length + 1,
                    category: issues[i].categoryId.name,
                    location: issues[i].location.coordinates
                });

                processed.add(issues[i]._id.toString());
                nearby.forEach(n => processed.add(n._id.toString()));
            }
        }

        // Sort by count descending
        duplicates.sort((a, b) => b.count - a.count);

        res.json(duplicates.slice(0, 50)); // Return top 50
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Issue Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await IssueCategory.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle Important (Admin)
export const toggleImportant = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        issue.isImportant = !issue.isImportant;

        issue.timeline.push({
            action: 'IMPORTANT_FLAG',
            by: req.user.id || req.user._id,
            note: `Marked as ${issue.isImportant ? 'Important' : 'Normal'}`,
            timestamp: new Date()
        });

        await issue.save();

        if (issue.isImportant) {
            await Notification.create({
                userId: issue.userId,
                title: 'Issue flagged as Important',
                message: `Your issue "${issue.title}" has been flagged as Important by the administration.`,
                type: 'WARNING'
            });
        }

        res.json({
            message: `Issue marked as ${issue.isImportant ? 'important' : 'normal'}`,
            isImportant: issue.isImportant,
            timeline: issue.timeline
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    createIssue,
    getIssues,
    getIssueById,
    updateStatus,
    resolveIssue,
    getDuplicateIssues,
    getCategories,
    toggleImportant
};
