# Database Services Integration Guide

This guide shows how to integrate **any** PostgreSQL database service with Aluthpola.lk.

## ✅ What's Already Configured

The database connection (`src/lib/db.ts`) is **service-agnostic** and supports:
- ✅ **DATABASE_URL** (single connection string) - **Recommended for cloud services**
- ✅ **Individual variables** (DB_HOST, DB_PORT, etc.) - For local or custom setups
- ✅ **Automatic SSL** in production mode
- ✅ **Connection pooling** (max 20 connections)
- ✅ **Error handling** and retry logic
- ✅ **Transaction support**

## 🌐 Supported Database Services

### 1. Neon (Recommended - Free Tier Available) ⚡

**Why Neon?**
- Serverless PostgreSQL
- Generous free tier
- Auto-scaling
- Instant branching for dev/test

**Setup:**
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Update `.env`:

```env
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

### 2. Supabase (Recommended - All-in-One) 🚀

**Why Supabase?**
- PostgreSQL + Auth + Storage + Realtime
- Great free tier
- Built-in admin panel
- Instant APIs

**Setup:**
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection String
4. Update `.env`:

```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

Or use individual variables:
```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
```

---

### 3. Railway (Easy Deployment) 🚂

**Why Railway?**
- One-click PostgreSQL deployment
- Easy app + database deployment
- Good free tier
- GitHub integration

**Setup:**
1. Sign up at https://railway.app
2. Create new project → PostgreSQL
3. Copy the `DATABASE_URL` from variables
4. Update `.env`:

```env
DATABASE_URL=postgresql://postgres:password@containers-us-west-xx.railway.app:7431/railway
```

---

### 4. AWS RDS (Enterprise Grade) ☁️

**Why AWS RDS?**
- Fully managed
- High availability
- Automated backups
- Scalable

**Setup:**
1. Create RDS instance in AWS Console
2. Choose PostgreSQL engine
3. Configure security groups
4. Update `.env`:

```env
DB_HOST=your-db.xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=aluthpola_db
DB_USER=admin
DB_PASSWORD=your_password
```

---

### 5. DigitalOcean Managed Database 🌊

**Why DigitalOcean?**
- Simple pricing
- Great UI
- Automated backups
- Easy scaling

**Setup:**
1. Create Managed Database in DO
2. Get connection details
3. Update `.env`:

```env
DB_HOST=db-postgresql-nyc3-xxxxx.ondigitalocean.com
DB_PORT=25060
DB_NAME=defaultdb
DB_USER=doadmin
DB_PASSWORD=your_password
```

---

### 6. Vercel Postgres (If using Vercel) ▲

**Why Vercel Postgres?**
- Integrates with Vercel deployment
- Serverless
- Edge runtime compatible

**Setup:**
1. Add Vercel Postgres in your project dashboard
2. Automatic environment variables
3. Or update `.env`:

```env
POSTGRES_URL=postgres://default:xxxxx@ep-xxxxx.us-east-1.postgres.vercel-storage.com:5432/verceldb
```

---

### 7. Render (Simple & Free Tier) 🎨

**Why Render?**
- Free PostgreSQL tier
- Auto-backups
- Simple dashboard
- Fast setup

**Setup:**
1. Create PostgreSQL database on https://render.com
2. Copy connection details
3. Update `.env`:

```env
DATABASE_URL=postgres://user:password@dpg-xxxxx.oregon-postgres.render.com/dbname
```

---

### 8. Google Cloud SQL ☁️

**Why Google Cloud SQL?**
- Integrated with GCP
- High performance
- Automated maintenance

**Setup:**
1. Create Cloud SQL instance
2. Enable Cloud SQL Admin API
3. Update `.env`:

```env
DB_HOST=34.xxx.xxx.xxx
DB_PORT=5432
DB_NAME=aluthpola_db
DB_USER=postgres
DB_PASSWORD=your_password
```

---

### 9. Heroku Postgres (Legacy) 🟣

**Setup:**
1. Add Heroku Postgres addon
2. Get `DATABASE_URL` from config vars
3. Update `.env`:

```env
DATABASE_URL=postgres://user:password@ec2-xx.compute-1.amazonaws.com:5432/dbname
```

---

### 10. Local PostgreSQL (Development) 💻

**Setup:**
```bash
# Install
brew install postgresql@15  # macOS
sudo apt install postgresql  # Ubuntu

# Start
brew services start postgresql@15  # macOS
sudo systemctl start postgresql     # Ubuntu

# Create DB
createdb aluthpola_db
```

Update `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aluthpola_db
DB_USER=postgres
DB_PASSWORD=postgres
```

---

## 🔧 Integration Steps (Any Service)

### Step 1: Choose Your Configuration Method

**Option A: Using DATABASE_URL** (Recommended)
```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

**Option B: Using Individual Variables**
```env
DB_HOST=your-host
DB_PORT=5432
DB_NAME=your-database
DB_USER=your-user
DB_PASSWORD=your-password
```

### Step 2: Run Database Schema

Execute the schema to create tables:

**Using psql:**
```bash
psql $DATABASE_URL -f database/schema.sql
```

**Or with connection string:**
```bash
psql "postgresql://user:pass@host:port/db" -f database/schema.sql
```

**Or from your database service's SQL editor:**
Copy contents of `database/schema.sql` and run it.

### Step 3: Create Super Admin (Optional)

```bash
# Generate password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10, (err, hash) => console.log(hash));"

# Run in your database (psql or service SQL editor)
INSERT INTO users (name, email, password_hash, role, is_active, email_verified)
VALUES ('Admin', 'admin@aluthpola.lk', 'YOUR_HASH_HERE', 'super_admin', true, true);
```

### Step 4: Test Connection

```bash
npm run dev
```

Check console for database connection messages.

---

## 🔒 Security Best Practices

### Production Checklist:
- ✅ Use strong, unique passwords
- ✅ Enable SSL/TLS (automatic in production)
- ✅ Use environment variables (never hardcode credentials)
- ✅ Restrict database access by IP (whitelist your app servers)
- ✅ Enable automated backups
- ✅ Set up monitoring and alerts
- ✅ Use separate databases for dev/staging/production
- ✅ Rotate credentials regularly

### Environment Variables Security:
```bash
# Production: Use secret management
# - Vercel: Environment Variables
# - Railway: Variables
# - AWS: AWS Secrets Manager
# - DigitalOcean: App Platform Env Vars
```

---

## 🧪 Testing Database Connection

Create a test script:

```typescript
// test-db.ts
import { checkConnection, query } from './src/lib/db';

async function testDatabase() {
  console.log('Testing database connection...');

  const isConnected = await checkConnection();
  console.log('Connected:', isConnected);

  if (isConnected) {
    const result = await query('SELECT COUNT(*) FROM users');
    console.log('Users count:', result.rows[0].count);
  }
}

testDatabase();
```

Run: `npx tsx test-db.ts`

---

## 📊 Database Service Comparison

| Service | Free Tier | Scaling | Ease | Best For |
|---------|-----------|---------|------|----------|
| **Neon** | ✅ 10GB | Auto | ⭐⭐⭐⭐⭐ | Serverless apps |
| **Supabase** | ✅ 500MB | Manual | ⭐⭐⭐⭐⭐ | Full-stack apps |
| **Railway** | ✅ $5 credit | Manual | ⭐⭐⭐⭐⭐ | Quick deployment |
| **Render** | ✅ 90 days | Manual | ⭐⭐⭐⭐ | Small projects |
| **AWS RDS** | ❌ (12mo trial) | Auto | ⭐⭐⭐ | Enterprise |
| **DigitalOcean** | ❌ | Manual | ⭐⭐⭐⭐ | Medium projects |
| **Local** | ✅ | N/A | ⭐⭐⭐ | Development |

---

## 🚨 Troubleshooting

### Connection Refused
```bash
# Check if DB is running
# Check firewall/security groups
# Verify host and port in .env
```

### SSL/TLS Errors
```env
# Add to connection string
?sslmode=require

# Or disable for local dev
?sslmode=disable
```

### Authentication Failed
```bash
# Verify username and password
# Check user has correct permissions
# Ensure user can connect from your IP
```

### Timeout Errors
```typescript
// Increase timeout in src/lib/db.ts
connectionTimeoutMillis: 10000, // 10 seconds
```

---

## 📝 Migration Tips

### Moving Between Services:

1. **Backup current database:**
```bash
pg_dump $OLD_DATABASE_URL > backup.sql
```

2. **Restore to new service:**
```bash
psql $NEW_DATABASE_URL < backup.sql
```

3. **Update .env with new credentials**

4. **Test connection**

---

## 🎯 Recommended Setup by Environment

### Development:
- **Local PostgreSQL** or **Neon Free Tier**
- Easy setup, fast iteration

### Staging:
- **Railway** or **Render**
- Separate from production, easy to reset

### Production:
- **Neon** (serverless), **Supabase** (features), or **AWS RDS** (enterprise)
- Automated backups, monitoring, scaling

---

## 💡 Quick Start Examples

### Neon (Fastest)
```bash
# 1. Sign up at neon.tech
# 2. Create project, copy DATABASE_URL
# 3. Add to .env
echo "DATABASE_URL=postgresql://..." >> .env
# 4. Run schema
psql $DATABASE_URL -f database/schema.sql
# 5. Start app
npm run dev
```

### Supabase (Feature-Rich)
```bash
# 1. Sign up at supabase.com
# 2. Create project
# 3. Copy connection string from Settings
# 4. Add to .env
echo "DATABASE_URL=postgresql://..." >> .env
# 5. Use Supabase SQL Editor to run database/schema.sql
# 6. Start app
npm run dev
```

---

## ✅ You're All Set!

Your application is now ready to connect to **any PostgreSQL database service**. Simply:
1. Choose your service
2. Update `.env` with credentials
3. Run the schema
4. Start your app

No code changes needed! 🎉
