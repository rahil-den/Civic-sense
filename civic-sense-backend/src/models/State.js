import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const State = mongoose.model('State', stateSchema);
export default State;
