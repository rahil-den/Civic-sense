import mongoose from 'mongoose';

const adminMetaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },

    department: { type: String },
    isActive: { type: Boolean, default: true }
}, {
    collection: 'admins_meta'
});

const AdminMeta = mongoose.model('AdminMeta', adminMetaSchema);
export default AdminMeta;
