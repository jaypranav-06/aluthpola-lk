# PostgreSQL Setup Summary

## ✅ What's Been Completed

### 1. Database Setup
- ✅ Removed Prisma ORM (switched to direct PostgreSQL)
- ✅ Installed `pg` (node-postgres) library
- ✅ Created comprehensive database schema (`database/schema.sql`)
- ✅ Configured environment variables (`.env`)

### 2. Database Schema
The schema includes:
- **User Management**: Users, addresses, roles (user, super_admin)
- **Products**: Products, variants, images, categories
- **Orders**: Orders, order items, shipping addresses, status history
- **E-commerce**: Partners, flash sales, carts, wishlists, reviews
- **Automatic timestamps** with triggers
- **Proper indexes** for performance

### 3. Authentication System
- ✅ Login API: `/api/auth/login`
- ✅ Registration API: `/api/auth/register`
- ✅ Password hashing with bcrypt
- ✅ Role-based authentication (user & super_admin)
- ✅ Login page UI at `/login`

### 4. Utilities & Helpers
- ✅ Database connection pool (`src/lib/db.ts`)
- ✅ Authentication utilities (`src/lib/auth-utils.ts`)
- ✅ TypeScript type definitions with UserRole enum

### 5. Documentation
- ✅ Complete setup guide (`DATABASE_SETUP.md`)
- ✅ Authentication documentation (`AUTH_SETUP.md`)
- ✅ Environment example file (`.env.example`)

## 🚀 Quick Start

### Step 1: Install PostgreSQL
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
```

### Step 2: Create Database
```bash
psql postgres
```
```sql
CREATE DATABASE aluthpola_db;
\c aluthpola_db
\i database/schema.sql
\q
```

### Step 3: Configure Environment
Edit `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aluthpola_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### Step 4: Create Super Admin (Optional)
```bash
# Generate password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10, (err, hash) => console.log(hash));"

# Copy the hash and run in psql:
```
```sql
INSERT INTO users (name, email, password_hash, role, is_active, email_verified)
VALUES ('Admin', 'admin@aluthpola.lk', 'PASTE_HASH_HERE', 'super_admin', true, true);
```

### Step 5: Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3001/login

## 📁 File Structure

```
web/
├── database/
│   └── schema.sql                  # PostgreSQL database schema
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx        # Login page
│   │   └── api/
│   │       └── auth/
│   │           ├── login/
│   │           │   └── route.ts    # Login API endpoint
│   │           └── register/
│   │               └── route.ts    # Register API endpoint
│   ├── lib/
│   │   ├── db.ts                   # PostgreSQL connection pool
│   │   └── auth-utils.ts           # Authentication helpers
│   └── types/
│       └── index.ts                # TypeScript definitions
├── .env                            # Environment variables (git-ignored)
├── .env.example                    # Environment template
├── DATABASE_SETUP.md               # Detailed setup guide
└── AUTH_SETUP.md                   # Authentication guide
```

## 🔌 API Endpoints

### POST /api/auth/login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin@aluthpola.lk", "password": "admin123"}'
```

### POST /api/auth/register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+94771234567"
  }'
```

## 🎯 Current Features

### Authentication
- ✅ User registration with email validation
- ✅ Secure password hashing (bcrypt)
- ✅ Role-based access (user, super_admin)
- ✅ Login tracking (last_login timestamp)
- ✅ Account status (active/inactive)

### Database Features
- ✅ UUID primary keys
- ✅ Automatic timestamps (created_at, updated_at)
- ✅ Foreign key relationships
- ✅ Enums for status types
- ✅ Indexed columns for performance
- ✅ Transaction support

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- SQL injection protection via parameterized queries
- Input validation on API endpoints
- Role-based access control
- Active/inactive user status
- Email verification flag (for future implementation)

## 📝 User Roles

### Current Roles:
1. **user** - Regular customer
   - Can browse products
   - Can place orders
   - Can manage own profile
   - Redirects to: `/profile`

2. **super_admin** - System administrator
   - Full system access
   - Can manage users, products, orders
   - Redirects to: `/admin/dashboard`

### Future Roles (Planned):
- Vendor
- Moderator
- Support Staff

## 🛠️ Development Tools

### Database GUI Tools
- pgAdmin: https://www.pgadmin.org/
- DBeaver: https://dbeaver.io/
- TablePlus: https://tableplus.com/

### Useful Commands

```bash
# Check database connection
psql -U postgres -d aluthpola_db -c "SELECT NOW();"

# List all tables
psql -U postgres -d aluthpola_db -c "\dt"

# View users
psql -U postgres -d aluthpola_db -c "SELECT * FROM users;"

# Database backup
pg_dump -U postgres aluthpola_db > backup.sql

# Restore database
psql -U postgres aluthpola_db < backup.sql
```

## 🚧 Next Steps

1. **Set up your PostgreSQL database** (see DATABASE_SETUP.md)
2. **Configure .env file** with your credentials
3. **Run the schema** to create tables
4. **Create a super admin account**
5. **Test authentication** via login page
6. **Start adding products** and categories
7. **Implement remaining features** (cart, checkout, etc.)

## ⚠️ Important Notes

- The `.env` file is git-ignored for security
- Never commit database credentials to version control
- Use strong passwords in production
- Enable SSL for PostgreSQL in production
- Set up regular database backups

## 📚 Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- node-postgres (pg) Documentation: https://node-postgres.com/
- bcrypt Documentation: https://github.com/kelektiv/node.bcrypt.js

## 🆘 Need Help?

See detailed documentation in:
- `DATABASE_SETUP.md` - Complete database setup guide
- `AUTH_SETUP.md` - Authentication system guide

For issues, check the troubleshooting sections in these documents.
