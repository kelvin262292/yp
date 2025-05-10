# YAPEE E-COMMERCE PLATFORM - DOCUMENTATION

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Giới thiệu

Yapee là một nền tảng thương mại điện tử đa ngôn ngữ hoàn chỉnh với đầy đủ chức năng cần thiết cho một website bán hàng hiện đại, bao gồm cả giao diện người dùng, quản trị viên và hệ thống thanh toán tích hợp.

### 1.2 Công nghệ sử dụng

#### Frontend:
- **React.js (TypeScript)**: Thư viện JavaScript xây dựng giao diện người dùng
- **Tailwind CSS**: Framework CSS để tạo giao diện tùy chỉnh, phản ứng nhanh
- **Shadcn UI**: Thư viện các component UI dựa trên Radix UI
- **TanStack Query (React Query)**: Quản lý trạng thái và tương tác với API
- **React Hook Form + Zod**: Xác thực và quản lý form
- **Wouter**: Thư viện định tuyến đơn giản, nhẹ

#### Backend:
- **Express.js**: Framework Node.js xử lý API và server
- **PostgreSQL**: Cơ sở dữ liệu quan hệ
- **Drizzle ORM**: ORM cho PostgreSQL
- **Passport.js**: Xác thực người dùng
- **Stripe**: Tích hợp thanh toán

#### Công cụ & Tiện ích:
- **TypeScript**: Hệ thống kiểu dữ liệu cho JavaScript
- **Vite**: Build tool và development server
- **Recharts**: Thư viện biểu đồ React
- **Lucide React**: Bộ icon

### 1.3 Đa ngôn ngữ

Platform hỗ trợ đa ngôn ngữ với:
- Tiếng Việt (ngôn ngữ mặc định)
- Tiếng Anh
- Tiếng Trung

## 2. KIẾN TRÚC DỰ ÁN

### 2.1 Cấu trúc thư mục

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main application component
│   │   ├── main.tsx       # Application entry point
│   │   └── index.css      # Global CSS
│   └── index.html         # HTML template
├── server/                # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Storage interface
│   ├── database-storage.ts # Database implementation
│   ├── db.ts              # Database connection
│   ├── init-db.ts         # Database initialization
│   └── vite.ts            # Vite server integration
├── shared/                # Shared code between client and server
│   └── schema.ts          # Database schema definitions
└── various config files   # Configuration files
```

### 2.2 Workflow

Dự án sử dụng một workflow chính "Start application" để khởi động cả frontend và backend thông qua lệnh `npm run dev`.

## 3. CƠ SỞ DỮ LIỆU

### 3.1 Schema

Dự án sử dụng PostgreSQL với Drizzle ORM và định nghĩa schema như sau:

#### Users

```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Categories

```typescript
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  nameZh: text("name_zh").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  parentId: integer("parent_id").references(() => categories.id),
});
```

#### Products

```typescript
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  nameZh: text("name_zh").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionZh: text("description_zh"),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
  discountPercentage: integer("discount_percentage"),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  brandId: integer("brand_id").references(() => brands.id),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  stock: integer("stock").default(0),
  isFeatured: boolean("is_featured").default(false),
  isHotDeal: boolean("is_hot_deal").default(false),
  isBestSeller: boolean("is_best_seller").default(false),
  isNewArrival: boolean("is_new_arrival").default(false),
  freeShipping: boolean("free_shipping").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Carts & Cart Items

```typescript
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  sessionId: text("session_id"),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").references(() => carts.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
});
```

#### Brands

```typescript
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  isFeatured: boolean("is_featured").default(false),
});
```

#### Flash Deals

```typescript
export const flashDeals = pgTable("flash_deals", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalStock: integer("total_stock").notNull(),
  soldCount: integer("sold_count").default(0),
});
```

#### Banners

```typescript
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  titleZh: text("title_zh"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionZh: text("description_zh"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  isActive: boolean("is_active").default(true),
  position: integer("position").default(0),
});
```

### 3.2 Relationships

Schema định nghĩa các mối quan hệ giữa các bảng:

- Users ↔ Carts: one-to-many
- Categories ↔ Categories: self-reference (parent-child)
- Categories ↔ Products: one-to-many
- Brands ↔ Products: one-to-many
- Products ↔ CartItems: one-to-many
- Products ↔ FlashDeals: one-to-many
- Carts ↔ CartItems: one-to-many

## 4. API ENDPOINTS

### 4.1 Products

- `GET /api/products`: Lấy danh sách sản phẩm với các bộ lọc tùy chọn
- `GET /api/products/:id`: Lấy chi tiết sản phẩm theo ID
- `GET /api/products/slug/:slug`: Lấy chi tiết sản phẩm theo slug
- `GET /api/products/search/:query`: Tìm kiếm sản phẩm theo từ khóa
- `POST /api/admin/products`: Tạo sản phẩm mới (admin)
- `PUT /api/admin/products/:id`: Cập nhật sản phẩm (admin)
- `DELETE /api/admin/products/:id`: Xóa sản phẩm (admin)

### 4.2 Categories

- `GET /api/categories`: Lấy danh sách danh mục
- `GET /api/categories/:id`: Lấy chi tiết danh mục theo ID
- `POST /api/admin/categories`: Tạo danh mục mới (admin)
- `PUT /api/admin/categories/:id`: Cập nhật danh mục (admin)
- `DELETE /api/admin/categories/:id`: Xóa danh mục (admin)

### 4.3 Brands

- `GET /api/brands`: Lấy danh sách thương hiệu
- `GET /api/brands/:id`: Lấy chi tiết thương hiệu theo ID
- `POST /api/admin/brands`: Tạo thương hiệu mới (admin)

### 4.4 Cart

- `GET /api/cart/:sessionId`: Lấy giỏ hàng theo session ID
- `POST /api/cart`: Tạo giỏ hàng mới
- `POST /api/cart/items`: Thêm sản phẩm vào giỏ hàng
- `PUT /api/cart/items/:id`: Cập nhật số lượng sản phẩm trong giỏ hàng
- `DELETE /api/cart/items/:id`: Xóa sản phẩm khỏi giỏ hàng

### 4.5 Flash Deals

- `GET /api/flash-deals`: Lấy danh sách flash deals
- `GET /api/flash-deals/:id`: Lấy chi tiết flash deal theo ID
- `POST /api/admin/flash-deals`: Tạo flash deal mới (admin)
- `PUT /api/admin/flash-deals/:id/sold-count`: Cập nhật số lượng đã bán (admin)

### 4.6 Banners

- `GET /api/banners`: Lấy danh sách banners
- `POST /api/admin/banners`: Tạo banner mới (admin)

### 4.7 Payment

- `POST /api/create-payment-intent`: Tạo payment intent với Stripe

### 4.8 Admin Statistics

- `GET /api/admin/stats`: Lấy thống kê dành cho admin

## 5. GIAO DIỆN NGƯỜI DÙNG

### 5.1 Trang người dùng

- Trang chủ với banner quảng cáo, danh mục nổi bật
- Trang danh sách sản phẩm với bộ lọc
- Trang chi tiết sản phẩm
- Giỏ hàng
- Trang thanh toán
- Trang xác nhận đơn hàng

### 5.2 Trang Admin

- Dashboard với số liệu thống kê
- Quản lý sản phẩm
- Quản lý danh mục
- Quản lý thương hiệu
- Quản lý banner
- Quản lý flash deals
- Quản lý đơn hàng
- Quản lý người dùng
- Báo cáo thống kê
- Cài đặt hệ thống

## 6. TÍNH NĂNG ĐẶC BIỆT

### 6.1 Đa ngôn ngữ

Triển khai đa ngôn ngữ thông qua `LanguageContext` với hỗ trợ tiếng Việt, tiếng Anh và tiếng Trung.

### 6.2 Tích hợp thanh toán

Sử dụng Stripe để xử lý thanh toán với việc xử lý đặc biệt cho đơn vị tiền tệ VND (không nhân với 100 như USD).

### 6.3 Responsive Design

Thiết kế thích ứng với các thiết bị khác nhau từ di động đến máy tính bảng và máy tính để bàn.

### 6.4 Flash Deals

Hệ thống khuyến mãi theo thời gian thực với đếm ngược.

## 7. TRIỂN KHAI & CẤU HÌNH

### 7.1 Biến môi trường

- `DATABASE_URL`: URL kết nối đến cơ sở dữ liệu PostgreSQL
- `STRIPE_SECRET_KEY`: Khóa bí mật của Stripe
- `VITE_STRIPE_PUBLIC_KEY`: Khóa công khai của Stripe (frontend)

### 7.2 Deployment

Dự án được cấu hình để triển khai trên Replit với quy trình tự động hóa:
- Build: `npm run build`
- Start: `npm run start`

## 8. HƯỚNG DẪN PHÁT TRIỂN

### 8.1 Khởi động dự án

1. Cài đặt dependencies: `npm install`
2. Khởi động ứng dụng: `npm run dev`

### 8.2 Mở rộng schema

1. Thêm định nghĩa bảng mới vào `shared/schema.ts`
2. Định nghĩa mối quan hệ với các bảng hiện có
3. Tạo schema Zod và type exports

### 8.3 Thêm API endpoint mới

1. Thêm route mới vào `server/routes.ts`
2. Sử dụng `storage` interface để thực hiện các thao tác CRUD
3. Xác thực dữ liệu đầu vào với Zod schemas

### 8.4 Thêm trang mới

1. Tạo component trang mới trong `client/src/pages`
2. Đăng ký route trong `client/src/App.tsx`
3. Sử dụng React Query để tương tác với API

## 9. TÀI LIỆU THAM KHẢO

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Stripe API Documentation](https://stripe.com/docs/api)