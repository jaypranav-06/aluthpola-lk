-- Seed Users for Aluthpola.lk
-- Run this after executing schema.sql

-- Super Admin Account
INSERT INTO users (name, email, password_hash, role, is_active, email_verified)
VALUES (
  'Super Admin',
  'admin@aluthpola.lk',
  '$2b$10$FilU470dWURpwSPDNHC11OrQ0kYBUWeepmBxgQpE60Sz1mvLdp6Nm',
  'super_admin',
  true,
  true
);

-- Regular User Account
INSERT INTO users (name, email, password_hash, role, is_active, email_verified)
VALUES (
  'Test User',
  'user@aluthpola.lk',
  '$2b$10$e3xlKggQH4xciNFMqsAc3e9q/bbElu1iyIQ/Ep4lwlEV8y8YXtoCy',
  'user',
  true,
  true
);

-- Verify insertion
SELECT id, name, email, role, is_active FROM users;
