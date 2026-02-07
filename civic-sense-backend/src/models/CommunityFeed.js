import mongoose from 'mongoose';

const communityFeedSchema = new mongoose.Schema({
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },

    eventType: {
        type: String,
        enum: ['REPORTED', 'UPDATED', 'SOLVED'],
        required: true
    },

    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    collection: 'community_feed'
});

const CommunityFeed = mongoose.model('CommunityFeed', communityFeedSchema);
export default CommunityFeed;
