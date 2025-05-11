import { useAuth } from './useAuth';

/**
 * Hook to check if the current user has admin privileges
 * @returns Object with isAdmin flag and loading state
 */
export function useAdmin() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  return {
    isAdmin: isAuthenticated && user?.role === 'admin',
    isLoading
  };
} 