
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './app/hooks';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';

// Features
import { Login } from './features/auth/Login';
import { AdminDashboard } from './features/dashboard/AdminDashboard';
import { IssuesPage } from './features/issues/IssuesPage';
import { SuperAdminDashboard } from './features/analytics/SuperAdminDashboard';
import { AdminManagement } from './features/admins/AdminManagement';
import { ModerationPanel } from './features/moderation/ModerationPanel';
import { GeoInsights } from './features/analytics/GeoInsights';
import { AdminMapView } from './features/maps/AdminMapView';
import { ReportsPage } from './features/reports/ReportsPage';
import { AdminSettings } from './features/settings/AdminSettings';
import { CityComparison } from './features/analytics/CityComparison';
import { AreaAnalytics } from './features/analytics/AreaAnalytics';
import { Heatmaps } from './features/analytics/Heatmaps';
import { AuthRedirect } from './components/auth/AuthRedirect';
import { ImportantIssuesPage } from './features/issues/ImportantIssuesPage';



const Unauthorized = () => (
    <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
            <p className="text-slate-600 dark:text-slate-400">You do not have permission to access this page.</p>
        </div>
    </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user && !allowedRoles.includes(user.role || '')) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="issues" element={<IssuesPage />} />
                    <Route path="important" element={<ImportantIssuesPage />} />
                    <Route path="map" element={<AdminMapView />} />
                    <Route path="moderation" element={<ModerationPanel />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Superadmin Routes */}
                <Route
                    path="/superadmin"
                    element={
                        <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<SuperAdminDashboard />} />
                    <Route path="comparison" element={<CityComparison />} />
                    <Route path="analytics" element={<AreaAnalytics />} />
                    <Route path="map" element={<GeoInsights />} />
                    <Route path="admins" element={<AdminManagement />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="heatmaps" element={<Heatmaps />} />
                </Route>

                {/* Root route - Auto-redirect based on auth state */}
                <Route path="/" element={<AuthRedirect />} />

                {/* Catch all - Redirect to root for intelligent routing */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
