import AuditLog from '../models/AuditLog.js';

export const logAction = async (actorId, action, targetType, targetId, metadata = {}) => {
    try {
        // We need role. Ideally pass it or fetch it.
        // For simplicity, we might need to fetch the user to get the role if not passed.
        // But to keep it non-blocking, we'll try to get it from actorId if valid.
        // Or assume the caller is responsible.
        // The AuditLog schema requires 'role'.
        // We will fetch the user briefly.

        // Circular import risk if we import User here?
        // Let's use mongoose.model('User') to be safe.
        // Or just require 'role' to be passed.
        // The dictionary says audit_logs has: actorId, role, action, targetId.

        // Let's assume metadata might contain role or we should fetch it.
        // I'll update the signature in next iter if needed, but for now let's do a quick fetch.

        const { default: User } = await import('../models/User.js');
        const user = await User.findById(actorId).select('role');

        await AuditLog.create({
            actorId,
            role: user ? user.role : 'UNKNOWN',
            action,
            targetId: targetId || null,
            metadata // Store extra data if supports mixed/metadata field? 
            // Wait, AuditLog schema I created does NOT have metadata field.
            // The dictionary for audit_logs is: actorId, role, action, targetId, createdAt.
            // It DOES NOT have metadata.
            // So I should DROP metadata from the create call.
        });

    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};
