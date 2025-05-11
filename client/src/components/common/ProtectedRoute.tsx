import { ReactNode } from 'react';
import { useLocation, useRoute, Redirect } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin';
}

/**
 * Component bảo vệ các route yêu cầu đăng nhập
 * Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
 * Nếu yêu cầu quyền admin nhưng người dùng không phải admin, chuyển hướng đến trang 403
 */
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [isCurrentRoute] = useRoute('*');
  const [location] = useLocation();
  
  // Nếu đang loading, hiển thị một loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }
  
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Redirect to={`/account?redirect=${encodeURIComponent(location)}`} />;
  }
  
  // Nếu yêu cầu quyền admin nhưng người dùng không phải admin
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Redirect to="/403" />;
  }
  
  // Nếu đã đăng nhập và có đủ quyền, hiển thị nội dung
  return <>{children}</>;
};

export default ProtectedRoute; 