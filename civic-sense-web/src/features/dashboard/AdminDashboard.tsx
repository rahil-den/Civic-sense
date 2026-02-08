import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    AlertCircle,
    Clock,
    CheckCircle2,
    XCircle,
    BarChart3
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatusFilterChips } from "./StatusFilterChips";
import { RecentIssues } from "./RecentIssues";
import { mockIssues } from "@/lib/mockData";
import { Issue, IssueStatus } from "@/types";
import { io } from "socket.io-client";
import api from "@/services/api";

// In a real app, this would be in a context or hook
// const socket = io("http://localhost:3000"); 

export const AdminDashboard = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<IssueStatus | 'all'>('all');

    // Fetch issues from backend
    useEffect(() => {
        const fetchIssues = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/issues');
                const data = response.data.map((item: any) => ({
                    id: item._id,
                    title: item.title,
                    description: item.description,
                    category: item.categoryId?.name?.toLowerCase() || 'others',
                    status:
                        item.status === 'SOLVED' ? 'resolved' :
                            item.status === 'REPORTED' ? 'open' :
                                item.status.toLowerCase(),
                    priority: 'medium',
                    location: item.location || { lat: 0, lng: 0, address: '' },
                    images: item.images || [],
                    reportedBy: item.userId?.name || 'Anonymous',
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    resolvedAt: item.status === 'SOLVED' ? item.updatedAt : undefined
                }));
                if (data.length > 0) {
                    setIssues(data);
                }
            } catch (error) {
                console.error("Failed to fetch issues", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIssues();

        // Socket listener could go here
    }, []);

    const filteredIssues = filter === 'all'
        ? issues
        : issues.filter(i => i.status === filter);

    // Calculate stats
    const totalReportedToday = issues.filter(i => {
        const today = new Date().toDateString();
        return new Date(i.createdAt).toDateString() === today;
    }).length;

    const inProgressCount = issues.filter(i => i.status === 'in_progress').length;

    const resolvedToday = issues.filter(i => {
        const today = new Date().toDateString();
        return i.status === 'resolved' && i.resolvedAt && new Date(i.resolvedAt).toDateString() === today;
    }).length;

    // Placeholder for avg time calculation
    const avgTime = "4h 12m"; // Mocked for now

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">City Operations Dashboard</h2>
                <p className="text-slate-500 mt-2">Real-time overview of civic issues and resolution metrics.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Reported Today"
                    value={totalReportedToday || 12} // Fallback for demo if mock data is old
                    icon={AlertCircle}
                    trend="up"
                    trendValue="+12"
                    description="vs yesterday"
                    className="border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20"
                />
                <StatsCard
                    title="In Progress"
                    value={inProgressCount || 5}
                    icon={Clock}
                    description="Active issues being addressed"
                    className="border-amber-100 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20"
                />
                <StatsCard
                    title="Resolved Today"
                    value={resolvedToday || 8}
                    icon={CheckCircle2}
                    trend="up"
                    trendValue="+8"
                    description="completion rate"
                    className="border-green-100 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20"
                />
                <StatsCard
                    title="Avg Resolution Time"
                    value={avgTime}
                    icon={BarChart3}
                    trend="up"
                    trendValue="15%"
                    description="faster than avg"
                    className="border-slate-200 dark:border-slate-800"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid gap-8 lg:grid-cols-1">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
                        <StatusFilterChips selectedStatus={filter} onSelect={setFilter} />
                    </div>

                    <RecentIssues issues={filteredIssues} />
                </div>
            </div>
        </div>
    );
};
