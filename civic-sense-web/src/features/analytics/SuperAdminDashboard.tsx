
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { HierarchicalSelector } from './HierarchicalSelector';
import api from "@/services/api";
import { useEffect, useState } from 'react';

export const SuperAdminDashboard = () => {
    const [data, setData] = useState<any>(null);
    const [comparisonData, setComparisonData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            const [stateRes, compRes] = await Promise.all([
                api.get('/analytics/state'),
                api.get('/analytics/comparison')
            ]);
            setData(stateRes.data);
            setComparisonData(compRes.data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const summary = data?.summary || { totalIssues: 0, resolved: 0, pending: 0 };
    const resolutionRate = summary.totalIssues > 0
        ? ((summary.resolved / summary.totalIssues) * 100).toFixed(1)
        : "0";

    const issuesByCity = comparisonData.map(c => ({
        name: c.cityName || 'Unknown',
        value: c.total
    }));

    const categoryDistribution = data?.categoryDistribution?.map((item: any) => ({
        name: item._id,
        value: item.count,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    })) || [];

    const avgResolutionTimeDays = data?.avgResolutionTimeMs
        ? (data.avgResolutionTimeMs / (1000 * 60 * 60 * 24)).toFixed(1)
        : "0";

    const trendData = [
        { name: 'Jan', value: 2800 },
        { name: 'Feb', value: 3200 },
        { name: 'Mar', value: 3100 },
        { name: 'Apr', value: 3600 },
        { name: 'May', value: 4100 },
        { name: 'Jun', value: 3900 },
    ];

    if (isLoading) return <div className="p-10 text-center">Loading statewide analytics...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">State Overview</h2>
                </div>
                <div className="w-full sm:w-auto">
                    <HierarchicalSelector />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Issues"
                    value={summary.totalIssues.toLocaleString()}
                    description="Live state count"
                    icon={BarChart as any}
                />
                <StatsCard
                    title="Resolution Rate"
                    value={`${resolutionRate}%`}
                    description="Performance metric"
                    trend="up"
                    icon={PieChart as any}
                />
                <StatsCard
                    title="Avg Resolution Time"
                    value={`${avgResolutionTimeDays} days`}
                    description="Based on solved issues"
                    trend="down"
                    icon={LineChart as any}
                />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.pending.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Issues by City</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={issuesByCity}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {categoryDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Issue Trend Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
