# Authentication Setup

## User Roles

The application currently supports **two user roles**:

1. **User** (`user`) - Regular customers
2. **Super Admin** (`super_admin`) - System administrator with full access

> **Note:** Additional roles will be implemented in future updates.

## Login Credentials (Demo)

### Super Admin Access
- Username: `admin` or `superadmin`
- Password: Any password (demo mode)
- Redirects to: `/admin/dashboard`

### Regular User Access
- Username: Any username except `admin` or `superadmin`
- Password: Any password (demo mode)
- Redirects to: `/profile`

## File Structure

```
src/
├── app/
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx          # Login page component
│       └── signup/
│           └── page.tsx           # Signup page component
├── lib/
│   └── auth-utils.ts              # Authentication utility functions
└── types/
    └── index.ts                   # Type definitions including UserRole enum
```

## Type Definitions

### UserRole Enum
```typescript
export enum UserRole {
  USER = "user",
  SUPER_ADMIN = "super_admin",
}
```

### User Interface
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  role: UserRole;
  isAuthenticated: boolean;
  loginTime?: string;
}
```

## Authentication Utilities

Import and use the auth utilities throughout your app:

```typescript
import {
  getCurrentUser,
  isAuthenticated,
  isSuperAdmin,
  isUser,
  hasRole,
  logout,
  getRoleRedirectPath,
  isRouteAccessible
} from "@/lib/auth-utils";
```

### Available Functions

- `getCurrentUser()` - Get the currently authenticated user
- `isAuthenticated()` - Check if user is logged in
- `isSuperAdmin()` - Check if current user is super admin
- `isUser()` - Check if current user is a regular user
- `hasRole(role)` - Check if user has a specific role
- `logout()` - Log out the current user
- `getRoleRedirectPath(role)` - Get redirect path for a role
- `isRouteAccessible(path, role)` - Check if route is accessible

## Usage Examples

### Protecting Routes
```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isSuperAdmin } from "@/lib/auth-utils";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isSuperAdmin()) {
      router.push("/login");
    }
  }, [router]);

  return <div>Admin Dashboard</div>;
}
```

### Conditional Rendering
```typescript
import { getCurrentUser } from "@/lib/auth-utils";

export default function Header() {
  const user = getCurrentUser();

  return (
    <header>
      {user?.role === UserRole.SUPER_ADMIN && (
        <a href="/admin">Admin Panel</a>
      )}
    </header>
  );
}
```

### Logout
```typescript
import { logout } from "@/lib/auth-utils";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

## Storage

Currently using **localStorage** for demo purposes. User data is stored as:

```json
{
  "email": "user@example.com",
  "name": "username",
  "role": "user",
  "isAuthenticated": true,
  "loginTime": "2026-05-08T06:20:00.000Z"
}
```

> **Production Note:** In production, replace localStorage with proper authentication using:
> - JWT tokens
> - HTTP-only cookies
> - Session management
> - Backend API validation

## Accessing the Login Page

Visit: [http://localhost:3001/login](http://localhost:3001/login)

## Future Enhancements

- [ ] Backend API integration
- [ ] JWT token-based authentication
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Additional user roles (vendor, moderator, etc.)
- [ ] Session management
- [ ] OAuth/Social login
