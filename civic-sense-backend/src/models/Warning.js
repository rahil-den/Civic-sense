import mongoose from 'mongoose';

const warningSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },

    reason: { type: String, required: true },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    createdAt: { type: Date, default: Date.now }
});

warningSchema.index({ userId: 1 });

const Warning = mongoose.model('Warning', warningSchema);
export default Warning;
