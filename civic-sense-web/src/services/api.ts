
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Update if backend URL differs
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');

        // In development, fallback to mock token if no real token exists
        if (!token && process.env.NODE_ENV === 'development') {
            token = 'mock-jwt-token';
        }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Add mock role for development (simulate SUPERADMIN)
        if (process.env.NODE_ENV === 'development') {
            config.headers['x-mock-role'] = 'SUPERADMIN';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
