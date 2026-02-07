# Civic Sense Backend

A backend foundation for a civic issue reporting analytics system.

## Tech Stack
- Node.js & Express
- MongoDB (Mongoose)
- Redis (ioredis)

## Project Structure
- `src/config`: Database and Redis configuration
- `src/models`: Mongoose models (Report, Admin)
- `src/middleware`: Auth and RBAC middleware
- `src/modules`: Modular logic (Analytics, Governance, Admin, Audit)
- `src/utils`: Utility scripts (Seeding)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Ensure `.env` matches your local setup:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/civic_sense
   REDIS_URI=redis://localhost:6379
   JWT_SECRET=super_secret_civic_key
   ```

3. **Run Database Seeds**
   Populate the database with 2000 fake reports:
   ```bash
   npm run seed
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

## API Endpoints (Testing)

- `GET /test-admin`: Requires ADMIN role (Mock auth enabled)
- `GET /test-superadmin`: Requires SUPERADMIN role
