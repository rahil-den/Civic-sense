import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

const resolutionData = [
    { name: 'Jan', resolved: 320, pending: 100 },
    { name: 'Feb', resolved: 410, pending: 80 },
    { name: 'Mar', resolved: 380, pending: 120 },
    { name: 'Apr', resolved: 450, pending: 70 },
    { name: 'May', resolved: 520, pending: 50 },
    { name: 'Jun', resolved: 480, pending: 90 },
];

const departmentData = [
    { name: 'Public Works', value: 35, color: '#2563eb' },
    { name: 'Sanitation', value: 28, color: '#16a34a' },
    { name: 'Water Supply', value: 17, color: '#dc2626' },
    { name: 'Electricity', value: 20, color: '#ca8a04' },
];

const recentReports = [
    { id: 1, name: 'Monthly Issue Summary - June 2024', generated: 'Jul 1, 2024', format: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'Department Performance Q2', generated: 'Jun 30, 2024', format: 'XLSX', size: '1.8 MB' },
    { id: 3, name: 'Area-wise Analysis - Mumbai', generated: 'Jun 28, 2024', format: 'PDF', size: '3.1 MB' },
    { id: 4, name: 'Resolution Time Trends', generated: 'Jun 25, 2024', format: 'PDF', size: '1.2 MB' },
];

import api from "@/services/api";
import { useEffect, useState } from 'react';

export const ReportsPage = () => {
    const [cities, setCities] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await api.get('/locations/cities');
                setCities(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCities();
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
        } catch (error) {
            console.error("Export failed", error);
            alert("Export failed");
        }
    };

    const handleDownloadCSV = async () => {
        if (!selectedCity) {
            alert("Please select a city first");
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
        } catch (error) {
            console.error("Export failed", error);
            alert("Export failed");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Reports</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map(city => (
                                <SelectItem key={city._id} value={city._id}>{city.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleDownloadCSV} variant="outline" className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" /> CSV
                    </Button>
                    <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> PDF Report
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Resolution Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={resolutionData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Bar dataKey="resolved" fill="#16a34a" radius={[4, 4, 0, 0]} name="Resolved" />
                                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Issues by Department</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
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
                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
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
