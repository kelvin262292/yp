import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { users } from '@shared/schema';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    isAuthenticated?: boolean;
  }
}

/**
 * Middleware kiểm tra người dùng đã đăng nhập
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isAuthenticated && req.session.userId) {
    return next();
  }
  
  return res.status(401).json({ message: 'Bạn cần đăng nhập để truy cập' });
};

/**
 * Middleware kiểm tra quyền admin
 */
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.isAuthenticated || !req.session.userId) {
    return res.status(401).json({ message: 'Bạn cần đăng nhập để truy cập' });
  }
  
  try {
    const userId = req.session.userId;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập tính năng này' });
    }
    
    return next();
  } catch (error) {
    console.error('Lỗi kiểm tra quyền admin:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi kiểm tra quyền' });
  }
}; 