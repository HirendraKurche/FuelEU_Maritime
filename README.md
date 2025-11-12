# FuelEU Maritime — Compliance Platform

## 🎯 Overview

A production-grade web application for managing FuelEU Maritime compliance, implementing emissions tracking, baseline comparison, banking operations, and pooling mechanisms. Built with clean hexagonal architecture following Domain-Driven Design principles.

**Key Features:**
- ✅ Route emissions management with filtering
- ✅ Baseline comparison with visual charts
- ✅ Banking surplus/deficit operations
- ✅ Compliance pooling with validation rules
- ✅ Real-time compliance balance calculations
- ✅ Full TypeScript type safety

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + TailwindCSS + Shadcn UI
- **Backend:** Node.js + Express + TypeScript + PostgreSQL
- **Architecture:** Hexagonal (Ports & Adapters / Clean Architecture)
- **Testing:** Vitest (45 tests, 100% passing)

---

## 🏗️ Architecture Summary (Hexagonal Structure)

This application follows **Clean Hexagonal Architecture** with strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        ADAPTERS (UI)                        │
│  React Components → User Interface Layer                    │
│  (client/src/components, client/src/pages)                  │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  Use Cases → Business Operations                            │
│  (client/src/core/application)                              │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN CORE                             │
│  Entities + Business Logic (Pure TypeScript)                │
│  (shared/schema.ts, client/src/core/domain)                 │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│                   PORTS (Interfaces)                         │
│  Repository Contracts                                        │
│  (client/src/core/ports)                                    │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│              ADAPTERS (Infrastructure)                       │
│  HTTP Client → API Integration                              │
│  (client/src/adapters/http*.ts)                             │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│                    REST API LAYER                            │
│  Express Routes + Validation                                 │
│  (server/routes.ts)                                         │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│                  DATA ACCESS LAYER                           │
│  PostgreSQL Repository (Drizzle ORM)                        │
│  (server/storage.ts, server/db.ts)                          │
└─────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
/client (Frontend)
├── /src
│   ├── /core                    # Domain & Application
│   │   ├── /domain              # → Entities, Types
│   │   ├── /application         # → Use Cases
│   │   ├── /ports              # → Repository Interfaces
│   │   └── /services            # → Business Logic
│   ├── /adapters                # Infrastructure
│   │   ├── httpRouteRepository.ts
│   │   └── httpComplianceRepository.ts
│   ├── /components              # UI Components
│   ├── /pages                   # Route Pages
│   └── /lib                     # Utilities

/server (Backend)
├── routes.ts                    # HTTP Adapters (API)
├── storage.ts                   # PostgreSQL Adapter
├── db.ts                        # Database Connection
└── seed.ts                      # Test Data

/shared
└── schema.ts                    # Domain Models (Shared)
```

### Domain Logic

**Core Compliance Formula:**
```typescript
TARGET_2025 = 89.3368 gCO₂e/MJ  // 2% below baseline (91.16)
ENERGY_CONVERSION = 41,000 MJ/t  // Energy per tonne fuel

// Compliance Balance Calculation
energyInScope = fuelConsumption × 41,000
complianceBalance = (TARGET - actualGHG) × energyInScope

// Positive CB = Surplus (can be banked)
// Negative CB = Deficit (requires banking or pooling)
```

---

## � Setup & Run Instructions

### Prerequisites
- Node.js 20+ 
- PostgreSQL database (or use Neon cloud)
- npm or yarn package manager

### Step 1: Clone Repository
```bash
git clone https://github.com/HirendraKurche/Varuna-Marine-Assisgnment.git
cd Varuna-Marine-Assisgnment
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@host:5432/database
SESSION_SECRET=your-random-secret-key-here
```

**For Neon (Cloud PostgreSQL):**
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 4: Database Setup
```bash
# Push schema to database
npm run db:push

# Seed test data (5 routes + compliance data)
npm run db:seed
```

### Step 5: Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
Server listening on port 5000
Frontend dev server running
```

Open browser: **http://localhost:5000**

---

## 🧪 How to Execute Tests

### Run All Tests
```bash
npm run test
```

**Expected Output:**
```
Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Time:        ~3s
```

### Test Files
- **`test/formulas.test.ts`** - Compliance formula validation (13 tests)
- **`server/storage.test.ts`** - Database operations (13 tests)
- **`server/routes.test.ts`** - API integration tests (19 tests)

### Run Tests in Watch Mode
```bash
npm run test -- --watch
```

### Test Coverage
```bash
npm run test -- --coverage
```

---

## 📸 Screenshots & Sample Requests/Responses

### 1. Routes Management Tab
**Features:**
- View all routes with emissions data
- Filter by vessel type, fuel type, year
- Set baseline route for comparison

**Sample Request:**
```bash
GET http://localhost:5000/api/routes?vesselType=Container&year=2024
```

**Sample Response:**
```json
[
  {
    "id": "uuid",
    "routeId": "R001",
    "vesselType": "Container",
    "fuelType": "HFO",
    "year": 2024,
    "ghgIntensity": 91.00,
    "fuelConsumption": 5000,
    "distance": 12000,
    "totalEmissions": 4500,
    "isBaseline": true
  }
]
```

---

### 2. Compliance Comparison Tab
**Features:**
- Compare routes against baseline
- Visual bar chart showing GHG intensity
- Compliance status indicators (✅/❌)
- Target threshold: 89.3368 gCO₂e/MJ

**Sample Request:**
```bash
GET http://localhost:5000/api/routes/comparison
```

**Sample Response:**
```json
[
  {
    "routeId": "R003",
    "vesselType": "Tanker",
    "fuelType": "MGO",
    "year": 2024,
    "ghgIntensity": 93.50,
    "baselineGhgIntensity": 91.00,
    "percentDiff": 2.75,
    "isCompliant": false,
    "target": 89.3368
  },
  {
    "routeId": "R002",
    "vesselType": "BulkCarrier",
    "fuelType": "LNG",
    "year": 2024,
    "ghgIntensity": 88.00,
    "baselineGhgIntensity": 91.00,
    "percentDiff": -3.30,
    "isCompliant": true,
    "target": 89.3368
  }
]
```

---

### 3. Banking Operations Tab
**Features:**
- Bank positive compliance balance
- Apply banked credits to deficits
- View current and adjusted CB

**Sample Request - Bank Surplus:**
```bash
POST http://localhost:5000/api/banking/bank
Content-Type: application/json

{
  "shipId": "R002",
  "year": 2024,
  "amount": 50000
}
```

**Sample Response:**
```json
{
  "id": "uuid",
  "shipId": "R002",
  "year": 2024,
  "amount_gco2eq": 50000
}
```

**Sample Request - Apply Banked:**
```bash
POST http://localhost:5000/api/banking/apply
Content-Type: application/json

{
  "shipId": "R001",
  "year": 2024,
  "amount": 30000
}
```

---

### 4. Pooling Management Tab
**Features:**
- Create compliance pools
- Multi-ship balance redistribution
- Validation rules enforcement

**Sample Request:**
```bash
POST http://localhost:5000/api/pools
Content-Type: application/json

{
  "year": 2025,
  "members": [
    {
      "shipId": "R001",
      "cbBefore": -50000,
      "cbAfter": 0
    },
    {
      "shipId": "R002",
      "cbBefore": 60000,
      "cbAfter": 10000
    }
  ]
}
```

**Sample Response:**
```json
{
  "poolId": "uuid",
  "year": 2025,
  "members": [
    {
      "shipId": "R001",
      "cbBefore": -50000,
      "cbAfter": 0
    },
    {
      "shipId": "R002",
      "cbBefore": 60000,
      "cbAfter": 10000
    }
  ],
  "poolSum": 10000,
  "isValid": true
}
```

**Validation Rules:**
1. Pool sum (Σ cbAfter) ≥ 0
2. Minimum 2 ships per pool
3. Deficit ships cannot exit worse: `cbAfter >= cbBefore` (for negative CB)
4. Surplus ships cannot exit negative: `cbAfter >= 0` (for positive CB)

---

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

## � Screenshots

### Routes Management
View and filter maritime routes with emissions data. Set baseline for comparison.

### Compliance Comparison
Visual charts and tables comparing routes against baseline with compliance indicators.

### Banking Operations
Bank surplus compliance balance or apply previously banked credits to deficits.

### Pooling Management
Create compliance pools with multi-ship balance redistribution and validation.

## 🧪 Testing

### Running Tests
```bash
npm run test
```

**Test Coverage:**
- ✅ 45/45 tests passing (100% success rate)
- ✅ 13 formula validation tests
- ✅ 13 storage layer tests
- ✅ 19 API integration tests

**Test Files:**
- `test/formulas.test.ts` - Core formula validation
- `server/storage.test.ts` - Database operations
- `server/routes.test.ts` - API endpoint integration

## 📚 Additional Documentation

- **`AGENT_WORKFLOW.md`** - Detailed AI-assisted development process
- **`REFLECTION.md`** - Lessons learned and insights
- **`DATABASE_SETUP.md`** - Database configuration guide
- **`FEATURE_IMPLEMENTATION_CHECKLIST.md`** - Complete feature audit
- **`PROJECT_COMPLETION_SUMMARY.md`** - Assignment requirements mapping

## �📝 License

MIT License - See LICENSE file for details

## 👥 Contributors

Built with AI assistance (Claude, Cursor, GitHub Copilot) - See AGENT_WORKFLOW.md for details

---

## 🎓 Assignment Completion

**Status:** ✅ **COMPLETE - READY FOR SUBMISSION**

This project fulfills all requirements of the FuelEU Maritime Compliance Platform assignment:
- ✅ Complete frontend (4 tabs) with React + TypeScript + TailwindCSS
- ✅ Complete backend (8 API endpoints) with Node.js + PostgreSQL
- ✅ Hexagonal architecture (Ports & Adapters pattern)
- ✅ Comprehensive testing (45 tests passing)
- ✅ AI agent documentation (AGENT_WORKFLOW.md, REFLECTION.md)
- ✅ Production-grade code quality

See `PROJECT_COMPLETION_SUMMARY.md` for detailed completion audit.

---

**Note:** This is a demonstration/assignment project for FuelEU Maritime compliance. For production use, additional security, authentication, and compliance measures would be required.
