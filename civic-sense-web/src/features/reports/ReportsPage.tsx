import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import api from "@/services/api";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea', '#0891b2'];

const recentReports = [
    { id: 1, name: 'Monthly Issue Summary - June 2024', generated: 'Jul 1, 2024', format: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'Department Performance Q2', generated: 'Jun 30, 2024', format: 'XLSX', size: '1.8 MB' },
    { id: 3, name: 'Area-wise Analysis - Mumbai', generated: 'Jun 28, 2024', format: 'PDF', size: '3.1 MB' },
    { id: 4, name: 'Resolution Time Trends', generated: 'Jun 25, 2024', format: 'PDF', size: '1.2 MB' },
];

export const ReportsPage = () => {
    const [cities, setCities] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [loading, setLoading] = useState(true);

    const [resolutionData, setResolutionData] = useState<any[]>([]);
    const [departmentData, setDepartmentData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [citiesRes, stateRes, trendsRes] = await Promise.all([
                    api.get('/locations/cities'),
                    api.get('/analytics/state'),
                    api.get('/analytics/trends')
                ]);

                setCities(citiesRes.data);
                
                // Process Category Distribution for "Department" Chart
                const categories = stateRes.data.categoryDistribution || [];
                const processedDeptData = categories.map((cat: any, index: number) => ({
                    name: cat._id,
                    value: cat.count,
                    color: COLORS[index % COLORS.length]
                }));
                setDepartmentData(processedDeptData);

                // Process Trends
                setResolutionData(trendsRes.data);

            } catch (err) {
                console.error("Failed to fetch report data", err);
                toast.error("Failed to load report data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDownloadPDF = async () => {
        try {
            const response = await api.get('/export/pdf/state', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'state-report.pdf');
            document.body.appendChild(link);
            link.click();
            toast.success("PDF Downloaded successfully");
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Export failed");
        }
    };

    const handleDownloadCSV = async () => {
        if (!selectedCity) {
            toast.error("Please select a city first");
            return;
        }
        try {
            const response = await api.get(`/export/csv?cityId=${selectedCity}`, { responseType: 'blob' });
const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', `city-issues.csv`);
document.body.appendChild(link);
link.click();
toast.success("CSV Downloaded successfully");
        } catch (error) {
    console.error("Export failed", error);
    toast.error("Export failed");
}
    };

if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}

return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Reports & Analytics</h2>
                <p className="text-slate-500">Export data and view system-wide performance metrics.</p>
            </div>
            <div className="flex items-center gap-2">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select City for CSV" />
                    </SelectTrigger>
                    <SelectContent>
                        {cities.map(city => (
                            <SelectItem key={city._id} value={city._id}>{city.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">State Report (PDF)</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Comprehensive</div>
                    <p className="text-xs text-muted-foreground">Includes summary & recent issues</p>
                    <Button className="w-full mt-4" onClick={handleDownloadPDF}>
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">City Data (CSV)</CardTitle>
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Raw Data</div>
                    <p className="text-xs text-muted-foreground">Export issues for external analysis</p>
                    <Button variant="outline" className="w-full mt-4" onClick={handleDownloadCSV}>
                        <Download className="mr-2 h-4 w-4" /> Download CSV
                    </Button>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Resolution Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={resolutionData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pending" fill="#ef4444" name="Pending" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Department/Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={departmentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {departmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-500" />
                    <CardTitle>Recent Reports</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Report Name</TableHead>
                            <TableHead>Generated</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.name}</TableCell>
                                <TableCell>{report.generated}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="uppercase text-xs font-mono">
                                        {report.format}
                                    </Badge>
                                </TableCell>
                                <TableCell>{report.size}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
);
};
