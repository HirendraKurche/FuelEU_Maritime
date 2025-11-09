# FuelEU Maritime — Compliance Platform

A production-grade web application for managing FuelEU Maritime compliance, implementing emissions tracking, baseline comparison, banking operations, and pooling mechanisms.

## 🎯 Overview

This platform provides a complete solution for maritime compliance management under FuelEU regulations. It calculates route emissions, compliance balance (CB), and enables banking and pooling of emissions credits.

## 🏗️ Architecture

The application follows **Clean Hexagonal Architecture** (Ports & Adapters) with clear separation of concerns:

```
/client (Frontend)
├── /src
│   ├── /components      # Reusable UI components
│   ├── /pages          # Route pages (Routes, Compare, Banking, Pooling)
│   └── /lib            # Query client configuration

/server (Backend)
├── routes.ts           # HTTP adapters (API endpoints)
├── storage.ts          # PostgreSQL adapter (data persistence)
└── db.ts              # Database connection

/shared
└── schema.ts          # Domain models & DTOs (shared types)
```

### Domain Logic

**Core Formula:**
```
Target Intensity (2025) = 89.3368 gCO₂e/MJ (2% below 91.16)
Energy in Scope (MJ) = fuelConsumption × 41,000
Compliance Balance (CB) = (Target − Actual) × EnergyInScope
```

- **Positive CB** = Surplus (can be banked)
- **Negative CB** = Deficit (requires banking or pooling)

## 🚀 Tech Stack

**Frontend:**
- React 18 with TypeScript
- TailwindCSS + Shadcn UI components
- TanStack Query (data fetching)
- Recharts (data visualization)
- Wouter (routing)

**Backend:**
- Node.js with TypeScript
- Express.js
- PostgreSQL (via Neon)
- Drizzle ORM
- Zod (validation)

## 📦 Installation & Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file with:
```
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
```

3. **Push database schema:**
```bash
npm run db:push
```

4. **Seed the database:**
```bash
tsx server/seed.ts
```

5. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/routes` | GET | Fetch all routes (supports filters: vesselType, fuelType, year) |
| `/api/routes/:routeId/baseline` | POST | Mark a route as baseline |
| `/api/routes/comparison` | GET | Get baseline vs actual comparison data |
| `/api/compliance/cb` | GET | Get compliance balance (query param: year) |
| `/api/compliance/adjusted-cb` | GET | Get adjusted CB for pooling (query param: year) |
| `/api/banking/bank` | POST | Bank surplus CB (body: { shipId, year, amount }) |
| `/api/banking/apply` | POST | Apply banked surplus (body: { shipId, year, amount }) |
| `/api/pools` | POST | Create compliance pool (body: { year, members[] }) |

### Example API Calls

**Get Routes:**
```bash
curl http://localhost:5000/api/routes?vesselType=Container&year=2024
```

**Set Baseline:**
```bash
curl -X POST http://localhost:5000/api/routes/R001/baseline
```

**Bank Surplus:**
```bash
curl -X POST http://localhost:5000/api/banking/bank \
  -H "Content-Type: application/json" \
  -d '{"shipId":"SHIP001","year":2025,"amount":500}'
```

## 🧪 Database Schema

### Tables

**routes**
- `id` (varchar, PK)
- `route_id` (text, unique)
- `vessel_type` (text)
- `fuel_type` (text)
- `year` (integer)
- `ghg_intensity` (real)
- `fuel_consumption` (real)
- `distance` (real)
- `total_emissions` (real)
- `is_baseline` (boolean)

**ship_compliance**
- `id` (varchar, PK)
- `ship_id` (text)
- `year` (integer)
- `cb_gco2eq` (real)

**bank_entries**
- `id` (varchar, PK)
- `ship_id` (text)
- `year` (integer)
- `amount_gco2eq` (real)

**pools**
- `id` (varchar, PK)
- `year` (integer)
- `created_at` (timestamp)

**pool_members**
- `id` (varchar, PK)
- `pool_id` (varchar, FK)
- `ship_id` (text)
- `cb_before` (real)
- `cb_after` (real)

## 🎨 Features

### 1. Routes Management
- View all maritime routes with emissions data
- Filter by vessel type, fuel type, and year
- Set baseline route for comparison

### 2. Compliance Comparison
- Compare routes against baseline
- Visual charts showing GHG intensity
- Compliance status indicators
- Target threshold validation

### 3. Banking Operations
- Bank surplus compliance balance
- Apply previously banked credits
- View banking history
- Year-based filtering

### 4. Pooling Management
- Create compliance pools
- Multi-ship balance redistribution
- Validation rules enforcement:
  - Pool sum must be ≥ 0
  - Deficit ships cannot exit worse
  - Surplus ships cannot exit negative
  - Minimum 2 ships per pool

## 🧩 Component Architecture

### Reusable Components
- `KPICard` - Key performance indicator display
- `StatusBadge` - Compliance status indicator
- `FilterPanel` - Multi-filter selection
- `RoutesTable` - Routes data table
- `ComparisonTable` - Comparison data display
- `ComparisonChart` - Visual GHG comparison
- `BankingPanel` - Banking operations UI
- `PoolingPanel` - Pool creation and management

## 📖 Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- Zod schemas for validation
- Shared types between frontend/backend
- Clean separation of concerns

### State Management
- TanStack Query for server state
- React state for UI state
- Optimistic updates with cache invalidation

### Styling
- Tailwind utility classes
- Shadcn UI component library
- Dark mode support (via CSS variables)
- Responsive design (mobile-first)

## 🔧 Troubleshooting

**Database connection issues:**
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Re-push schema
npm run db:push --force
```

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contributors

Built with AI assistance (Claude, Cursor, GitHub Copilot) - See AGENT_WORKFLOW.md for details

---

**Note:** This is a demonstration/assignment project for FuelEU Maritime compliance. For production use, additional security, testing, and compliance measures would be required.
