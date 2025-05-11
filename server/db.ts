import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Sử dụng URL mặc định nếu không có biến môi trường
const DATABASE_URL = process.env.DATABASE_URL || "postgres://localhost:5432/yapee_clone";

// Thêm log để kiểm tra kết nối database
console.log(`Connecting to database: ${DATABASE_URL.split('@')[1] || 'localhost'}`);

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });

// Kiểm tra kết nối khi khởi động
pool.connect()
  .then(() => console.log('Database connection established successfully'))
  .catch(err => console.error('Error connecting to database:', err));
