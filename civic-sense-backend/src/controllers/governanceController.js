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

// POST /api/governance/admin (Create new admin)
// POST /api/governance/admin (Create new admin)
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password, role, department, assignedCities } = req.body;

        console.log('Creating admin with data:', { name, email, role, department });

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create user
        const newUser = await User.create({
            name,
            email,
            password_hash: password, // Note: In production, this should be hashed
            role: role || 'ADMIN',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        });

        console.log('User created successfully:', newUser._id);

        // Create AdminMeta if department or cities provided
        if (department || assignedCities) {
            await AdminMeta.create({
                userId: newUser._id,
                department: department || 'General',
                assignedCities: assignedCities || [],
                permissions: ['MANAGE_ISSUES', 'VIEW_ANALYTICS']
            });
            console.log('AdminMeta created for user:', newUser._id);
        }

        // Log action (only if req.user exists)
        if (req.user && req.user.id) {
            await logAction(req.user.id, 'CREATE_ADMIN', 'User', newUser._id, { email, role });
        }

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('adminCreated', { adminId: newUser._id, name, email });
        }

        // Return user without password
        const userResponse = newUser.toObject();
        delete userResponse.password_hash;

        console.log('Admin created successfully, sending response');
        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: error.message });
    }
};

