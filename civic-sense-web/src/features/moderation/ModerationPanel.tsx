import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Ban } from "lucide-react";

// Mock flagged users/reports
const flaggedItems = [
    { id: 'u-123', name: 'John Doe', warnings: 2, lastViolation: 'False report spam', status: 'active' },
    { id: 'u-456', name: 'Jane Smith', warnings: 5, lastViolation: 'Abusive language', status: 'banned' },
];

export const ModerationPanel = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Content Moderation</h2>
                <p className="text-slate-500 mt-2">Manage reported content and user violations.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Warnings</TableHead>
                            <TableHead>Last Violation</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {flaggedItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            {item.name[0]}
                                        </div>
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-amber-600">
                                        <AlertTriangle className="mr-1 h-4 w-4" />
                                        {item.warnings}
                                    </div>
                                </TableCell>
                                <TableCell>{item.lastViolation}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'banned' ? 'destructive' : 'outline'}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="outline">Warn</Button>
                                        <Button size="sm" variant="destructive">
                                            <Ban className="mr-1 h-3 w-3" /> Ban
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
