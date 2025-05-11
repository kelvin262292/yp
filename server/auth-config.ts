import { Express } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import MemoryStore from 'memorystore';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { users, type User } from '@shared/schema';

const MemoryStoreSession = MemoryStore(session);

/**
 * Cấu hình Passport.js và session management
 */
export function configureAuth(app: Express) {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'yapee-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      // Tìm user theo username
      const [user] = await db.select().from(users).where(eq(users.username, username));
      
      if (!user) {
        return done(null, false, { message: 'Tài khoản không tồn tại' });
      }
      
      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Mật khẩu không chính xác' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Serialize user to store in session
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
} 