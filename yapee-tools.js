#!/usr/bin/env node
// @ts-check

import { spawn } from 'child_process';
import { createInterface } from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Thiết lập biến môi trường cần thiết
const ENV_VARS = {
  DATABASE_URL: 'postgresql://neondb_owner:npg_NgY5QL6fnIxd@ep-raspy-morning-a6okjlxx.us-west-2.aws.neon.tech/neondb?sslmode=require',
  NODE_ENV: 'development',
  STRIPE_SECRET_KEY: 'sk_test_mock_key_for_development',
  SESSION_SECRET: 'yapee-session-secret'
};

/**
 * Tạo readline interface để đọc input từ console
 */
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Hàm chạy lệnh với biến môi trường
 */
function runCommand(command, args = [], options = {}) {
  const env = {
    ...process.env,
    ...ENV_VARS,
    ...options.env
  };

  return new Promise((resolve, reject) => {
    console.log(`Chạy lệnh: ${command} ${args.join(' ')}`);
    
    const proc = spawn(command, args, {
      env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Menu chính của công cụ
 */
function showMainMenu() {
  console.clear();
  console.log('=== YAPEE CLONE - CÔNG CỤ QUẢN LÝ ===');
  console.log('1. Khởi động server (development)');
  console.log('2. Quản lý Database');
  console.log('3. Kiểm tra cấu hình');
  console.log('4. Cài đặt dependencies');
  console.log('5. Build cho production');
  console.log('0. Thoát');
  console.log('=======================================');

  rl.question('Chọn một tùy chọn: ', (answer) => {
    switch (answer) {
      case '1':
        startDevelopmentServer();
        break;
      case '2':
        showDatabaseMenu();
        break;
      case '3':
        checkConfiguration();
        break;
      case '4':
        installDependencies();
        break;
      case '5':
        buildForProduction();
        break;
      case '0':
        console.log('Tạm biệt!');
        rl.close();
        break;
      default:
        console.log('Lựa chọn không hợp lệ!');
        setTimeout(showMainMenu, 1000);
    }
  });
}

/**
 * Khởi động development server
 */
async function startDevelopmentServer() {
  console.log('Khởi động development server...');
  try {
    await runCommand('npm', ['run', 'dev']);
  } catch (error) {
    console.error('Lỗi khi khởi động server:', error);
  }
  showContinuePrompt();
}

/**
 * Menu quản lý database
 */
function showDatabaseMenu() {
  console.clear();
  console.log('=== QUẢN LÝ DATABASE ===');
  console.log('1. Kiểm tra kết nối database');
  console.log('2. Cập nhật schema (Drizzle push)');
  console.log('3. Xem danh sách bảng');
  console.log('9. Quay lại menu chính');
  console.log('0. Thoát');
  console.log('========================');

  rl.question('Chọn một tùy chọn: ', async (answer) => {
    switch (answer) {
      case '1':
        await testDatabaseConnection();
        break;
      case '2':
        await pushDatabaseSchema();
        break;
      case '3':
        await listDatabaseTables();
        break;
      case '9':
        showMainMenu();
        return;
      case '0':
        console.log('Tạm biệt!');
        rl.close();
        return;
      default:
        console.log('Lựa chọn không hợp lệ!');
        setTimeout(showDatabaseMenu, 1000);
        return;
    }
    
    showContinuePrompt(() => showDatabaseMenu());
  });
}

/**
 * Kiểm tra kết nối database
 */
async function testDatabaseConnection() {
  console.log('Kiểm tra kết nối database...');
  try {
    await runCommand('node', ['test-db-connection.js']);
    console.log('Kiểm tra kết nối database thành công!');
  } catch (error) {
    console.error('Lỗi khi kiểm tra kết nối database:', error);
  }
}

/**
 * Cập nhật schema database
 */
async function pushDatabaseSchema() {
  console.log('Cập nhật schema database...');
  try {
    await runCommand('npx', ['drizzle-kit', 'push']);
    console.log('Cập nhật schema database thành công!');
  } catch (error) {
    console.error('Lỗi khi cập nhật schema database:', error);
  }
}

/**
 * Liệt kê các bảng trong database
 */
async function listDatabaseTables() {
  console.log('Liệt kê các bảng trong database...');
  try {
    await runCommand('node', ['test-db-connection.js']);
  } catch (error) {
    console.error('Lỗi khi liệt kê các bảng trong database:', error);
  }
}

/**
 * Kiểm tra cấu hình
 */
function checkConfiguration() {
  console.clear();
  console.log('=== KIỂM TRA CẤU HÌNH ===');
  console.log('Biến môi trường:');
  Object.entries(ENV_VARS).forEach(([key, value]) => {
    // Ẩn các giá trị nhạy cảm
    const displayValue = key.includes('SECRET') || key.includes('PASSWORD') 
      ? value.substring(0, 3) + '...' 
      : value;
    console.log(`${key}: ${displayValue}`);
  });
  
  console.log('\nCấu hình files:');
  
  const configFiles = ['package.json', 'tsconfig.json', 'drizzle.config.ts'];
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} - Tồn tại`);
    } else {
      console.log(`❌ ${file} - Không tồn tại`);
    }
  });
  
  showContinuePrompt();
}

/**
 * Cài đặt dependencies
 */
async function installDependencies() {
  console.log('Cài đặt dependencies...');
  try {
    await runCommand('npm', ['install']);
    console.log('Cài đặt dependencies thành công!');
  } catch (error) {
    console.error('Lỗi khi cài đặt dependencies:', error);
  }
  showContinuePrompt();
}

/**
 * Build cho production
 */
async function buildForProduction() {
  console.log('Build cho production...');
  try {
    await runCommand('npm', ['run', 'build']);
    console.log('Build cho production thành công!');
  } catch (error) {
    console.error('Lỗi khi build cho production:', error);
  }
  showContinuePrompt();
}

/**
 * Hiển thị prompt tiếp tục
 */
function showContinuePrompt(callback = showMainMenu) {
  rl.question('\nNhấn Enter để tiếp tục...', () => {
    callback();
  });
}

// Bắt đầu chương trình
showMainMenu(); 