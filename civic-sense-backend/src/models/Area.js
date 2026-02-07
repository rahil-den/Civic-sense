import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

areaSchema.index({ cityId: 1 });

const Area = mongoose.model('Area', areaSchema);
export default Area;
