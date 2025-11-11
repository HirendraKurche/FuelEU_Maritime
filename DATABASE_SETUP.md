# Database Setup Guide

This project uses **PostgreSQL** with **Neon** (serverless PostgreSQL) and **Drizzle ORM**.

## Option 1: Neon PostgreSQL (Recommended - Free & Serverless)

### Step 1: Create a Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub, Google, or Email
3. Click **"Create a project"**
4. Choose a name for your project (e.g., "varuna-marine")
5. Select a region close to you
6. Click **"Create project"**

### Step 2: Get Your Connection String

1. After project creation, you'll see a connection string
2. Copy the **"Pooled connection"** string (starts with `postgresql://`)
3. It looks like:
   ```
   postgresql://username:password@ep-xyz-123.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the `DATABASE_URL` with your actual connection string:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xyz-123.region.aws.neon.tech/neondb?sslmode=require
   NODE_ENV=development
   ```

### Step 4: Push Database Schema

Run the following command to create all tables in your database:

```bash
npm run db:push
```

This will create the following tables:
- `routes` - Vessel route data with GHG intensity
- `ship_compliance` - Compliance balance records
- `bank_entries` - Banking surplus records
- `pools` - Pool registry
- `pool_members` - Pool member allocations

### Step 5: Seed Initial Data (Optional)

If you have a seed script:

```bash
npm run seed
```

Or manually insert the test data from the assignment.

---

## Option 2: Local PostgreSQL

### Step 1: Install PostgreSQL

**Windows:**
1. Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Install PostgreSQL (default port: 5432)
3. Remember your postgres user password

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

Open PostgreSQL command line:

```bash
# Windows
psql -U postgres

# macOS/Linux
sudo -u postgres psql
```

Create database:
```sql
CREATE DATABASE varuna_marine;
\q
```

### Step 3: Configure Environment Variables

Update `.env` with local connection string:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/varuna_marine
NODE_ENV=development
```

### Step 4: Push Schema

```bash
npm run db:push
```

---

## Option 3: Docker PostgreSQL

### Step 1: Create docker-compose.yml

Create a file `docker-compose.yml` in project root:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: varuna_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: varuna_marine
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Step 2: Start Database

```bash
docker-compose up -d
```

### Step 3: Configure Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/varuna_marine
NODE_ENV=development
```

### Step 4: Push Schema

```bash
npm run db:push
```

---

## Verification

Test your database connection:

```bash
npm run dev
```

If everything is configured correctly, you should see:
```
serving on port 5000
```

If you see an error about `DATABASE_URL`, check:
1. `.env` file exists in project root
2. `DATABASE_URL` is correctly set
3. Database is running and accessible

---

## Database Schema Overview

### Routes Table
- Stores vessel route information
- Includes GHG intensity, fuel consumption, distance
- One route can be marked as baseline

### Ship Compliance Table
- Stores computed Compliance Balance (CB) per ship per year
- CB = (Target - Actual) × Energy in scope

### Bank Entries Table
- Records banked surplus from positive CB
- Allows ships to apply banked amounts to future deficits

### Pools Table
- Registry of pooling arrangements between ships
- Tracks year and creation timestamp

### Pool Members Table
- Links ships to pools
- Stores CB before and after pooling allocation

---

## Troubleshooting

### Error: "DATABASE_URL must be set"
- Ensure `.env` file exists in project root
- Check that `DATABASE_URL` is properly set
- Restart the dev server after adding `.env`

### Error: "Connection refused"
- Ensure PostgreSQL is running
- Check connection string host/port
- For Neon: Check internet connection

### Error: "relation does not exist"
- Run `npm run db:push` to create tables
- Verify connection to correct database

### Error: "password authentication failed"
- Verify username and password in connection string
- For local PostgreSQL, reset password if needed

---

## Next Steps

After successful database setup:

1. ✅ Database is running
2. ✅ Tables are created
3. Run `npm run dev` to start the application
4. Access the application at `http://localhost:5000`
5. Use API endpoints to interact with the database

---

## Useful Commands

```bash
# Push schema changes to database
npm run db:push

# Start development server
npm run dev

# Run type checking
npm run check

# Build for production
npm run build
```
