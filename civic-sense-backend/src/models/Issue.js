import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'IssueCategory', required: true },

    title: { type: String, required: true },
    description: { type: String, required: true },

    status: {
        type: String,
        enum: ['REPORTED', 'IN_PROGRESS', 'SOLVED', 'COMPLETED', 'REJECTED'],
        default: 'REPORTED'
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },

    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    areaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },

    images: [{ type: String }],

    isImportant: { type: Boolean, default: false },

    timeline: [{
        action: { type: String, required: true }, // STATUS_CHANGE, COMMENT, IMPORTANT_FLAG
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

issueSchema.index({ location: '2dsphere' });
issueSchema.index({ status: 1 });
issueSchema.index({ cityId: 1, status: 1 });
issueSchema.index({ categoryId: 1, createdAt: 1 });
issueSchema.index({ areaId: 1, createdAt: 1 });

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;
