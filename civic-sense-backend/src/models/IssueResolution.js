import mongoose from 'mongoose';

const issueResolutionSchema = new mongoose.Schema({
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },

    resolvedImage: { type: String },
    resolutionNotes: { type: String },

    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date, default: Date.now }
}, {
    collection: 'issue_resolution'
});

issueResolutionSchema.index({ issueId: 1 });

const IssueResolution = mongoose.model('IssueResolution', issueResolutionSchema);
export default IssueResolution;
