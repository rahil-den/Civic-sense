import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import * as analyticsService from '../analytics/analytics.service.js'; // Re-use analytics logic

export const generateCityCsv = async (city) => {
    // Re-use existing analytics service to get data
    // Optimally, you might have a dedicated export query if fields differ, but for now reuse is DRY
    const stats = await analyticsService.getCityAnalytics(city);

    const fields = ['metric', 'value', 'details'];
    const data = [
        { metric: 'City', value: city },
        { metric: 'Total Reports', value: stats.totalReports },
        { metric: 'Resolved', value: stats.resolvedReports },
        { metric: 'Resolution Rate', value: stats.resolutionRate },
        // Flattening arrays for simple CSV representation or adding rows
    ];

    stats.topCategories.forEach((c, i) => {
        data.push({ metric: `Top Category #${i + 1}`, value: c.category, details: `${c.count} reports` });
    });

    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(data);
};

export const generateStatePdf = async (res) => {
    const stats = await analyticsService.getStateAnalytics();

    const doc = new PDFDocument();

    // Check http headers are set in controller, we just stream to res here
    doc.pipe(res);

    doc.fontSize(25).text('Civic Sense Analytics Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('State Overview');
    doc.fontSize(12).text(`Total Reports: ${stats.totalReports}`);
    doc.text(`Resolved: ${stats.resolvedReports}`);
    doc.text(`Pending: ${stats.pendingReports}`);
    doc.text(`Avg Resolution Time: ${stats.avgResolutionTimeHours} hours`);

    doc.moveDown();
    doc.fontSize(16).text('Category Distribution');

    stats.categoryDistribution.forEach(cat => {
        doc.fontSize(12).text(`${cat.category}: ${cat.count}`);
    });

    doc.end();
};
