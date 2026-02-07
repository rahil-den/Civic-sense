import mongoose from 'mongoose';

const userWarningSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issue_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
    },
    reason: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

userWarningSchema.index({ user_id: 1 });
userWarningSchema.index({ created_at: 1 });

const UserWarning = mongoose.model('UserWarning', userWarningSchema);

export default UserWarning;
