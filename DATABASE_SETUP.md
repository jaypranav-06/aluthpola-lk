# PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL for the Aluthpola.lk e-commerce platform.

## Prerequisites

- PostgreSQL 12 or higher installed on your system
- Node.js and npm installed
- Terminal/Command line access

## Installation

### 1. Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from: https://www.postgresql.org/download/windows/

### 2. Create Database and User

Open PostgreSQL command line:
```bash
# macOS/Linux
psql postgres

# Or with specific user
sudo -u postgres psql
```

Create the database and user:
```sql
-- Create database
CREATE DATABASE aluthpola_db;

-- Create user (optional, if not using default postgres user)
CREATE USER aluthpola_user WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE aluthpola_db TO aluthpola_user;

-- Connect to the database
\c aluthpola_db

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO aluthpola_user;
```

### 3. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and update the database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aluthpola_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Run Database Schema

Execute the schema file to create all tables:
```bash
psql -U postgres -d aluthpola_db -f database/schema.sql
```

Or from within psql:
```sql
\c aluthpola_db
\i database/schema.sql
```

### 5. Verify Installation

Check that tables were created:
```sql
\c aluthpola_db
\dt
```

You should see all the tables listed:
- users
- addresses
- partners
- categories
- products
- product_images
- product_variants
- flash_sales
- orders
- order_items
- order_shipping_addresses
- order_status_history
- reviews
- carts
- cart_items
- wishlists

## Database Schema Overview

### User Roles
- **user**: Regular customer (default)
- **super_admin**: System administrator with full access

### Core Tables

#### `users`
Stores user account information including authentication details.

#### `products`
Main product catalog with pricing, inventory, and partner information.

#### `orders`
Customer orders with status tracking and payment information.

#### `categories`
Hierarchical product categorization.

#### `partners`
E-commerce partners (Amazon, Temu, AliExpress, local retailers).

## Seeding Sample Data (Optional)

Create a super admin user:
```sql
INSERT INTO users (name, email, password_hash, role, is_active, email_verified)
VALUES (
  'Admin User',
  'admin@aluthpola.lk',
  '$2a$10$XYZ...', -- Use bcrypt to hash 'admin123' or your password
  'super_admin',
  true,
  true
);
```

To hash a password for testing:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10, (err, hash) => console.log(hash));"
```

## Testing the Connection

Run the development server:
```bash
npm run dev
```

The application will attempt to connect to PostgreSQL on startup.

## Backup and Restore

### Create a backup
```bash
pg_dump -U postgres aluthpola_db > backup.sql
```

### Restore from backup
```bash
psql -U postgres aluthpola_db < backup.sql
```

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL is running:**
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

2. **Check PostgreSQL is listening:**
```bash
sudo netstat -plunt | grep postgres
```

3. **Verify credentials in `.env` file**

4. **Check PostgreSQL logs:**
```bash
# macOS
tail -f /usr/local/var/log/postgres.log

# Linux
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### Permission Issues

If you get permission errors:
```sql
\c aluthpola_db
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO aluthpola_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO aluthpola_user;
```

### Reset Database

To start fresh:
```sql
DROP DATABASE aluthpola_db;
CREATE DATABASE aluthpola_db;
\c aluthpola_db
\i database/schema.sql
```

## Production Considerations

1. **Use strong passwords** - Never use default passwords in production
2. **Enable SSL/TLS** - Configure PostgreSQL to use encrypted connections
3. **Regular backups** - Set up automated backup schedules
4. **Connection pooling** - Already configured in `src/lib/db.ts`
5. **Monitoring** - Set up monitoring for database performance
6. **Indexes** - Already included in schema for common queries
7. **Environment variables** - Use secure secret management in production

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Example Login Request
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@aluthpola.lk",
    "password": "admin123"
  }'
```

### Example Register Request
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

## Database Management Tools

### Recommended GUI Tools
- **pgAdmin** - https://www.pgadmin.org/
- **DBeaver** - https://dbeaver.io/
- **TablePlus** - https://tableplus.com/
- **DataGrip** - https://www.jetbrains.com/datagrip/

### Command Line Tools
- `psql` - PostgreSQL interactive terminal
- `pg_dump` - Database backup utility
- `pg_restore` - Database restore utility

## Support

For database-related issues:
1. Check the troubleshooting section above
2. Review PostgreSQL logs
3. Verify environment configuration
4. Test connection using `psql` directly

## Next Steps

After setting up the database:
1. Create a super admin account
2. Add some sample products and categories
3. Configure partners (Amazon, Temu, etc.)
4. Test the authentication flow
5. Verify the e-commerce functionality

## Database Maintenance

### Regular Tasks
- Monitor disk space usage
- Analyze query performance
- Update statistics: `ANALYZE;`
- Vacuum database: `VACUUM;`
- Check for dead tuples
- Review and optimize slow queries

### Monitoring Queries
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('aluthpola_db'));

-- Active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'aluthpola_db';

-- Slow queries (requires pg_stat_statements extension)
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```
