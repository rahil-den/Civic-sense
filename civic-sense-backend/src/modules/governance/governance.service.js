import Admin from '../../models/Admin.js';
import bcrypt from 'bcryptjs';
import { invalidateAnalyticsCache } from '../cache/cacheInvalidation.js';
import { paginate, formatPaginationResponse } from '../../utils/pagination.js';

export const getAdmins = async (page = 1, limit = 20) => {
    // Basic pagination logic without util for simplicity if util import fails or just use util
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const admins = await Admin.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const total = await Admin.countDocuments();

    return {
        data: admins,
        meta: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum)
        }
    };
};

export const updateAdmin = async (id, updateData, requesterId) => {
    // 1. Fetch current admin to check rules
    const adminToUpdate = await Admin.findById(id);
    if (!adminToUpdate) {
        throw new Error('Admin not found');
    }

    // 2. Prevent self-demotion/role change if target is self
    if (id === requesterId && updateData.role && updateData.role !== adminToUpdate.role) {
        throw new Error('Cannot change your own role');
    }

    // 3. Prevent removing limit last SUPERADMIN
    if (adminToUpdate.role === 'SUPERADMIN' && updateData.role && updateData.role !== 'SUPERADMIN') {
        const superAdminCount = await Admin.countDocuments({ role: 'SUPERADMIN', isActive: true });
        if (superAdminCount <= 1) {
            throw new Error('Cannot remove the last SUPERADMIN');
        }
    }

    // 4. Update
    const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

    // Invalidate cache as admin access might have changed
    await invalidateAnalyticsCache();

    return updatedAdmin;
};

export const updateDepartment = async (id, department) => {
    const updatedAdmin = await Admin.findByIdAndUpdate(id, { department }, { new: true }).select('-password');
    await invalidateAnalyticsCache();
    return updatedAdmin;
};

export const createAdmin = async (adminData) => {
    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    const newAdmin = await Admin.create({
        ...adminData,
        password: hashedPassword
    });

    // Invalidate global cache as new admin might affect things
    await invalidateAnalyticsCache();

    return newAdmin;
};

export const disableAdmin = async (adminId) => {
    const admin = await Admin.findByIdAndUpdate(adminId, { isActive: false }, { new: true });
    await invalidateAnalyticsCache();
    return admin;
};

// Mock city enable/disable (Since we don't have a City model yet)
// In a real app, this would update a City collection
export const updatedCityStatus = async (cityName, status) => {
    // Simulating database update
    console.log(`[DB] City ${cityName} status updated to ${status ? 'enabled' : 'disabled'}`);

    // Invalidate cache specific to this city
    await invalidateAnalyticsCache(cityName);

    return { city: cityName, isActive: status };
};
