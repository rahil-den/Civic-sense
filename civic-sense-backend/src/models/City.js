import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

citySchema.index({ stateId: 1 });
citySchema.index({ name: 1 });

const City = mongoose.model('City', citySchema);
export default City;
