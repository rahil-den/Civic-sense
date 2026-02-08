import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

export const AuthRedirect = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role === 'SUPERADMIN') {
        return <Navigate to="/superadmin" replace />;
    }

    return <Navigate to="/admin" replace />;
};
