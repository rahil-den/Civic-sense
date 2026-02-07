import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['reported', 'in_progress', 'resolved', 'rejected'],
        default: 'reported'
    },
    city: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
reportSchema.index({ location: '2dsphere' });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: 1 });
reportSchema.index({ city: 1, status: 1 });
reportSchema.index({ category: 1, createdAt: 1 });
reportSchema.index({ city: 1, createdAt: 1 });

const Report = mongoose.model('Report', reportSchema);

export default Report;
