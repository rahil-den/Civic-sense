import mongoose from 'mongoose';

const issueStatusHistorySchema = new mongoose.Schema({
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },

    oldStatus: { type: String },
    newStatus: { type: String, required: true },

    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String },

    createdAt: { type: Date, default: Date.now }
}, {
    collection: 'issue_status_history'
});

issueStatusHistorySchema.index({ issueId: 1 });

const IssueStatusHistory = mongoose.model('IssueStatusHistory', issueStatusHistorySchema);
export default IssueStatusHistory;
