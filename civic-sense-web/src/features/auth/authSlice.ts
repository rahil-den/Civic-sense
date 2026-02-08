
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface AuthState {
    user: {
        id: string;
        name: string;
        email: string;
        role: 'ADMIN' | 'SUPERADMIN' | null;
    } | null;
    token: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Load user from localStorage if available
const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    isAuthenticated: !!savedToken,
    status: 'idle',
    error: null,
};

// Async Thunk for Login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { _id, name, email, role, token } = response.data;
            const user = { id: _id, name, email, role: role.toUpperCase() }; // Sync with backend uppercase roles

            localStorage.setItem('token', token);
            localStorage.setItem('role', role.toUpperCase());
            localStorage.setItem('user', JSON.stringify(user));

            return { user, token };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: AuthState['user']; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user');
        },
        switchRole: (state, action: PayloadAction<'ADMIN' | 'SUPERADMIN'>) => {
            if (state.user) {
                state.user.role = action.payload;
                localStorage.setItem('user', JSON.stringify(state.user)); // Persist role switch
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { setCredentials, logout, switchRole } = authSlice.actions;

export default authSlice.reducer;
