// @ts-check
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cấu hình dotenv
dotenv.config();

// Database URL Neon
const DATABASE_URL = 'postgresql://neondb_owner:npg_NgY5QL6fnIxd@ep-raspy-morning-a6okjlxx.us-west-2.aws.neon.tech/neondb?sslmode=require';

console.log('Bắt đầu thiết lập database...');

try {
  console.log('Đang push schema lên database...');
  
  // Thiết lập môi trường cho quá trình con
  const env = {
    ...process.env,
    DATABASE_URL: DATABASE_URL
  };
  
  // Sử dụng spawn thay vì exec để quản lý IO
  const pushProcess = spawn('npx', ['drizzle-kit', 'push'], { 
    env: env,
    shell: true,
    stdio: 'inherit'
  });
  
  pushProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Schema đã được push lên database thành công!');
    } else {
      console.error(`Quá trình push schema thất bại với mã lỗi: ${code}`);
    }
  });

} catch (error) {
  console.error('Lỗi trong quá trình thiết lập database:', error);
} 