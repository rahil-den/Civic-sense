import Issue from '../models/Issue.js';
import PDFDocument from 'pdfkit';
import { parse } from 'json2csv';
import fs from 'fs';

// GET /api/export/city?cityId= (CSV)
export const exportCityIssues = async (req, res) => {
    try {
        const { cityId } = req.query;
        if (!cityId) return res.status(400).json({ message: 'City ID is required' });

        const issues = await Issue.find({ cityId: cityId }).lean();

        // Convert to CSV
        // Check fields since we use lean(), we get raw DB objects (camelCase now)
        const csv = parse(issues);

        res.header('Content-Type', 'text/csv');
        res.attachment(`city_issues_${cityId}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/export/state/pdf (PDF)
export const exportStateReport = async (req, res) => {
    try {
        const issues = await Issue.find().populate('cityId', 'name').populate('categoryId', 'name');
        const total = issues.length;
        const resolved = issues.filter(i => i.status === 'SOLVED').length;
        const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(2) : 0;

        // Generate PDF
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=state_report.pdf');

        doc.pipe(res);

        doc.fontSize(25).text('State Issues Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
        doc.moveDown();

        doc.fontSize(16).text('Summary Statistics');
        doc.fontSize(12).text(`Total Issues: ${total}`);
        doc.text(`Resolved Issues: ${resolved}`);
        doc.text(`Resolution Rate: ${resolutionRate}%`);
        doc.moveDown();

        doc.fontSize(16).text('Recent Issues List');
        issues.slice(0, 20).forEach((issue, index) => {
            const categoryName = issue.categoryId?.name || 'Unknown';
            const cityName = issue.cityId?.name || 'Unknown City';
            doc.fontSize(12).text(`${index + 1}. [${issue.status}] ${categoryName} in ${cityName}`);
            doc.fontSize(10).text(`   ${issue.description.substring(0, 100)}...`, { color: 'grey' });
            doc.moveDown(0.5);
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
