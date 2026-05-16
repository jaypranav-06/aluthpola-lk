const bcrypt = require('bcryptjs');

/**
 * Generate user credentials for Aluthpola.lk
 * Run this script to get SQL statements for creating users
 */

async function generateUsers() {
  console.log('\n🔐 Generating User Credentials for Aluthpola.lk\n');
  console.log('=' .repeat(60));

  // Super Admin credentials
  const adminPassword = 'admin123';
  const adminHash = await bcrypt.hash(adminPassword, 10);

  console.log('\n✅ SUPER ADMIN ACCOUNT');
  console.log('-' .repeat(60));
  console.log('Username: admin@aluthpola.lk');
  console.log('Password: admin123');
  console.log('Role: super_admin');
  console.log('\nSQL to insert:');
  console.log(`
INSERT INTO users (name, email, password_hash, role, is_active, email_verified)
VALUES (
  'Super Admin',
  'admin@aluthpola.lk',
  '${adminHash}',
  'super_admin',
  true,
  true
);
  `);

  // Regular User credentials
  const userPassword = 'user123';
  const userHash = await bcrypt.hash(userPassword, 10);

  console.log('\n✅ REGULAR USER ACCOUNT');
  console.log('-' .repeat(60));
  console.log('Username: user@aluthpola.lk');
  console.log('Password: user123');
  console.log('Role: user');
  console.log('\nSQL to insert:');
  console.log(`
INSERT INTO users (name, email, password_hash, role, is_active, email_verified)
VALUES (
  'Test User',
  'user@aluthpola.lk',
  '${userHash}',
  'user',
  true,
  true
);
  `);

  // Combined SQL
  console.log('\n📋 COMBINED SQL (Run all at once)');
  console.log('=' .repeat(60));
  console.log(`
-- Super Admin
INSERT INTO users (name, email, password_hash, role, is_active, email_verified)
VALUES (
  'Super Admin',
  'admin@aluthpola.lk',
  '${adminHash}',
  'super_admin',
  true,
  true
);

-- Regular User
INSERT INTO users (name, email, password_hash, role, is_active, email_verified)
VALUES (
  'Test User',
  'user@aluthpola.lk',
  '${userHash}',
  'user',
  true,
  true
);
  `);

  console.log('\n📝 Quick Reference Card');
  console.log('=' .repeat(60));
  console.log(`
┌─────────────────────────────────────────────────────────┐
│  ALUTHPOLA.LK - LOGIN CREDENTIALS                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  🔑 SUPER ADMIN (Full Access)                           │
│     Email:    admin@aluthpola.lk                        │
│     Password: admin123                                  │
│     Redirects to: /admin/dashboard                      │
│                                                          │
│  👤 REGULAR USER                                         │
│     Email:    user@aluthpola.lk                         │
│     Password: user123                                   │
│     Redirects to: /profile                              │
│                                                          │
│  🌐 Login Page: http://localhost:3001/login             │
│                                                          │
└─────────────────────────────────────────────────────────┘
  `);

  console.log('\n💡 How to Use:');
  console.log('1. Run the database schema first: psql -d aluthpola_db -f database/schema.sql');
  console.log('2. Copy the COMBINED SQL above');
  console.log('3. Run it in your PostgreSQL database (psql or GUI tool)');
  console.log('4. Visit http://localhost:3001/login');
  console.log('5. Login with either credential above\n');
}

generateUsers().catch(console.error);
