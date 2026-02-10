import Issue from '../models/Issue.js';
import PDFDocument from 'pdfkit';
import { parse } from 'json2csv';
import fs from 'fs';

// GET /api/export/city?cityId= (CSV)
export const exportCityIssues = async (req, res) => {
    try {
        const { cityId } = req.query;
        if (!cityId) return res.status(400).json({ message: 'City ID is required' });

        const issues = await Issue.find({ cityId: cityId })
            .populate('categoryId', 'name')
            .populate('cityId', 'name')
            .lean();

        // Convert to CSV
        const fields = [
            { label: 'Issue ID', value: '_id' },
            { label: 'Title', value: 'title' },
            { label: 'Description', value: 'description' },
            { label: 'Status', value: 'status' },
            { label: 'Category', value: 'categoryId.name' }, // Will require populate
            { label: 'City', value: 'cityId.name' },
            { label: 'Created At', value: 'createdAt' }
        ];

        const csv = parse(issues, { fields });

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
        const issues = await Issue.find()
            .populate('cityId', 'name')
            .populate('categoryId', 'name')
            .populate('userId', 'name email');

        const total = issues.length;
        const resolved = issues.filter(i => i.status === 'SOLVED').length;
        const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(2) : 0;

        // Generate PDF
        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=state_report.pdf');

        doc.pipe(res);

        // Header
        doc.fontSize(20).text('Civic Sense - State Issues Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
        doc.moveDown();

        // Summary Box
        doc.rect(50, 100, 500, 70).stroke();
        doc.fontSize(14).text('Summary Statistics', 60, 110);
        doc.fontSize(12).text(`Total Issues: ${total}`, 60, 135);
        doc.text(`Resolved Issues: ${resolved}`, 250, 135);
        doc.text(`Resolution Rate: ${resolutionRate}%`, 400, 135);

        doc.moveDown(4);

        // Issues List
        doc.fontSize(16).text('Detailed Issue Report', 50, 200);
        doc.moveDown();

        let y = 230;

        issues.forEach((issue, index) => {
            if (y > 700) {
                doc.addPage();
                y = 50;
            }

            const categoryName = issue.categoryId?.name || 'Unknown';
            const cityName = issue.cityId?.name || 'Unknown City';
            const userName = issue.userId?.name || 'Anonymous';
            const status = issue.status;

            // Issue Box
            doc.rect(50, y, 500, 120).stroke();

            // Text Details
            doc.fontSize(12).font('Helvetica-Bold').text(`Issue #${index + 1}: ${issue.title}`, 60, y + 10);
            doc.fontSize(10).font('Helvetica').text(`Status: ${status}`, 400, y + 10);

            doc.text(`Category: ${categoryName}`, 60, y + 30);
            doc.text(`Location: ${cityName}`, 250, y + 30);
            doc.text(`Reported By: ${userName}`, 60, y + 45);
            doc.text(`Date: ${new Date(issue.createdAt).toLocaleDateString()}`, 250, y + 45);

            doc.text(`Description:`, 60, y + 65);
            doc.text(issue.description.substring(0, 150) + (issue.description.length > 150 ? '...' : ''), 60, y + 80, { width: 300 });

            // Image (if exists)
            if (issue.images && issue.images.length > 0 && issue.images[0].startsWith('data:image')) {
                try {
                    const base64Data = issue.images[0].split(';base64,').pop();
                    const imgBuffer = Buffer.from(base64Data, 'base64');
                    doc.image(imgBuffer, 400, y + 30, { width: 130, height: 80, fit: [130, 80] });
                } catch (e) {
                    doc.text('(Image Error)', 400, y + 60);
                }
            }

            y += 140;
        });

        doc.end();
    } catch (error) {
        console.error("PDF Generation Error:", error);
        res.status(500).json({ message: error.message });
    }
};
