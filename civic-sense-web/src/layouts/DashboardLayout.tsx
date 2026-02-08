import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout, switchRole } from '../features/auth/authSlice';
import { cn } from '../lib/utils';
import {
    LayoutDashboard,
    FileWarning,
    ShieldAlert,
    BarChart3,
    Map,
    Users,
    Settings,
    LogOut,
    Bell,
    Menu,
    X,
    AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

// Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, path, active }: any) => {
    return (
        <Link
            to={path}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-slate-100 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-400"
            )}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
        </Link>
    );
};

// Dashboard Layout Component
export const DashboardLayout = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const adminLinks = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: FileWarning, label: 'Issue Management', path: '/admin/issues' },
        { icon: AlertTriangle, label: 'Important Issues', path: '/admin/important' },
        { icon: Map, label: 'Map View', path: '/admin/map' },
        { icon: ShieldAlert, label: 'Moderation Panel', path: '/admin/moderation' },
        { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const superAdminLinks = [
        { icon: LayoutDashboard, label: 'State Overview', path: '/superadmin' },
        { icon: BarChart3, label: 'City Comparison', path: '/superadmin/comparison' },
        { icon: Map, label: 'Area Analytics', path: '/superadmin/analytics' },
        { icon: Map, label: 'Heatmaps', path: '/superadmin/map' },
        { icon: Users, label: 'Admin Management', path: '/superadmin/admins' },
        { icon: Settings, label: 'Reports Export', path: '/superadmin/reports' },
    ];

    const isSuperAdminPath = location.pathname.startsWith('/superadmin');
    const links = isSuperAdminPath ? superAdminLinks : adminLinks;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 flex flex-col",
                    !isSidebarOpen && "-translate-x-full lg:hidden"
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">CivicSense</span>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden ml-auto text-slate-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="mb-6 px-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                {isSuperAdminPath ? 'State Command' : 'City Operations'}
                            </span>
                        </div>
                        {links.map((link) => (
                            <SidebarItem
                                key={link.path}
                                icon={link.icon}
                                label={link.label}
                                path={link.path}
                                active={location.pathname === link.path}
                            />
                        ))}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold shrink-0">
                                {user?.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-slate-500 truncate capitalize">
                                    {user?.role || 'Guest'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200 hidden sm:block">
                            {isSuperAdminPath ? 'State Overview' : 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button
                            onClick={() => navigate(isSuperAdminPath ? '/admin' : '/superadmin')}
                            className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md text-xs font-bold border border-indigo-200 hover:bg-indigo-100 transition-colors"
                        >
                            Switch to {isSuperAdminPath ? 'Admin' : 'Superadmin'}
                        </button>

                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-50/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
