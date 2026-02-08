# CivicSense Backend API

> **Real-time civic issue reporting and management platform for government administrators**

A robust Node.js/Express backend with MongoDB for managing citizen-reported civic issues, providing analytics, geospatial heatmaps, and administrative governance tools.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Usage](#usage)

---

## ✨ Features

- **JWT Authentication** (currently mock for development)
- **Role-Based Access Control** (USER, ADMIN, SUPERADMIN)
- **Geospatial Issue Tracking** with 2dsphere indexing
- **Real-time Updates** via Socket.IO
- **Analytics & Heatmaps** for issue density visualization
- **PDF & CSV Export** for reporting
- **Rate Limiting & Security** with Helmet.js
- **Redis Caching** for performance optimization

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Primary database (with Mongoose ODM) |
| **Redis** | Caching layer |
| **Socket.IO** | WebSocket for real-time updates |
| **Helmet** | Security headers |
| **CORS** | Cross-origin resource sharing |
| **bcryptjs** | Password hashing |
| **PDFKit** | PDF generation |
| **json2csv** | CSV export |

---

## 📁 Folder Structure

```
civic-sense-backend/
├── src/
│   ├── config/           # Database & Redis connection configs
│   │   ├── db.js         # MongoDB connection
│   │   └── redis.js      # Redis connection
│   │
│   ├── controllers/      # Business logic for each route
│   │   ├── analyticsController.js    # State/city analytics, heatmaps
│   │   ├── authController.js         # Login, register, getMe
│   │   ├── communityController.js    # Community feed interactions
│   │   ├── exportController.js       # PDF/CSV generation
│   │   ├── governanceController.js   # Admin management (SUPERADMIN)
│   │   ├── issueController.js        # CRUD for civic issues
│   │   ├── locationController.js     # States, cities, areas
│   │   └── userController.js         # User profile management
│   │
│   ├── middleware/       # Request processing layers
│   │   ├── auth.js       # JWT verification (mock) & role checks
│   │   ├── errorHandler.js  # Global error handler
│   │   ├── rateLimiter.js   # Request rate limiting
│   │   └── uploadHandler.js # File upload middleware
│   │
│   ├── models/           # Mongoose schemas (19 models)
│   │   ├── User.js       # USER, ADMIN, SUPERADMIN roles
│   │   ├── Issue.js      # Civic issue reports
│   │   ├── IssueCategory.js  # Categories (Roads, Water, etc.)
│   │   ├── IssueResolution.js  # Resolution tracking
│   │   ├── IssueStatusHistory.js  # Status audit trail
│   │   ├── State.js      # Indian states
│   │   ├── City.js       # Cities within states
│   │   ├── Area.js       # Areas within cities
│   │   ├── AdminMeta.js  # Admin-specific metadata
│   │   ├── AuditLog.js   # Admin action logs
│   │   ├── BannedIP.js   # IP blacklist
│   │   ├── Category.js   # Generic categories
│   │   ├── CommunityFeed.js  # Social feed posts
│   │   ├── Notification.js  # User notifications
│   │   ├── Report.js     # Abuse reports
│   │   ├── ReportExport.js  # Export history
│   │   ├── UserWarning.js  # User moderation warnings
│   │   └── Warning.js    # Warning templates
│   │
│   ├── routes/           # API route definitions
│   │   ├── analyticsRoutes.js   # /api/analytics
│   │   ├── authRoutes.js        # /api/auth
│   │   ├── communityRoutes.js   # /api/community
│   │   ├── exportRoutes.js      # /api/export
│   │   ├── governanceRoutes.js  # /api/governance
│   │   ├── issueRoutes.js       # /api/issues
│   │   ├── locationRoutes.js    # /api/locations
│   │   └── userRoutes.js        # /api/users
│   │
│   ├── utils/            # Helper functions
│   │   ├── pdfGenerator.js  # PDF report creation
│   │   ├── csvExporter.js   # CSV file generation
│   │   └── [other utilities]
│   │
│   └── server.js         # Main application entry point
│
├── .env                  # Environment variables
├── package.json          # Dependencies
└── README.md             # This file
```

---

## 🗄 Database Models

### Core Models

#### **User** (`User.js`)
```javascript
{
  name: String,
  email: String (unique, indexed),
  password_hash: String,
  role: ['USER', 'ADMIN', 'SUPERADMIN'],
  avatar: String,
  oauthProvider: String,  // 'google' | 'github'
  oauthId: String,
  warningCount: Number (max: 3),
  isBanned: Boolean
}
```

#### **Issue** (`Issue.js`)
```javascript
{
  userId: ObjectId → User,
  categoryId: ObjectId → IssueCategory,
  title: String,
  description: String,
  status: ['REPORTED', 'IN_PROGRESS', 'SOLVED', 'COMPLETED', 'REJECTED'],
  location: {
    type: 'Point',
    coordinates: [lng, lat]  // GeoJSON format
  },
  stateId: ObjectId → State,
  cityId: ObjectId → City,
  areaId: ObjectId → Area,
  images: [String],  // URLs
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:** 2dsphere on `location`, compound on `cityId + status`

#### **IssueCategory** (`IssueCategory.js`)
```javascript
{
  name: String,        // "Roads", "Water", "Electricity"
  description: String,
  icon: String,
  color: String        // Hex color for UI
}
```

### Location Hierarchy

#### **State** → **City** → **Area**
```javascript
State: { name, code }
City: { name, stateId, isActive }
Area: { name, cityId, zipCode }
```

### Governance Models

#### **AdminMeta** (`AdminMeta.js`)
```javascript
{
  userId: ObjectId → User,
  department: String,
  assignedCities: [ObjectId → City],
  permissions: [String]
}
```

#### **AuditLog** (`AuditLog.js`)
```javascript
{
  adminId: ObjectId → User,
  action: String,      // "ISSUE_RESOLVED", "USER_BANNED"
  targetId: ObjectId,
  metadata: Object,
  timestamp: Date
}
```

### Reporting Models

#### **IssueResolution** (`IssueResolution.js`)
```javascript
{
  issueId: ObjectId → Issue,
  adminId: ObjectId → User,
  resolutionText: String,
  beforeImage: String,
  afterImage: String,
  resolvedAt: Date
}
```

#### **IssueStatusHistory** (`IssueStatusHistory.js`)
```javascript
{
  issueId: ObjectId,
  oldStatus: String,
  newStatus: String,
  changedBy: ObjectId → User,
  comment: String,
  timestamp: Date
}
```

---

## 🚀 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Create new user account |
| POST | `/login` | Public | Login & receive token |
| GET | `/me` | Token | Get current user profile |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@civic.gov", "password": "password123"}'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "City Admin",
  "email": "admin@civic.gov",
  "role": "ADMIN",
  "token": "mock-jwt-token"
}
```

---

### Issues (`/api/issues`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/` | Token | Any | Create new issue |
| GET | `/` | Token | Any | Get all issues (filtered by user role) |
| GET | `/:id` | Token | Any | Get single issue details |
| PUT | `/:id/status` | Token | ADMIN | Update issue status |
| POST | `/:id/resolve` | Token | ADMIN | Mark issue as resolved |

**Example: Get All Issues**
```bash
curl http://localhost:3000/api/issues \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Pothole on Main St",
    "description": "Large pothole causing traffic issues",
    "status": "REPORTED",
    "location": { "type": "Point", "coordinates": [72.8777, 19.0760] },
    "categoryId": { "name": "Roads", "color": "#FF5733" },
    "userId": { "name": "John Doe", "email": "john@example.com" },
    "createdAt": "2026-02-08T10:00:00.000Z"
  }
]
```

---

### Analytics (`/api/analytics`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/state` | Token | State-wide analytics (total issues, resolution rate) |
| GET | `/city?cityId=X` | Token | City-specific analytics |
| GET | `/heatmap?cityId=X` | Token | Geospatial heatmap data (lat, lng, count) |
| GET | `/comparison` | Token | Multi-city performance comparison |

**Example: State Analytics**
```bash
curl http://localhost:3000/api/analytics/state \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "totalIssues": 1523,
  "resolvedIssues": 892,
  "resolutionRate": 58.6,
  "avgResolutionTime": 72,
  "categoryDistribution": [
    { "category": "Roads", "count": 456 },
    { "category": "Water", "count": 298 }
  ]
}
```

---

### Locations (`/api/locations`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/states` | Public | - | Get all states |
| GET | `/states/:stateId/cities` | Public | - | Get cities in state |
| GET | `/cities/:cityId/areas` | Public | - | Get areas in city |
| POST | `/states` | Token | SUPERADMIN | Add new state |
| POST | `/cities` | Token | ADMIN | Add new city |
| POST | `/areas` | Token | ADMIN | Add new area |

**Example: Get Cities**
```bash
curl http://localhost:3000/api/locations/states/507f1f77bcf86cd799439011/cities
```

---

### Governance (`/api/governance`)

**⚠️ SUPERADMIN ONLY**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admins` | Get all admin users |
| PATCH | `/admin/:id` | Update admin permissions |
| PATCH | `/city/:id/toggle` | Enable/disable city |
| POST | `/category` | Add new issue category |

---

### Export (`/api/export`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/city/csv?cityId=X` | Token | ADMIN | Export city issues as CSV |
| GET | `/state/pdf` | Token | ADMIN | Generate state report PDF |

**Example: CSV Export**
```bash
curl http://localhost:3000/api/export/city/csv?cityId=123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output issues.csv
```

---

### Community (`/api/community`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/feed` | Get community feed posts |

---

### Users (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:id` | Get user profile |
| PATCH | `/:id` | Update user profile |
| DELETE | `/:id` | Delete user account |

---

## 🔐 Middleware

### Authentication (`auth.js`)

**⚠️ Currently uses MOCK JWT for development**

```javascript
verifyToken(req, res, next)
// Validates Authorization header (currently accepts any)
// Attaches req.user = { id, role, email }

requireRole(role)(req, res, next)
// Checks if req.user.role matches required role
// Example: requireRole('SUPERADMIN')
```

### Security Layers

- **Helmet.js**: Sets secure HTTP headers
- **CORS**: Allows cross-origin requests (configurable)
- **Rate Limiter**: Prevents abuse (configured in `rateLimiter.js`)
- **Error Handler**: Global error catching

---

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/civic-sense
MONGODB_TEST_URI=mongodb://localhost:27017/civic-sense-test

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT (for future implementation)
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880  # 5MB

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Socket.IO
SOCKET_PORT=3001
```

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/your-org/civic-sense-backend.git
cd civic-sense-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if local)
mongod --dbpath /path/to/data

# Start Redis (optional, for caching)
redis-server

# Run development server
npm run dev
```

---

## 🖥 Usage

### Development

```bash
npm run dev     # Start with nodemon (auto-restart)
```

### Production

```bash
npm start       # Start server
```

### Seeding Database

```bash
npm run seed    # Populate with sample data
```

---

## 🧪 Testing

```bash
npm test        # Run test suite (if available)
```

---

## 🔄 Real-time Updates

The backend uses **Socket.IO** for real-time notifications:

```javascript
// Server broadcasts issue updates
io.emit('issue:new', issueData);
io.emit('issue:statusChange', { issueId, newStatus });
```

**Connect from frontend:**
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

socket.on('issue:new', (data) => {
  console.log('New issue reported:', data);
});
```

---

## 📊 Performance Optimizations

1. **Geospatial Indexes**: 2dsphere on `Issue.location`
2. **Compound Indexes**: `cityId + status`, `categoryId + createdAt`
3. **Redis Caching**: (Configured but implementation TBD)
4. **Query Projection**: Only fetch required fields

---

## 🚧 Development Status

| Feature | Status |
|---------|--------|
| User Authentication | ✅ Working (mock JWT) |
| Issue CRUD | ✅ Complete |
| Analytics | ✅ Complete |
| Geospatial Queries | ✅ Complete |
| PDF Export | ✅ Complete |
| CSV Export | ✅ Complete |
| Real JWT | ⚠️ Pending |
| Unit Tests | ⚠️ Pending |
| API Documentation (Swagger) | ⚠️ Pending |

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📧 Support

For questions or issues, please contact: support@civicsense.gov
