import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Ban } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ModerationPanel = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isWarnDialogOpen, setIsWarnDialogOpen] = useState(false);
    const [warnReason, setWarnReason] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getFlaggedUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch flagged users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenWarnDialog = (user: any) => {
        setSelectedUser(user);
        setWarnReason("");
        setIsWarnDialogOpen(true);
    };

    const handleIssueWarning = async () => {
        if (!selectedUser || !warnReason) return;
        try {
            await adminApi.issueWarning({
                userId: selectedUser.id || selectedUser._id,
                reason: warnReason
            });
            setIsWarnDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Failed to issue warning", error);
        }
    };

    const handleBanUser = async (user: any) => {
        if (!confirm(`Are you sure you want to BAN ${user.name}? This action is severe.`)) return;
        try {
            await adminApi.banUser(user.id || user._id, "Repeated violations");
            fetchUsers();
        } catch (error) {
            console.error("Failed to ban user", error);
        }
    };

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
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-32" /></div></div></TableCell>
                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell className="text-right"><div className="flex justify-end gap-2"><Skeleton className="h-8 w-16" /><Skeleton className="h-8 w-16" /></div></TableCell>
                                </TableRow>
                            ))
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                    No flagged users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((item) => (
                                <TableRow key={item.id || item._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                {item.name ? item.name[0] : '?'}
                                            </div>
                                            <div>
                                                <p>{item.name}</p>
                                                <p className="text-xs text-slate-400">{item.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-amber-600">
                                            <AlertTriangle className="mr-1 h-4 w-4" />
                                            {item.warningCount}
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
                                            <Button size="sm" variant="outline" onClick={() => handleOpenWarnDialog(item)}>Warn</Button>
                                            {item.status !== 'banned' && (
                                                <Button size="sm" variant="destructive" onClick={() => handleBanUser(item)}>
                                                    <Ban className="mr-1 h-3 w-3" /> Ban
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isWarnDialogOpen} onOpenChange={setIsWarnDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Issue Warning</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Reason for warning</Label>
                            <Textarea
                                placeholder="Describe the violation..."
                                value={warnReason}
                                onChange={(e) => setWarnReason(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsWarnDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleIssueWarning} disabled={!warnReason}>Issue Warning</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
