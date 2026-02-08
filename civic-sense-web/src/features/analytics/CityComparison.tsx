
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Clock, Target, CheckCircle2 } from 'lucide-react';

import api from "@/services/api";
import { useEffect, useState } from 'react';

export const CityComparison = () => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComparison = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/analytics/comparison');
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch comparison", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComparison();
    }, []);

    const volumeData = data.map(city => ({
        name: city.cityName || 'Unknown',
        resolved: city.resolved,
        pending: city.pending
    }));

    const cityRankings = data.map((city, idx) => ({
        rank: idx + 1,
        name: city.cityName || 'Unknown',
        time: 'N/A', // We'd need more logic for this
        score: Math.round(city.resolutionRate),
    }));

    const totalResolved = data.reduce((acc, city) => acc + city.resolved, 0);
    const bestCity = data.length > 0 ? data.sort((a, b) => b.resolutionRate - a.resolutionRate)[0] : null;

    if (isLoading) return <div className="p-10 text-center">Loading city comparisons...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">City Comparison</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="pune">Pune</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="month">
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="This Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all-cat">
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-cat">All Categories</SelectItem>
                            <SelectItem value="potholes">Potholes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cities Monitored</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Performance</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bestCity?.cityName || 'N/A'}</div>
                        <p className="text-xs text-green-600">{bestCity ? `${bestCity.resolutionRate.toFixed(1)}% resolution` : ''}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.reduce((acc, c) => acc + c.total, 0).toLocaleString()}</div>
                        <p className="text-xs text-blue-600">Statewide count</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Resolved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalResolved.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Cumulative</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Issue Volume Comparison</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={volumeData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                            <Legend />
                            <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[0, 0, 0, 0]} barSize={40} />
                            <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[0, 0, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>City Performance Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Rank</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Avg. Resolution Time</TableHead>
                                <TableHead className="text-right">Performance Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cityRankings.map((city) => (
                                <TableRow key={city.name}>
                                    <TableCell>
                                        <Badge variant="outline" className="rounded-full w-6 h-6 flex items-center justify-center p-0">
                                            {city.rank}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{city.name}</TableCell>
                                    <TableCell>{city.time}</TableCell>
                                    <TableCell className="text-right w-[200px]">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Progress value={city.score} className="w-[100px] h-2" />
                                            <span className="text-sm font-medium w-8">{city.score}%</span>
                                        </div>
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
