# KẾ HOẠCH TRIỂN KHAI CHI TIẾT CHO YAPEE CLONE

Dựa trên phân tích codebase hiện tại, đây là danh sách các tính năng cần triển khai theo từng giai đoạn. Chú ý: các thư mục và file cơ bản đã được tạo, nhưng nhiều trong số đó chưa có code hoạt động đầy đủ.

## GIAI ĐOẠN 1: NỀN TẢNG QUAN TRỌNG (3-4 TUẦN) - **HOÀN THÀNH 60%**

### 1.1 Authentication & Authorization

#### Backend
- [x] Hoàn thiện cấu hình Passport.js trong server/index.ts
- [x] Tạo API endpoints xác thực trong server/routes.ts:
  - [x] POST /api/auth/login
  - [x] POST /api/auth/register
  - [x] POST /api/auth/logout
  - [ ] POST /api/auth/password-reset *(Đang xử lý)*
  - [x] GET /api/auth/me
- [x] Tạo middleware kiểm tra xác thực user (`isAuthenticated`)
- [x] Tạo middleware kiểm tra quyền admin (`isAdmin`)
- [x] Cài đặt session storage với PostgreSQL hoặc memorystore

#### Frontend
- [x] Hoàn thiện trang Account.tsx:
  - [x] Kết nối form đăng nhập với API
  - [x] Kết nối form đăng ký với API
  - [ ] Thêm xử lý quên mật khẩu *(Đang xử lý)*
- [x] Tạo AuthContext.tsx và useAuth.ts hook
- [x] Thêm ProtectedRoute component cho các route yêu cầu đăng nhập

### 1.2 Payment Processing

#### Backend
- [x] Thêm routes xử lý thanh toán Stripe:
  - [x] POST /api/create-payment-intent (đã được nhắc đến trong code)
  - [x] POST /api/confirm-payment
  - [x] GET /api/payment/:id
- [x] Tạo models và schema cho đơn hàng (orders) 
- [x] Cập nhật Order schema trong shared/schema.ts
- [x] Thêm xử lý webhook Stripe để cập nhật trạng thái đơn hàng

#### Frontend
- [x] Hoàn thiện Checkout.tsx:
  - [x] Hoàn thiện form nhập thông tin vận chuyển
  - [x] Kết nối xử lý form thanh toán với API
  - [x] Thêm xử lý lỗi và loading states
- [x] Hoàn thiện CheckoutSuccess.tsx:
  - [x] Hiển thị thông tin đơn hàng
  - [x] Thêm nút in hóa đơn
  - [x] Thêm nút xem đơn hàng

### 1.3 Order Management

#### Backend
- [x] Tạo các API endpoints quản lý đơn hàng:
  - [x] GET /api/orders (lấy danh sách đơn hàng)
  - [x] GET /api/orders/:id (lấy chi tiết đơn hàng)
  - [x] PATCH /api/orders/:id/status (cập nhật trạng thái)
  - [x] POST /api/orders (tạo đơn hàng mới)
- [ ] Thêm chức năng gửi email xác nhận đơn hàng *(Dự kiến triển khai ở phiên bản 2.0)*
- [x] Thêm logic cập nhật kho hàng (stock) khi đơn hàng được tạo

#### Frontend
- [x] Tạo trang Account/Orders.tsx để hiển thị lịch sử đơn hàng
- [x] Tạo trang Account/OrderDetail.tsx để hiển thị chi tiết đơn hàng
- [x] Thêm component OrderStatus để hiển thị trạng thái đơn hàng
- [x] Cập nhật Cart.tsx để kết nối với flow thanh toán

## TIẾN ĐỘ HIỆN TẠI

Đã hoàn thành tính năng quản lý đơn hàng cơ bản, bao gồm:
1. Tạo đơn hàng mới từ giỏ hàng
2. Thanh toán với hai phương thức: COD và Stripe
3. Xem lịch sử đơn hàng
4. Xem chi tiết đơn hàng
5. Cập nhật trạng thái đơn hàng
6. Webhook Stripe để cập nhật trạng thái thanh toán

**TIẾP THEO:** Triển khai Giai đoạn 2 - Nâng cao trải nghiệm người dùng

## GIAI ĐOẠN 2: NÂNG CAO TRẢI NGHIỆM NGƯỜI DÙNG (2-3 TUẦN) - **HOÀN THÀNH 100%**

### 2.1 Product Reviews & Ratings 

#### Backend
- [x] Thêm schema `reviews` vào shared/schema.ts
- [x] Tạo API endpoints:
  - [x] GET /api/products/:id/reviews
  - [x] POST /api/products/:id/reviews
  - [x] PATCH /api/products/:id/reviews/:reviewId
  - [x] DELETE /api/products/:id/reviews/:reviewId
- [x] Cập nhật logic tính trung bình rating cho sản phẩm

#### Frontend
- [x] Cập nhật ProductDetail.tsx:
  - [x] Thêm tab đánh giá và reviews
  - [x] Thêm form gửi đánh giá
  - [x] Hiển thị danh sách đánh giá với phân trang
- [x] Tạo components/product/ReviewForm.tsx
- [x] Tạo components/product/ReviewList.tsx

### 2.2 Flash Deals & Promotions

#### Backend
- [x] Thêm schema `discountCodes` vào shared/schema.ts
- [x] Cập nhật schema `orders` để lưu thông tin mã giảm giá được áp dụng
- [x] Tạo API endpoints cho Flash Deals:
  - [x] GET /api/flash-deals/active
  - [x] POST /api/flash-deals (Admin)
  - [x] PUT /api/flash-deals/:id (Admin)
  - [x] DELETE /api/flash-deals/:id (Admin)
- [x] Tạo API endpoints cho Discount Codes:
  - [x] GET /api/discount-codes (Admin)
  - [x] GET /api/discount-codes/:code/validate
  - [x] POST /api/discount-codes (Admin)
  - [x] PATCH /api/discount-codes/:id (Admin)
  - [x] DELETE /api/discount-codes/:id (Admin)

#### Frontend
- [x] Cập nhật FlashDeals.tsx để kết nối với API
- [x] Tạo components/checkout/DiscountCodeForm.tsx
- [x] Cập nhật UI để hiển thị các sản phẩm flash deals
- [x] Cập nhật Checkout.tsx để thêm tính năng áp dụng mã giảm giá

### 2.3 Product Recommendation

#### Backend
- [x] Tạo API endpoints cho sản phẩm đề xuất:
  - [x] GET /api/products/:id/recommendations
  - [x] GET /api/products/:id/frequently-bought-together

#### Frontend
- [x] Tạo components/product/ProductRecommendations.tsx
- [x] Tạo components/common/ProductCard.tsx
- [x] Cập nhật ProductDetail.tsx để hiển thị các sản phẩm đề xuất
- [x] Thêm các bản dịch cho tính năng đề xuất sản phẩm

### 2.4 YapeeMall (Sản phẩm chính hãng)

#### Backend
- [x] Cập nhật model và schema `products` để đánh dấu sản phẩm YapeeMall
- [x] Tạo API endpoint GET /api/yapee-mall/products
- [x] Cập nhật logic lọc sản phẩm YapeeMall

#### Frontend
- [x] Tạo components/home/YapeeMall.tsx
- [x] Cập nhật Home.tsx để hiển thị section YapeeMall
- [x] Thêm UI badge đánh dấu sản phẩm YapeeMall trong danh sách sản phẩm

## GIAI ĐOẠN 3: Admin Dashboard ✅

### 3.1 Admin Core & Authentication ✅

#### Backend
- [x] Tạo middleware isAdmin để bảo vệ các route admin
- [x] Setup /api/admin namespace & route protection
- [x] Thêm role field vào user model & migration

#### Frontend
- [x] Tạo AdminLayout component với sidebar và header
- [x] Tạo AdminRoute component để bảo vệ các route admin
- [x] Set up context API cho admin authentication
- [x] Cài đặt hệ thống thông báo toast cho admin UI

### 3.2 Product Management ✅

#### Backend
- [x] Triển khai API endpoints quản lý sản phẩm:
  - [x] GET /api/admin/products (với phân trang và tìm kiếm)
  - [x] POST /api/admin/products (tạo mới)
  - [x] PUT /api/admin/products/:id (cập nhật)
  - [x] DELETE /api/admin/products/:id (xóa)
  - [x] POST /api/admin/products/upload (upload ảnh)

#### Frontend
- [x] Hoàn thiện ProductList.tsx:
  - [x] Hiển thị danh sách sản phẩm với phân trang
  - [x] Thêm filter và tìm kiếm
  - [x] Thêm chức năng sắp xếp
- [x] Hoàn thiện ProductForm.tsx:
  - [x] Form thêm/sửa sản phẩm với validation
  - [x] Upload ảnh với preview
  - [x] Rich text editor cho mô tả
  - [x] Quản lý variant và options của sản phẩm

### 3.3 Category & Brand Management ✅

#### Backend
- [x] Hoàn thiện API endpoints quản lý danh mục:
  - [x] GET /api/admin/categories (với cấu trúc phân cấp)
  - [x] POST /api/admin/categories (tạo mới)
  - [x] PUT /api/admin/categories/:id (cập nhật)
  - [x] DELETE /api/admin/categories/:id (xóa)
- [x] Tạo tương tự cho Brand management

#### Frontend
- [x] Hoàn thiện CategoryList.tsx và CategoryForm.tsx
- [x] Hoàn thiện BrandList.tsx và BrandForm.tsx
- [x] Tạo UI hiển thị cấu trúc phân cấp danh mục

### 3.4 Order Management (Admin) ✅

#### Backend
- [x] Triển khai API endpoints quản lý đơn hàng:
  - [x] GET /api/admin/orders (với phân trang, lọc theo trạng thái)
  - [x] PUT /api/admin/orders/:id/status (cập nhật trạng thái)
  - [x] GET /api/admin/orders/stats (thống kê đơn hàng)

#### Frontend
- [x] Hoàn thiện OrderList.tsx:
  - [x] Hiển thị bảng đơn hàng với phân trang
  - [x] Thêm filter theo trạng thái (tabs)
  - [x] Thêm chức năng tìm kiếm đơn hàng
- [x] Tạo OrderDetail.tsx (admin):
  - [x] Hiển thị thông tin chi tiết đơn hàng
  - [x] UI cập nhật trạng thái đơn hàng
  - [x] Thêm nút in hóa đơn

### 3.5 Dashboard & Analytics ✅

#### Backend
- [x] Tạo API endpoints cho dashboard data:
  - [x] GET /api/admin/dashboard/stats
  - [x] GET /api/admin/dashboard/sales-by-period
  - [x] GET /api/admin/dashboard/popular-products
  - [x] GET /api/admin/dashboard/recent-orders

#### Frontend
- [x] Cải thiện AdminDashboard.tsx:
  - [x] Dashboard cards cho stats
  - [x] Sales & revenue charts (line, bar)
  - [x] Danh sách đơn hàng gần đây
  - [x] Sản phẩm bán chạy

## GIAI ĐOẠN 4: Tính năng nâng cao & Tối ưu ✅

### 4.1 Marketing & Promotion Management ✅

#### Backend
- [x] Tạo schema `campaigns` và `discountCodes` 
- [x] Triển khai API endpoints quản lý chiến dịch tiếp thị
- [x] Triển khai API endpoints quản lý mã giảm giá
- [x] Tạo logic apply mã giảm giá vào đơn hàng

#### Frontend
- [x] Hoàn thiện MarketingDashboard.tsx
- [x] Tạo UI quản lý chiến dịch tiếp thị
- [x] Tạo UI quản lý mã giảm giá
- [x] Tạo UI quản lý Flash Deals

### 4.2 Report & Analytics ✅

#### Backend
- [x] Tạo API endpoints thống kê:
  - [x] GET /api/admin/stats/sales (thống kê doanh số)
  - [x] GET /api/admin/stats/products (thống kê sản phẩm)
  - [x] GET /api/admin/stats/customers (thống kê khách hàng)

#### Frontend
- [x] Hoàn thiện ReportsDashboard.tsx:
  - [x] Tạo biểu đồ doanh số theo thời gian
  - [x] Tạo biểu đồ sản phẩm bán chạy
  - [x] Tạo biểu đồ phân khúc khách hàng
- [x] Thêm xuất báo cáo PDF/Excel

### 4.3 Settings & Configuration ✅

#### Backend
- [x] Tạo schema `settings` trong shared/schema.ts
- [x] Triển khai API endpoints quản lý cài đặt:
  - [x] GET /api/admin/settings
  - [x] PUT /api/admin/settings

#### Frontend
- [x] Hoàn thiện SettingsDashboard.tsx:
  - [x] Tạo form cài đặt chung
  - [x] Tạo form cài đặt thanh toán
  - [x] Tạo form cài đặt vận chuyển
  - [x] Tạo form cài đặt thông báo

### 4.4 User & Customer Management ✅

#### Backend
- [x] Triển khai API endpoints quản lý người dùng:
  - [x] GET /api/admin/users
  - [x] GET /api/admin/users/:id
  - [x] PUT /api/admin/users/:id
  - [x] DELETE /api/admin/users/:id

#### Frontend
- [x] Hoàn thiện UsersList.tsx:
  - [x] Hiển thị bảng người dùng với phân trang
  - [x] Thêm bộ lọc theo vai trò
  - [x] Thêm tìm kiếm người dùng
- [x] Tạo UserForm.tsx cho thêm/sửa người dùng
- [x] Hoàn thiện CustomersLists.tsx với thông tin chi tiết khách hàng

## TIẾN ĐỘ HIỆN TẠI

Đã hoàn thành tất cả các giai đoạn (1-4), bao gồm:
1. Nền tảng quan trọng: Xác thực, Thanh toán, Quản lý đơn hàng
2. Nâng cao trải nghiệm người dùng: Đánh giá sản phẩm, Flash Deals, Đề xuất sản phẩm
3. Admin Dashboard: Quản lý sản phẩm, danh mục, đơn hàng, thống kê
4. Tính năng nâng cao & Tối ưu: Quản lý tiếp thị, báo cáo, cài đặt, quản lý người dùng

**TIẾP THEO:** Có thể triển khai các cải tiến sau:
1. Tích hợp gửi email thông báo cho đơn hàng
2. Tích hợp thêm nhiều phương thức thanh toán (MoMo, VNPay)
3. Cải thiện UX/UI cho trang sản phẩm và giỏ hàng
4. Thêm tính năng thống kê và báo cáo chi tiết hơn
5. Triển khai Progressive Web App (PWA)
6. Tối ưu hiệu suất và SEO

## QUY TRÌNH TRIỂN KHAI

1. **Nhánh Git và Quy trình Phát triển**
   - Tạo nhánh riêng cho mỗi tính năng (feature branch)
   - Sử dụng Pull Requests & Code Reviews
   - Merge vào main sau khi hoàn thành và review
   
2. **Testing Strategy**
   - Viết unit tests cho backend logic (API endpoints, models)
   - Viết integration tests cho flows quan trọng (đặt hàng, thanh toán)
   - Manual testing cho UI/UX

3. **Deployment**
   - Cấu hình CI/CD pipeline
   - Triển khai staging environment để test trước khi đưa lên production
   - Monitoring và logging
   
## CÔNG CỤ VÀ DEPENDENCIES CÓ THỂ CẦN THÊM

1. **Testing**
   - Jest/Vitest cho unit testing
   - Supertest cho API testing
   - Playwright/Cypress cho E2E testing

2. **Email**
   - Nodemailer hoặc SendGrid để gửi email xác nhận đơn hàng

3. **Upload Ảnh**
   - Multer/Formidable cho xử lý file upload
   - Cloudinary/AWS S3 cho lưu trữ ảnh

4. **Logging & Monitoring**
   - Winston/Pino cho logging
   - Sentry cho error tracking

5. **Phân quyền**
   - CASL/accesscontrol cho quản lý phân quyền chi tiết

## CÁC CÔNG VIỆC ƯU TIÊN CHO GIAI ĐOẠN TIẾP THEO

1. Triển khai Product Management - quản lý sản phẩm trong admin panel
2. Triển khai Order Management - quản lý đơn hàng trong admin panel
3. Triển khai Category & Brand Management - quản lý danh mục và thương hiệu

## NHỮNG CẢI TIẾN ĐANG CÂN NHẮC

1. Tích hợp gửi email thông báo cho đơn hàng
2. Tích hợp thêm nhiều phương thức thanh toán
3. Cải thiện UX/UI cho trang sản phẩm và giỏ hàng
4. Thêm tính năng thống kê và báo cáo chi tiết hơn
