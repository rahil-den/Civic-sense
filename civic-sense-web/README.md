# CivicSense Dashboard

A government-grade civic operations dashboard built with React, TypeScript, and Tailwind CSS.

## Features

- **Admin Dashboard**: Real-time issue tracking, KPI monitoring, and issue resolution management.
- **Superadmin Dashboard**: State-wide analytics, hierarchical filtering, and geo-spatial intelligence.
- **Role-Based Access Control**: Secure routing for verified Admins and Superadmins.
- **Interactive Maps**: Heatmaps and marker clusters for issue visualization.
- **Modern UI**: Built with shadcn/ui components, featuring a clean, accessible, and professional design.

## Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Redux Toolkit + RTK Query
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Animations**: Tailwind Animate

## Getting Started

1.  **Install Dependencies** (if not already done):
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Access the App**:
    -   Admin Dashboard: `http://localhost:5173/admin`
    -   Superadmin Dashboard: `http://localhost:5173/superadmin`

    *Note: The current mock authentication defaults to the `admin` role. To view Superadmin features, update `src/features/auth/authSlice.ts` to set the role to `superadmin`.*

## Project Structure

-   `src/features`: core business logic (dashboard, issues, analytics).
-   `src/components/ui`: Reusable UI components.
-   `src/layouts`: Dashboard and page layouts.
-   `src/services`: API slice and configuration.

## Troubleshooting

-   **Tailwind/PostCSS Errors**: If you encounter `Cannot find module 'tailwindcss'`, ensure dependencies are installed (`npm install -D tailwindcss postcss autoprefixer`) and restart the dev server.
