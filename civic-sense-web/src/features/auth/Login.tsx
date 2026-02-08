
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('super@civic.com'); // Pre-fill proper demo user
    const [password, setPassword] = useState('super123');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(login({ email, password }));
            if (login.fulfilled.match(resultAction)) {
                const user = resultAction.payload.user;
                if (user.role === 'SUPERADMIN') {
                    navigate('/superadmin');
                } else {
                    navigate('/admin');
                }
            }
        } catch (err) {
            console.error('Failed to login:', err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">CivicSense Login</CardTitle>
                    <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <Button type="submit" className="w-full" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-sm text-center text-slate-500">
                    <p>Demo Credentials:</p>
                    <p>Superadmin (Backend): super@civic.com / super123</p>
                    <p>Admin (Backend): admin@civic.gov / password123</p>
                </CardFooter>
            </Card>
        </div>
    );
};
