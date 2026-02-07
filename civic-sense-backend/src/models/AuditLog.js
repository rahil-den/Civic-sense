import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },

    action: { type: String, required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId }, // Generic ref

    createdAt: { type: Date, default: Date.now }
}, {
    collection: 'audit_logs'
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
