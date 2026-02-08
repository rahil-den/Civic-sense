import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from '@/services/api';

interface Admin {
    _id: string;
    name: string;
    email: string;
    role: string;
    meta?: {
        department?: string;
        assignedCities?: any[];
    };
}

export const AdminManagement = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        role: ''
    });
    const [createFormData, setCreateFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        role: 'ADMIN'
    });

    // Fetch admins from database
    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/governance/admins');
            setAdmins(response.data.admins || []);
        } catch (error) {
            console.error('Failed to fetch admins:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfigClick = (admin: Admin) => {
        setSelectedAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            department: admin.meta?.department || '',
            role: admin.role
        });
        setIsConfigOpen(true);
    };

    const handleSaveConfig = async () => {
        if (!selectedAdmin) return;

        try {
            await api.patch(`/governance/admin/${selectedAdmin._id}`, formData);
            await fetchAdmins(); // Refresh list
            setIsConfigOpen(false);
        } catch (error) {
            console.error('Failed to update admin:', error);
        }
    };

    const handleCreateClick = () => {
        setCreateFormData({
            name: '',
            email: '',
            password: '',
            department: '',
            role: 'ADMIN'
        });
        setIsCreateOpen(true);
    };

    const handleCreateAdmin = async () => {
        try {
            console.log('Sending create admin request:', createFormData);
            const response = await api.post('/governance/admin', createFormData);
            console.log('Create admin response:', response.data);
            await fetchAdmins(); // Refresh list
            setIsCreateOpen(false);
        } catch (error: any) {
            console.error('Failed to create admin - Full error:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
            alert(`Failed to create admin: ${errorMessage}`);
        }
    };

    const getCityName = (admin: Admin) => {
        const cities = admin.meta?.assignedCities || [];
        if (cities.length === 0) return 'Not Assigned';
        // If cities are populated objects, extract name
        return cities.map((c: any) => c.name || c).join(', ');
    };

    const getPerformance = () => {
        // Mock performance - in real app, calculate from analytics
        return Math.floor(Math.random() * 30) + 70;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Admin Management</h2>
                        <p className="text-slate-500 mt-2">Manage backend system administrators and roles.</p>
                    </div>
                    <Button onClick={handleCreateClick}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create New Admin
                    </Button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Admin</TableHead>
                                <TableHead>Assigned City</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Performance</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                        No admins found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                admins.map((admin) => {
                                    const performance = getPerformance();
                                    return (
                                        <TableRow key={admin._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary">
                                                        <ShieldCheck className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div>{admin.name}</div>
                                                        <div className="text-xs text-slate-500">{admin.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getCityName(admin)}</TableCell>
                                            <TableCell>{admin.meta?.department || 'N/A'}</TableCell>
                                            <TableCell>
                                                <span className={performance >= 90 ? "text-green-600 font-medium" : performance >= 75 ? "text-amber-600" : "text-red-600"}>
                                                    {performance}%
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={admin.role === 'ADMIN' || admin.role === 'SUPERADMIN' ? 'default' : 'secondary'}>
                                                    {admin.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleConfigClick(admin)}
                                                >
                                                    Configuration <ExternalLink className="ml-2 h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Configuration Dialog */}
            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Admin Configuration</DialogTitle>
                        <DialogDescription>
                            Update administrator details and permissions
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="e.g., Infrastructure, Sanitation"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <select
                                id="role"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPERADMIN">SUPERADMIN</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveConfig}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create New Admin Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create New Admin</DialogTitle>
                        <DialogDescription>
                            Add a new administrator to the system
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">Full Name *</Label>
                            <Input
                                id="create-name"
                                value={createFormData.name}
                                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-email">Email *</Label>
                            <Input
                                id="create-email"
                                type="email"
                                value={createFormData.email}
                                onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-password">Password *</Label>
                            <Input
                                id="create-password"
                                type="password"
                                value={createFormData.password}
                                onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                                placeholder="Enter secure password"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-department">Department</Label>
                            <Input
                                id="create-department"
                                value={createFormData.department}
                                onChange={(e) => setCreateFormData({ ...createFormData, department: e.target.value })}
                                placeholder="e.g., Infrastructure, Sanitation"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="create-role">Role *</Label>
                            <select
                                id="create-role"
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                value={createFormData.role}
                                onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPERADMIN">SUPERADMIN</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateAdmin}>
                            Create Admin
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
