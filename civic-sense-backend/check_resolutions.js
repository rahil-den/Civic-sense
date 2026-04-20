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
    const res = await IssueResolution.find({}, 'resolvedImage resolutionNotes').limit(5);
    console.log(res.map(r => ({
        id: r._id,
        notes: r.resolutionNotes,
        hasImage: !!r.resolvedImage,
        imageLength: r.resolvedImage ? r.resolvedImage.length : 0
    })));
    process.exit(0);
}
check();
