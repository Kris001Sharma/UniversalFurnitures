import { UserRole } from '../types';

/**
 * Authorization utility for role-based access control.
 * Can be used in components, loaders, or future API routes.
 * 
 * @param role - The current user's role
 * @param allowed - An array of allowed roles
 * @throws Error if the user is not authorized (useful for APIs)
 * @returns boolean indicating if authorized
 */
export function authorize(role: UserRole | null, allowed: UserRole[]): boolean {
  if (!role) return false;
  return allowed.includes(role);
}

// Helper to get role from cookies/localStorage
export function getCurrentRole(): UserRole | null {
  // In a real app, this would read from a secure cookie or session.
  // For this demo, we'll read from localStorage.
  const role = localStorage.getItem('userRole');
  return role as UserRole | null;
}

export function setCurrentRole(role: UserRole | null) {
  if (role) {
    localStorage.setItem('userRole', role);
  } else {
    localStorage.removeItem('userRole');
  }
}
