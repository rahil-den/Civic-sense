import mongoose from 'mongoose';

const reportExportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },

    pdfUrl: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now }
}, {
    collection: 'report_exports'
});

reportExportSchema.index({ userId: 1 });

const ReportExport = mongoose.model('ReportExport', reportExportSchema);
export default ReportExport;
