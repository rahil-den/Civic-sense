import * as governanceService from './governance.service.js';
import { logAction } from '../audit/auditLogger.js';
import { invalidateAnalyticsCache } from '../cache/cacheInvalidation.js';

export const createAdmin = async (req, res) => {
    try {
        const { email, password, role, department, cityAccess } = req.body;

        const newAdmin = await governanceService.createAdmin({
            email, password, role, department, cityAccess
        });

        // Audit & Socket
        const actorId = req.user ? req.user.id : 'unknown';
        logAction(actorId, 'CREATE_ADMIN', 'ADMIN', newAdmin._id);

        req.app.get('socketio').emit('analyticsUpdated', {
            type: 'admin_created',
            cityAccess: newAdmin.cityAccess
        });

        res.status(201).json(newAdmin);
    } catch (error) {
        console.error('Create Admin Error:', error);
        res.status(500).json({ message: 'Error creating admin' });
    }
};

export const disableAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await governanceService.disableAdmin(id);

        const actorId = req.user ? req.user.id : 'unknown';
        logAction(actorId, 'DISABLE_ADMIN', 'ADMIN', id);

        req.app.get('socketio').emit('analyticsUpdated', { type: 'admin_disabled' });

        res.json({ message: 'Admin disabled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error disabling admin' });
    }
};

// City Management
export const enableCity = async (req, res) => {
    const { name } = req.params;
    await governanceService.updatedCityStatus(name, true);

    logAction(req.user.id, 'ENABLE_CITY', 'CITY', name);
    req.app.get('socketio').emit('analyticsUpdated', { city: name, status: 'enabled' });

    res.json({ message: `City ${name} enabled` });
};

export const disableCity = async (req, res) => {
    const { name } = req.params;
    await governanceService.updatedCityStatus(name, false);

    logAction(req.user.id, 'DISABLE_CITY', 'CITY', name);
    req.app.get('socketio').emit('analyticsUpdated', { city: name, status: 'disabled' });

    res.json({ message: `City ${name} disabled` });
};

export const getListAdmins = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await governanceService.getAdmins(page, limit);

        logAction(req.user.id, 'VIEW_ADMINS', 'ADMIN_LIST', 'page-' + (page || 1));

        res.json(result);
    } catch (error) {
        console.error('List Admins Error:', error);
        res.status(500).json({ message: 'Error retrieving admins' });
    }
};

export const updateAdminDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Security: Prevent updating password via this route (use specific change-password route normally)
        delete updates.password;

        const updatedAdmin = await governanceService.updateAdmin(id, updates, req.user.id);

        logAction(req.user.id, 'UPDATE_ADMIN', 'ADMIN', id);
        req.app.get('socketio').emit('adminUpdated', { adminId: id, updates });

        res.json(updatedAdmin);
    } catch (error) {
        console.error('Update Admin Error:', error);
        res.status(400).json({ message: error.message || 'Error updating admin' });
    }
};

export const reassignDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { department } = req.body;

        if (!department) return res.status(400).json({ message: 'Department is required' });

        const updatedAdmin = await governanceService.updateDepartment(id, department);

        logAction(req.user.id, 'REASSIGN_DEPARTMENT', 'ADMIN', id);
        req.app.get('socketio').emit('adminUpdated', { adminId: id, department });

        res.json(updatedAdmin);
    } catch (error) {
        console.error('Reassign Dept Error:', error);
        res.status(500).json({ message: 'Error reassigning department' });
    }
};
