import { createContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/auth/me');
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Lỗi kiểm tra trạng thái đăng nhập:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/auth/login', {
        username,
        password,
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        toast({
          title: 'Đăng nhập thành công',
          description: `Chào mừng ${userData.fullName || userData.username}!`,
        });
        return true;
      } else {
        const error = await response.json();
        toast({
          title: 'Đăng nhập thất bại',
          description: error.message || 'Tên đăng nhập hoặc mật khẩu không chính xác',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi đăng nhập',
        description: error.message || 'Đã xảy ra lỗi trong quá trình đăng nhập',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/auth/register', userData);

      if (response.ok) {
        toast({
          title: 'Đăng ký thành công',
          description: 'Tài khoản đã được tạo. Bạn có thể đăng nhập ngay bây giờ.',
        });
        return true;
      } else {
        const error = await response.json();
        toast({
          title: 'Đăng ký thất bại',
          description: error.message || 'Đã xảy ra lỗi trong quá trình đăng ký',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi đăng ký',
        description: error.message || 'Đã xảy ra lỗi trong quá trình đăng ký',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/auth/logout');

      if (response.ok) {
        setUser(null);
        toast({
          title: 'Đăng xuất thành công',
          description: 'Bạn đã đăng xuất khỏi hệ thống',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Đăng xuất thất bại',
          description: error.message || 'Đã xảy ra lỗi khi đăng xuất',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi đăng xuất',
        description: error.message || 'Đã xảy ra lỗi trong quá trình đăng xuất',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 