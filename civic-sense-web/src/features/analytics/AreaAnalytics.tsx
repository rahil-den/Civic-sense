
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import api from "@/services/api";
import { useEffect, useState } from 'react';

export const AreaAnalytics = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cities, setCities] = useState<any[]>([]);
    const [cityId, setCityId] = useState("");

    const fetchCityAnalytics = async () => {
        if (!cityId) return;
        setIsLoading(true);
        try {
            const response = await api.get(`/analytics/city?cityId=${cityId}`);
            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch city analytics", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const response = await api.get('/locations/cities');
                setCities(response.data);
                if (response.data.length > 0) {
                    setCityId(response.data[0]._id);
                }
            } catch (err) {
                console.error(err);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (cityId) fetchCityAnalytics();
    }, [cityId]);

    const hotspots = data?.areaHotspots || [];
    const areaData = hotspots.map((h: any) => ({
        name: h.areaName || 'Unknown',
        issues: h.count
    }));

    // Mock trend for visual
    const trendData = [
        { name: 'Week 1', value: 24, value2: 18, value3: 15 },
        { name: 'Week 2', value: 30, value2: 24, value3: 19 },
        { name: 'Week 3', value: 20, value2: 28, value3: 14 },
        { name: 'Week 4', value: 18, value2: 16, value3: 22 },
    ];

    if (isLoading && !data) return <div className="p-10 text-center">Loading area data...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Area Analytics</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={cityId} onValueChange={setCityId}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map(city => (
                                <SelectItem key={city._id} value={city._id}>{city.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Areas Monitored</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{hotspots.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.total || 0}</div>
                        <p className="text-xs text-red-600">Active in city</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.resolutionRate || 0}%</div>
                        <p className="text-xs text-green-600">City performance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hotspots Detected</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{hotspots.length}</div>
                        <p className="text-xs text-green-600">High volume zones</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Issues by Area</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={areaData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="issues" fill="#1e3a8a" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Trend by Area</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#1e3a8a" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                                <Area type="monotone" dataKey="value2" stroke="#22c55e" fillOpacity={0} strokeWidth={2} />
                                <Area type="monotone" dataKey="value3" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <CardTitle>Area Hotspots</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Area Name</TableHead>
                                <TableHead>Active Issues</TableHead>
                                <TableHead>Severity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hotspots.map((spot: any) => (
                                <TableRow key={spot._id}>
                                    <TableCell className="font-medium">{spot.areaName || 'Unknown'}</TableCell>
                                    <TableCell className="text-blue-600 font-bold">{spot.count}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${spot.count > 10 ? 'bg-red-50 text-red-700 border-red-200' :
                                                spot.count > 5 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-green-50 text-green-700 border-green-200'}
                                        `}>
                                            {spot.count > 10 ? 'High' : spot.count > 5 ? 'Medium' : 'Low'}
                                        </Badge>
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
