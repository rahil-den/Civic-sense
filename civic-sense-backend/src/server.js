import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import connectRedis from './config/redis.js';
import { verifyToken, requireRole } from './middleware/auth.js';

import authRoutes from './routes/authRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import governanceRoutes from './routes/governanceRoutes.js';
import exportRoutes from './routes/exportRoutes.js';

import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Connect to Redis
const redis = connectRedis;

const app = express();
const httpServer = createServer(app);

// Security Middleware
app.use(helmet());
app.use(cors()); // Allow cross-origin requests
app.disable('x-powered-by');

// Rate Limiting
app.use(rateLimiter);

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

// Make io accessible globally via app
app.set('io', io);

app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.send('Civic Sense Backend API is running...');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/export', exportRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
