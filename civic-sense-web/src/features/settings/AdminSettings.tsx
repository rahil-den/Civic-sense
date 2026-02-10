
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Shield, Save, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { toast } from 'sonner';

export const AdminSettings = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        department: 'pw', // Default
        phone: '',
    });

    // Password State
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Preferences State (Mock for now or sync if backend supports)
    const [preferences, setPreferences] = useState({
        pushNotifications: true,
        emailNotifications: true,
        summary: false,
        urgentAlerts: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const user = await adminApi.getProfile();
            setProfile({
                name: user.name,
                email: user.email,
                department: user.department || 'pw',
                phone: user.phone || ''
            });
            if (user.preferences) {
                setPreferences(prev => ({ ...prev, ...user.preferences }));
            }
        } catch (error) {
            toast.error('Failed to load profile');
        }
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.id]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await adminApi.updateProfile({
                name: profile.name,
                email: profile.email,
                department: profile.department,
                phone: profile.phone,
                preferences: preferences
            });

            toast.success('Settings saved successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (!passwords.currentPassword) {
            toast.error('Current password is required');
            return;
        }

        try {
            await adminApi.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success('Password changed successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordChange(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Settings</h2>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-slate-500" />
                        <CardTitle>Profile Settings</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={profile.name} onChange={handleProfileChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" value={profile.email} onChange={handleProfileChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select
                                value={profile.department}
                                onValueChange={(val) => setProfile(prev => ({ ...prev, department: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pw">Public Works</SelectItem>
                                    <SelectItem value="sanitation">Sanitation</SelectItem>
                                    <SelectItem value="water">Water Supply</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" value={profile.phone} onChange={handleProfileChange} placeholder="+91..." />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-slate-500" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Get notified about report updates</p>
                        </div>
                        <Switch
                            checked={preferences.pushNotifications}
                            onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive email summaries</p>
                        </div>
                        <Switch
                            checked={preferences.emailNotifications}
                            onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-slate-500" />
                        <CardTitle>Security</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Change Password</Label>
                            <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowPasswordChange(!showPasswordChange)}>
                            {showPasswordChange ? 'Cancel' : 'Update'}
                        </Button>
                    </div>

                    {showPasswordChange && (
                        <div className="grid gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                />
                            </div>
                            <Button onClick={handlePasswordChange}>Update Password</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button size="lg" className="w-full sm:w-auto" onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
};
