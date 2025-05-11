import React from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminRouteProps {
  component: React.ComponentType<any>;
  path?: string;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ 
  component: Component,
  ...rest
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if the user is authenticated and has admin role
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    // Show toast message if user is logged in but not an admin
    if (isAuthenticated && user && user.role !== 'admin') {
      toast({
        title: 'Truy cập bị từ chối',
        description: 'Bạn không có quyền truy cập trang này. Chỉ quản trị viên mới có thể truy cập.',
        variant: 'destructive',
      });
    }
    
    // Redirect to login page
    return <Redirect to="/account" />;
  }

  // If user is admin, render the component
  return <Component {...rest} />;
};

export default AdminRoute; 