import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
    AlertTriangle,
    Ban,
    MoreHorizontal,
    Search,
    ShieldAlert,
    Trash2,
    CheckCircle2
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBanned: boolean;
    warningCount: number;
    createdAt: string;
}

export function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [warnReason, setWarnReason] = useState('');
    const [isWarnDialogOpen, setIsWarnDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Optionally filter by role=USER only?
            const response = await api.get('/users?role=USER');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId: string, currentStatus: boolean) => {
        try {
            await api.patch(`/users/${userId}/ban`);
            toast.success(currentStatus ? "User unbanned successfully" : "User banned successfully");
            fetchUsers();
        } catch (error) {
            console.error('Failed to ban user:', error);
            toast.error("Failed to update ban status");
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await api.delete(`/users/${selectedUser._id}`);
            toast.success("User deleted successfully");
            setIsDeleteDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            toast.error("Failed to delete user");
        }
    };

    const handleWarnUser = async () => {
        if (!selectedUser || !warnReason.trim()) return;
        try {
            await api.post(`/users/${selectedUser._id}/warn`, { reason: warnReason });
            toast.success(`Warning issued to ${selectedUser.name}`);
            setWarnReason('');
            setIsWarnDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to warn user:', error);
            toast.error("Failed to issue warning");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users Management</h2>
                    <p className="text-muted-foreground">Manage platform users, warnings, and bans.</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Warnings</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">Loading users...</TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">No users found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.isBanned ? "destructive" : "outline"} className={user.isBanned ? "" : "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"}>
                                            {user.isBanned ? "Banned" : "Active"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <AlertTriangle
                                                    key={i}
                                                    size={16}
                                                    className={i < (user.warningCount || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}
                                                />
                                            ))}
                                            <span className="ml-2 text-sm text-gray-500">
                                                ({user.warningCount || 0}/3)
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
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
                                                <DropdownMenuItem
                                                    className={user.isBanned ? "text-green-600" : "text-red-600"}
                                                    onClick={() => handleBanUser(user._id, user.isBanned)}
                                                >
                                                    {user.isBanned ? (
                                                        <>
                                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Unban User
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Ban className="mr-2 h-4 w-4" /> Ban User
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedUser(user);
                                                    setWarnReason('');
                                                    setIsWarnDialogOpen(true);
                                                }}>
                                                    <ShieldAlert className="mr-2 h-4 w-4" /> Issue Warning
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsDeleteDialogOpen(true);
                                                }}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete User
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

            {/* Warn Dialog */}
            <Dialog open={isWarnDialogOpen} onOpenChange={setIsWarnDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Issue Warning to {selectedUser?.name}</DialogTitle>
                        <DialogDescription>
                            This warning will be recorded and count towards automatic banning (3 warnings = Ban).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Enter reason for warning..."
                            value={warnReason}
                            onChange={(e) => setWarnReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsWarnDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleWarnUser} disabled={!warnReason.trim()}>
                            Issue Warning
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
