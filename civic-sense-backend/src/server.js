import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import connectRedis from './config/redis.js';
import Report from './models/Report.js'; // Ensure model is loaded for indexing
import Admin from './models/Admin.js';
import { verifyToken, requireRole } from './middleware/auth.js';
import { logAction } from './modules/audit/auditLogger.js';

import analyticsRoutes from './modules/analytics/analytics.routes.js';
import governanceRoutes from './modules/governance/governance.routes.js';
import exportRoutes from './modules/export/export.routes.js';

import helmet from 'helmet';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Force Sync Indexes on Startup (As per requirement to ensure performance)
mongoose.connection.once("open", async () => {
    try {
        await Report.syncIndexes();
        await Admin.syncIndexes();
        console.log("MongoDB Indexes Synced Successfully (Reports & Admins)");
    } catch (err) {
        console.error("Index Sync Failed:", err);
    }
});

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
app.set('socketio', io);

app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    res.send('Civic Sense Backend API is running...');
});

// Mount Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/export', exportRoutes);

// Test Routes for RBAC
app.get('/test-admin', verifyToken, requireRole('ADMIN'), (req, res) => {
    logAction(req.user.id, 'ACCESS_ADMIN_ROUTE', 'ROUTE', '/test-admin');
    res.json({ message: 'Admin access granted', user: req.user });
});

app.get('/test-superadmin', verifyToken, requireRole('SUPERADMIN'), (req, res) => {
    logAction(req.user.id, 'ACCESS_SUPERADMIN_ROUTE', 'ROUTE', '/test-superadmin');
    res.json({ message: 'Superadmin access granted', user: req.user });
});

// Global Error Handler
app.use(errorHandler);

import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
