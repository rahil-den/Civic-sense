import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const IssueResolutionSchema = new mongoose.Schema({
    issueId: { type: mongoose.Schema.Types.ObjectId },
    resolvedImage: String,
    resolutionNotes: String
}, { collection: 'issue_resolution' });
const IssueResolution = mongoose.model('IssueResolution', IssueResolutionSchema);

async function check() {
    const res = await IssueResolution.find({}, 'issueId resolvedImage resolutionNotes createdAt').sort({ issueId: 1 }).limit(20);
    console.log(res.map(r => ({
        id: r._id,
        issueId: r.issueId,
        hasImage: !!r.resolvedImage,
    })));
    process.exit(0);
}
check();
