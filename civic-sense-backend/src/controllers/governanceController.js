import User from '../models/User.js';
import City from '../models/City.js';
import IssueCategory from '../models/IssueCategory.js';
import AdminMeta from '../models/AdminMeta.js';
import { logAction } from '../utils/auditLogger.js';

// GET /api/governance/admins (Paginated)
export const getAdmins = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        // Fetch users who are ADMIN or SUPERADMIN
        const admins = await User.find({ role: { $in: ['ADMIN', 'SUPERADMIN'] } })
            .select('-password_hash')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean()
            .exec();

        // Populate meta for each admin
        const adminIds = admins.map(a => a._id);
        const metaList = await AdminMeta.find({ userId: { $in: adminIds } }).lean();

        // Merge meta into user objects
        const adminsWithMeta = admins.map(admin => {
            const meta = metaList.find(m => m.userId.toString() === admin._id.toString());
            return { ...admin, meta: meta || null };
        });

        const count = await User.countDocuments({ role: { $in: ['ADMIN', 'SUPERADMIN'] } });

        res.json({
            admins: adminsWithMeta,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PATCH /api/governance/admin/:id
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, department, cityId, stateId, isActive } = req.body;

        // 1. Update Core User Info
        const userUpdates = {};
        if (name) userUpdates.name = name;
        if (email) userUpdates.email = email;
        if (role) userUpdates.role = role;

        let user = await User.findByIdAndUpdate(id, userUpdates, { new: true }).select('-password_hash');

        // 2. Update/Create Admin Meta if meta fields are present
        if (department || cityId || stateId || isActive !== undefined) {
            const metaUpdates = {};
            if (department) metaUpdates.department = department;
            if (cityId) metaUpdates.cityId = cityId;
            if (stateId) metaUpdates.stateId = stateId;
            if (isActive !== undefined) metaUpdates.isActive = isActive;

            await AdminMeta.findOneAndUpdate(
                { userId: id },
                { $set: metaUpdates },
                { new: true, upsert: true } // Create if not exists
            );
        }

        // Log action
        await logAction(req.user.id, 'UPDATE_ADMIN', 'User', id, req.body);

        const io = req.app.get('io');
        if (io) {
            io.emit('adminUpdated', { adminId: id, updates: req.body });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PATCH /api/governance/city/:id/enable
export const toggleCityStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const city = await City.findByIdAndUpdate(id, { isActive }, { new: true });

        const io = req.app.get('io');
        if (io) {
            io.emit('cityStatusUpdated', { cityId: id, isActive });
        }

        res.json(city);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/governance/category
export const addCategory = async (req, res) => {
    try {
        const { name, icon } = req.body;

        const category = await IssueCategory.create({ name, icon });

        await logAction(req.user.id, 'ADD_CATEGORY', 'IssueCategory', category._id, { name });

        const io = req.app.get('io');
        if (io) {
            io.emit('categoryAdded', { name, id: category._id });
        }

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
