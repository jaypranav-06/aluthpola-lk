import { UserRole } from "@/types";

/**
 * Authentication utility functions
 * Provides helpers for user authentication and role management
 */

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  isAuthenticated: boolean;
  loginTime?: string;
}

/**
 * Get the currently authenticated user from localStorage
 * @returns AuthUser object or null if not authenticated
 */
export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const user = JSON.parse(userStr) as AuthUser;
    return user.isAuthenticated ? user : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns boolean indicating authentication status
 */
export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  return user !== null && user.isAuthenticated;
}

/**
 * Check if current user has super admin role
 * @returns boolean indicating if user is super admin
 */
export function isSuperAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === UserRole.SUPER_ADMIN;
}

/**
 * Check if current user has regular user role
 * @returns boolean indicating if user is a regular user
 */
export function isUser(): boolean {
  const user = getCurrentUser();
  return user?.role === UserRole.USER;
}

/**
 * Check if current user has a specific role
 * @param role - The role to check
 * @returns boolean indicating if user has the specified role
 */
export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

/**
 * Logout the current user
 */
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
}

/**
 * Get the redirect path based on user role
 * @param role - User role
 * @returns Redirect path for the role
 */
export function getRoleRedirectPath(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "/admin/dashboard";
    case UserRole.USER:
      return "/profile";
    default:
      return "/";
  }
}

/**
 * Check if a route is accessible by a specific role
 * @param path - Route path
 * @param role - User role
 * @returns boolean indicating if route is accessible
 */
export function isRouteAccessible(path: string, role: UserRole): boolean {
  // Super admin routes
  if (path.startsWith("/admin")) {
    return role === UserRole.SUPER_ADMIN;
  }

  // User routes (accessible by all authenticated users)
  if (path.startsWith("/profile") || path.startsWith("/orders")) {
    return true;
  }

  // Public routes
  return true;
}
