import mongoose from 'mongoose';

const issueCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const IssueCategory = mongoose.model('IssueCategory', issueCategorySchema, 'issue_categories');
export default IssueCategory;
