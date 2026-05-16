# Aluthpola.lk - Login Credentials

## 🔐 Test Accounts

### Super Admin (Full System Access)
```
Email:    admin@aluthpola.lk
Password: admin123
Role:     super_admin
Redirect: /admin/dashboard
```

### Regular User
```
Email:    user@aluthpola.lk
Password: user123
Role:     user
Redirect: /profile
```

## 🌐 Login Page
http://localhost:3001/login

## 📋 Database Setup

### Quick Setup (3 Steps):

1. **Create Database:**
```bash
psql postgres
CREATE DATABASE aluthpola_db;
\c aluthpola_db
\q
```

2. **Run Schema:**
```bash
psql -d aluthpola_db -f database/schema.sql
```

3. **Insert Test Users:**
```bash
psql -d aluthpola_db -f database/seed-users.sql
```

### Or Run All in One Command:
```bash
psql postgres -c "CREATE DATABASE aluthpola_db;" && \
psql -d aluthpola_db -f database/schema.sql && \
psql -d aluthpola_db -f database/seed-users.sql
```

## 🧪 Testing Login

### Using the UI:
1. Visit http://localhost:3001/login
2. Enter one of the credentials above
3. Click "Sign In"

### Using curl (API):

**Super Admin Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@aluthpola.lk",
    "password": "admin123"
  }'
```

**Regular User Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user@aluthpola.lk",
    "password": "user123"
  }'
```

## 🔄 Regenerate Credentials

If you need to regenerate the credentials with new passwords:

```bash
node scripts/create-users.js
```

This will output new SQL statements with freshly hashed passwords.

## 🚨 Security Note

**⚠️ IMPORTANT:** These are **test credentials** for development only.

**For Production:**
1. Change all passwords immediately
2. Use strong, unique passwords
3. Enable 2FA (when implemented)
4. Never commit credentials to git
5. Use environment variables for secrets
6. Implement password reset functionality

## 📝 User Roles Explained

### `user` (Regular Customer)
- Browse and search products
- Add items to cart
- Place orders
- View order history
- Manage profile and addresses
- Write product reviews

### `super_admin` (System Administrator)
- All user permissions PLUS:
- Manage all users
- Manage products and inventory
- Process and manage orders
- View analytics and reports
- Configure system settings
- Manage partners (Amazon, Temu, etc.)

## 🔑 Login Flow

1. User enters email/username and password
2. System validates credentials against PostgreSQL database
3. Password is compared using bcrypt
4. If valid, user data is returned (role-based)
5. Client stores user info in localStorage
6. User is redirected based on role:
   - `super_admin` → `/admin/dashboard`
   - `user` → `/profile`

## 💾 Current Storage Method

**Development:** localStorage (temporary)
**Production:** Will use JWT tokens + HTTP-only cookies

## 📚 Related Documentation

- Complete setup guide: `DATABASE_SETUP.md`
- Authentication details: `AUTH_SETUP.md`
- Database services: `DATABASE_SERVICES_INTEGRATION.md`
