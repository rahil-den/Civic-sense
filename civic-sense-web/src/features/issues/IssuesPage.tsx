
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Filter } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { IssueActionDialog } from "./IssueActionDialog";
import { StatusFilterChips } from "../dashboard/StatusFilterChips";
import { Issue, IssueStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import api from "@/services/api";

export const IssuesPage = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filter, setFilter] = useState<IssueStatus | 'all'>('all');
    const [search, setSearch] = useState('');
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
                remarks: []
            }));
            setIssues(data);
        } catch (error) {
            console.error("Failed to fetch issues", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const filteredIssues = issues.filter(issue => {
        const matchesStatus = filter === 'all' || issue.status === filter;
        const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase()) ||
            issue.id.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleEditClick = (issue: Issue) => {
        setSelectedIssue(issue);
        setDialogOpen(true);
    };

    const handleSaveIssue = async (id: string, status: IssueStatus, remarks: string) => {
        try {
            if (status === 'resolved') {
                await api.post(`/issues/${id}/resolve`, {
                    resolutionNotes: remarks,
                    resolvedImage: ""
                });
            } else {
                const backendStatus =
                    status === 'open' ? 'REPORTED' :
                        status === 'in_progress' ? 'IN_PROGRESS' :
                            status.toUpperCase();

                await api.put(`/issues/${id}/status`, {
                    status: backendStatus,
                    remarks
                });
            }
            fetchIssues();
        } catch (error) {
            console.error("Error updating issue", error);
            alert("Failed to update issue status");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Issue Management</h2>
                    <p className="text-slate-500">Review and resolve reported civic issues.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="hidden sm:flex">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button>Export CSV</Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by ID or title..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <StatusFilterChips selectedStatus={filter} onSelect={setFilter} />
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Issue</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Reported</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">Loading issues...</TableCell>
                            </TableRow>
                        ) : filteredIssues.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">No issues found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredIssues.map((issue) => (
                                <TableRow key={issue.id}>
                                    <TableCell>
                                        <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100">
                                            <img
                                                src={issue.images[0] || "https://placehold.co/100x100"}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium truncate max-w-[200px]">{issue.title}</span>
                                            <span className="text-xs text-muted-foreground uppercase">{issue.id.slice(0, 8)} • {issue.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <div className="truncate text-sm text-slate-600 dark:text-slate-400" title={issue.location.address}>
                                            {issue.location.address}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={issue.status} />
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                                        {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEditClick(issue)}>
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditClick(issue)}>
                                                    Update Status
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    Flag as Invalid
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <IssueActionDialog
                issue={selectedIssue}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSave={handleSaveIssue}
            />
        </div>
    );
};
