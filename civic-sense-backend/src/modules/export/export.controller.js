import * as exportService from './export.service.js';
import { logAction } from '../audit/auditLogger.js';

export const exportCityAnalyticsCsv = async (req, res, next) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ message: 'City parameter is required to export' });
        }

        const csv = await exportService.generateCityCsv(city);

        res.header('Content-Type', 'text/csv');
        res.attachment(`${city}_analytics.csv`);

        logAction(req.user.id, 'EXPORT_CSV', 'ANALYTICS', city);

        return res.send(csv);
    } catch (err) {
        next(err);
    }
};

export const exportStateAnalyticsPdf = async (req, res, next) => {
    try {
        res.header('Content-Type', 'application/pdf');
        res.attachment('state_analytics_report.pdf');

        logAction(req.user.id, 'EXPORT_PDF', 'ANALYTICS', 'STATE');

        await exportService.generateStatePdf(res);
        // Note: Controller ends here, the PDF generation streams directly to response in service
    } catch (err) {
        next(err);
    }
};
