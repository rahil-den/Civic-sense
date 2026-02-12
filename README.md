# 🏛️ Civic Sense

> **A comprehensive civic issue reporting and management platform** that empowers citizens to report infrastructure problems and enables local authorities to track, manage, and resolve them efficiently.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB.svg)
![Expo](https://img.shields.io/badge/Expo-54-000020.svg)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Backend API](#-backend-api)
- [Why Redis?](#-why-redis)
- [Real-time Updates](#-real-time-updates)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Contributors / Made by](#-contributors)

---

## 🎯 Overview

Civic Sense is a **full-stack platform** consisting of:

| Component | Purpose |
|-----------|---------|
| **Mobile App** | Citizens report issues, track status, view community feed |
| **Web Dashboard** | Admins manage issues, view analytics, export reports |
| **Backend API** | Handles data, real-time updates, caching, exports |

### Key Features

- 📸 **Photo-based Reporting** — Capture and submit civic issues with GPS location
- 🗺️ **Map Visualization** — View issues on an interactive map with category filters
- 📊 **Analytics Dashboard** — City/state-level statistics, resolution rates, hotspots
- 🔔 **Real-time Notifications** — Instant updates when issue status changes
- 📄 **PDF/CSV Export** — Generate reports for governance and auditing
- 🛡️ **Role-based Access** — User, Admin, SuperAdmin roles with permissions

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │     │   Web Dashboard │     │   Admin Panel   │
│  (React Native) │     │     (React)     │     │     (React)     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      REST API           │
                    │   (Express.js + Node)   │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│    MongoDB      │    │     Redis       │    │   Socket.io     │
│   (Database)    │    │    (Cache)      │    │  (Real-time)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🛠️ Tech Stack

### Backend (`civic-sense-backend/`)

| Technology | Purpose |
|------------|---------|
| **Express.js** | REST API framework |
| **MongoDB + Mongoose** | NoSQL database with ODM |
| **Redis (ioredis)** | Caching & rate limiting |
| **Socket.io** | Real-time bidirectional communication |
| **Helmet** | Security headers |
| **bcryptjs** | Password hashing |
| **PDFKit / json2csv** | Report generation |

### Mobile App (`civic-sense-mobile/`)

| Technology | Purpose |
|------------|---------|
| **React Native 0.81** | Cross-platform mobile framework |
| **Expo SDK 54** | Development toolchain |
| **Expo Router** | File-based navigation |
| **Redux Toolkit** | Global state management |
| **expo-camera** | Photo capture |
| **expo-location** | GPS coordinates |
| **Socket.io Client** | Real-time updates |

### Web Dashboard (`civic-sense-web/`)

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite 7** | Build tool |
| **ESLint** | Code quality |

---

## 📁 Project Structure

```
Civic-sense/
├── civic-sense-backend/          # Node.js API Server
│   ├── src/
│   │   ├── config/               # Database & Redis configuration
│   │   ├── controllers/          # Route handlers (business logic)
│   │   ├── middleware/           # Auth, rate limiting, error handling
│   │   ├── models/               # Mongoose schemas (19 models)
│   │   ├── routes/               # API route definitions
│   │   ├── utils/                # Helpers, cache handlers, audit logger
│   │   └── server.js             # Entry point
│   └── package.json
│
├── civic-sense-mobile/           # React Native Expo App
│   ├── app/                      # Expo Router screens
│   │   ├── (tabs)/               # Tab navigation screens
│   │   ├── auth/                 # Authentication screens
│   │   └── _layout.tsx           # Root layout
│   ├── components/               # Reusable UI components
│   ├── constants/                # Theme, categories
│   ├── services/                 # API & socket services
│   ├── store/                    # Redux store & slices
│   └── types/                    # TypeScript definitions
│
├── civic-sense-web/              # React Admin Dashboard
│   ├── src/
│   └── package.json
│
└── README.md                     # This file
```

---

## 🔌 Backend API

### Available Routes

| Route | Description |
|-------|-------------|
| `POST /api/auth/register` | User registration |
| `POST /api/auth/login` | User authentication |
| `GET /api/auth/me` | Get current user profile |
| `GET /api/issues` | List issues (with filters) |
| `POST /api/issues` | Create new issue |
| `GET /api/issues/:id` | Get issue details with history |
| `PUT /api/issues/:id/status` | Update issue status (Admin) |
| `PUT /api/issues/:id/resolve` | Mark issue as resolved (Admin) |
| `GET /api/analytics/state` | State-level statistics |
| `GET /api/analytics/city` | City-level statistics |
| `GET /api/analytics/heatmap` | Issue heatmap data |
| `GET /api/locations/states` | List all states |
| `GET /api/locations/cities` | List cities by state |
| `GET /api/locations/areas` | List areas by city |
| `GET /api/community/feed` | Community activity feed |
| `GET /api/governance/*` | Admin governance endpoints |
| `GET /api/export/pdf` | Export issues as PDF |
| `GET /api/export/csv` | Export issues as CSV |

### Data Models (19 Total)

**Core Models:**
- `User` — Citizens and admins
- `Issue` — Reported civic problems
- `IssueCategory` — Categories (pothole, garbage, etc.)
- `IssueStatusHistory` — Status change audit trail
- `IssueResolution` — Resolution details with photos

**Location Models:**
- `State`, `City`, `Area` — Geographic hierarchy

**Admin Models:**
- `Admin`, `AdminMeta` — Admin accounts and metadata
- `AuditLog` — Action tracking for accountability
- `BannedIP`, `UserWarning` — Security/moderation

**Community Models:**
- `CommunityFeed` — Activity feed events
- `Notification` — Push notification records
- `Report`, `ReportExport` — Generated reports

---

## 🚀 Why Redis?

Redis is used for **two critical purposes**:

### 1. **Analytics Caching**

Analytics queries (aggregations over thousands of issues) are expensive. Redis caches results for **5 minutes**:

```javascript
// Example from analyticsController.js
const cacheKey = `analytics:state`;
const cachedData = await redis.get(cacheKey);

if (cachedData) {
    return res.json(JSON.parse(cachedData)); // ⚡ Fast cache hit
}

// ... expensive MongoDB aggregation ...

await redis.setex(cacheKey, 300, JSON.stringify(result)); // Cache for 5 min
```

**Cached endpoints:**
- `/api/analytics/state` — State statistics
- `/api/analytics/city` — City statistics  
- `/api/analytics/heatmap` — Heatmap coordinates

### 2. **Distributed Rate Limiting**

Prevents API abuse using `rate-limit-redis`:

```javascript
// rateLimiter.js
export const rateLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:',
    }),
    windowMs: 60 * 1000,  // 1 minute window
    max: 100,              // 100 requests per IP
});
```

**Why Redis for rate limiting?**
- Works across multiple server instances (horizontal scaling)
- Persistent counter storage
- Atomic operations for accuracy

---

## ⚡ Real-time Updates

Socket.io enables **instant updates** across all connected clients:

### Events Emitted

| Event | When | Data |
|-------|------|------|
| `issueCreated` | New issue submitted | `{ issue }` |
| `issueUpdated` | Status changed | `{ issueId, status }` |
| `analyticsUpdated` | Stats recalculated | `{ cityId }` |

### Mobile Client Integration

```typescript
// services/socketService.ts
socket.on('issue:update', (issue) => {
    store.dispatch(handleRealTimeUpdate(issue));
});

socket.on('notification:new', (notification) => {
    store.dispatch(addNotification(notification));
});
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- MongoDB (local or Atlas)
- Redis Server
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

```bash
cd civic-sense-backend
npm install
cp .env.example .env  # Configure environment variables
npm run dev           # Start with nodemon
```

### Mobile App Setup

```bash
cd civic-sense-mobile
npm install
npx expo start        # Start Expo dev server
```

### Web Dashboard Setup

```bash
cd civic-sense-web
npm install
npm run dev           # Start Vite dev server
```

---

## 🔐 Environment Variables

### Backend (`civic-sense-backend/.env`)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/civic-sense
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Mobile (`civic-sense-mobile/.env`)

```env
API_URL=http://localhost:3000
SOCKET_URL=http://localhost:3000
```

---

## 📱 Mobile App Screenshots

> 🖼️ **Screenshots will be added soon!**

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 Contributors

- [Rahil](https://github.com/rahil-den)
- [Iyan](https://github.com/iyan-devcore)
- [Talha](https://github.com/Talha201111)
- [Kaif](https://github.com/KaifCodes20)

---

## 📄 License

This project is licensed under the ISC License.

---

<p align="center">
  Made with ❤️ for better cities
</p>