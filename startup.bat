@echo off
echo Khởi động ứng dụng Yapee Clone...

REM Thiết lập biến môi trường
set DATABASE_URL=postgresql://neondb_owner:npg_NgY5QL6fnIxd@ep-raspy-morning-a6okjlxx.us-west-2.aws.neon.tech/neondb?sslmode=require
set NODE_ENV=development
set STRIPE_SECRET_KEY=sk_test_mock_key_for_development
set SESSION_SECRET=yapee-session-secret

REM Khởi động server
echo Đang khởi động server...
npm run dev

pause 