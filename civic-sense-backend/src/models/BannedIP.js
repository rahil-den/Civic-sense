import mongoose from 'mongoose';

const bannedKPSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true, unique: true },
    reason: { type: String },
    bannedAt: { type: Date, default: Date.now }
}, {
    collection: 'banned_ips'
});

const BannedIP = mongoose.model('BannedIP', bannedKPSchema);
export default BannedIP;
