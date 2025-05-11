# Yapee Clone

Đây là dự án clone của ứng dụng thương mại điện tử Yapee.

## Công nghệ sử dụng

- Frontend: React, Vite, TailwindCSS
- Backend: Express.js, Node.js
- Database: PostgreSQL (Neon Database)
- Authentication: Passport.js

## Cài đặt

### Yêu cầu

- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository:
   ```
   git clone https://github.com/kelvin262292/yp.git
   cd yp
   ```

2. Cài đặt dependencies:
   ```
   npm install
   cd client && npm install
   ```

3. Cấu hình môi trường:
   - Tạo file `.env` từ file `.env.example`
   - Cập nhật các biến môi trường cần thiết

4. Khởi động ứng dụng (development mode):
   ```
   # Chạy server backend
   npm run dev
   
   # Chạy client frontend (trong terminal khác)
   npm run dev:client
   ```

## Cấu trúc dự án

- `/client`: Mã nguồn frontend React
- `/server`: Mã nguồn backend Express.js
- `/shared`: Mã nguồn được chia sẻ giữa client và server

## Chức năng chính

- Đăng nhập/Đăng ký
- Xem danh sách sản phẩm
- Chi tiết sản phẩm
- Giỏ hàng
- Thanh toán
- Quản lý đơn hàng
- Quản trị (Admin Dashboard)
