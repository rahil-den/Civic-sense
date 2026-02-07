import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },
    message: { type: String, required: true },

    type: {
        type: String,
        enum: ['STATUS', 'WARNING'],
        default: 'STATUS'
    },
    isRead: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
