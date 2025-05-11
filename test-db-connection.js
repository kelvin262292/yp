// @ts-check
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cấu hình dotenv
dotenv.config();

// Thông tin kết nối Neon Database
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_NgY5QL6fnIxd@ep-raspy-morning-a6okjlxx.us-west-2.aws.neon.tech/neondb?sslmode=require';

// Cấu hình websocket cho Neon
const neonConfig = {
  webSocketConstructor: ws
};

async function testConnection() {
  console.log('Đang thử kết nối đến Neon PostgreSQL...');
  console.log(`URL: ${DATABASE_URL}`);
  
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    // Thử thực hiện một truy vấn đơn giản
    const result = await pool.query('SELECT current_timestamp as current_time, current_database() as db_name, version() as pg_version');
    
    console.log('Kết nối thành công!');
    console.log('Thông tin database:');
    console.log(`Database: ${result.rows[0].db_name}`);
    console.log(`Thời gian hiện tại: ${result.rows[0].current_time}`);
    console.log(`Phiên bản PostgreSQL: ${result.rows[0].pg_version}`);
    
    // Thử đếm số bảng trong schema public
    const tablesResult = await pool.query(`
      SELECT COUNT(*) as table_count FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log(`Số lượng bảng: ${tablesResult.rows[0].table_count}`);
    
    // Liệt kê các bảng
    const tableNames = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('Danh sách bảng:');
    tableNames.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('Lỗi kết nối database:', error);
  } finally {
    // Đóng kết nối pool
    await pool.end();
  }
}

// Thực thi test kết nối
testConnection(); 