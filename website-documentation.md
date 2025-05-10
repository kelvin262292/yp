# Yapee E-commerce Website Documentation

## Overview
Yapee is a modern, multilingual e-commerce platform inspired by popular Southeast Asian online marketplaces. The website supports Vietnamese, English, and Chinese languages, offering a comprehensive shopping experience with product listings, search functionality, shopping cart, and a robust admin dashboard for complete site management.

## Frontend Pages and Features

### Public Pages

#### 1. Home Page (`/`)
- **Hero Slider**: Promotional banners and campaigns
- **Flash Deals**: Time-limited special offers with countdown timers
- **Popular Categories**: Quick access to major product categories
- **Featured Brands**: Showcasing partnered and premium brands
- **Product Listings**: Various sections for trending, new arrivals, and best sellers
- **App Download Section**: Promoting the mobile application

#### 2. Product Detail Page (`/product/:slug`)
- **Product Gallery**: Multiple product images
- **Product Information**: Title, price, description, specifications
- **Variants Selection**: Options for color, size, etc.
- **Add to Cart/Buy Now**: Purchase options
- **Product Description**: Detailed information and specifications
- **Reviews Section**: Customer ratings and reviews
- **Related Products**: Similar or complementary items

#### 3. Shopping Cart Page (`/cart`)
- **Cart Items List**: Products added to cart
- **Quantity Adjustment**: Increase/decrease product quantity
- **Price Calculation**: Subtotal, shipping, taxes, total
- **Removal Options**: Remove items from cart
- **Checkout Button**: Proceed to payment

#### 4. Account Pages
- **Login/Register** (`/account`): User authentication
- **My Account**: User profile and settings
- **Order History**: Past and current orders
- **Wishlist**: Saved products for future purchase

#### 5. Information Pages
- **About Us** (`/about`): Company information and mission
- **Careers** (`/careers`): Job opportunities
- **Terms of Use** (`/terms`): Legal terms and conditions
- **Privacy Policy** (`/privacy`): Data handling policies
- **Seller Center** (`/seller`): Information for potential sellers
- **Help Center** (`/help`): Support resources and guides
- **Contact Us** (`/contact`): Communication channels
- **Return Policy** (`/return-policy`): Product return guidelines
- **Report Issue** (`/report`): Problem reporting system
- **FAQ** (`/faq`): Frequently asked questions

### Admin Dashboard Pages

#### 1. Dashboard Home (`/admin`)
- **Statistics Overview**: Sales, orders, products, customers
- **Performance Metrics**: Charts and graphs
- **Recent Orders**: Latest transactions
- **Quick Actions**: Shortcuts to common tasks

#### 2. Products Management
- **All Products** (`/admin/products`): Complete product listing
- **Yapee Mall Products** (`/admin/products/yapee-mall`): Premium/official products
- **Add Product** (`/admin/products/new`): Create new product
- **Edit Product** (`/admin/products/:id/edit`): Modify existing product

#### 3. Categories Management (`/admin/categories`)
- **Categories List**: Hierarchical category structure
- **Add/Edit Categories**: Create or modify categories
- **Category Relationships**: Parent-child associations

#### 4. Orders Management
- **All Orders** (`/admin/orders`): Complete orders listing
- **Filtered Views**:
  - Pending Orders (`/admin/orders/pending`)
  - Processing Orders (`/admin/orders/processing`)
  - Shipping Orders (`/admin/orders/shipping`)
  - Delivered Orders (`/admin/orders/delivered`)
  - Cancelled Orders (`/admin/orders/cancelled`)

#### 5. Other Admin Sections
- **Brands Management** (`/admin/brands`): Manage product brands
- **Shipping Management** (`/admin/shipping`): Delivery options
- **Payments Management** (`/admin/payments`): Payment methods
- **Reports** (`/admin/reports`): Analytics and statistics
- **Users Management** (`/admin/users`): Customer accounts
- **Settings** (`/admin/settings`): Site configuration

## Components and UI Elements

### Layout Components
- **Header**: Navigation, search, language selection
- **Footer**: Site information, links, social media
- **Admin Layout**: Admin dashboard navigation and structure

### Common Components
- **Product Card**: Displays product in listings
- **Category Card**: Shows category with icon/image
- **Button Components**: Various button styles
- **Form Elements**: Inputs, selects, checkboxes
- **Modal Dialogs**: For confirmations and alerts
- **Toast Notifications**: For feedback messages
- **Pagination**: For navigating multiple pages of content

### Feature Components
- **Language Switcher**: For multilingual support
- **Search Bar**: For product search
- **Flash Deal Timer**: Countdown for limited offers
- **Shopping Cart Dropdown**: Quick cart access
- **Product Filters**: For refining product listings
- **Star Rating**: For product reviews

## Backend Features

### API Endpoints

#### Products
- `GET /api/products`: List all products
- `GET /api/products/:id`: Get product details
- `GET /api/products/slug/:slug`: Get product by slug
- `GET /api/products/search/:query`: Search products

#### Categories
- `GET /api/categories`: List all categories
- `GET /api/categories/:id`: Get category details

#### Cart
- `GET /api/cart/:sessionId`: Get cart for session
- `POST /api/cart`: Create new cart
- `POST /api/cart/items`: Add item to cart
- `PUT /api/cart/items/:id`: Update cart item
- `DELETE /api/cart/items/:id`: Remove cart item

#### Other Endpoints
- `GET /api/brands`: List all brands
- `GET /api/flash-deals`: Get current flash deals
- `GET /api/banners`: Get promotional banners

### Database Schema

#### Main Tables
- **Users**: Customer and admin accounts
- **Categories**: Product classification
- **Products**: Items for sale
- **Carts**: Shopping carts
- **Cart Items**: Products in carts
- **Brands**: Product manufacturers
- **Flash Deals**: Time-limited offers
- **Banners**: Promotional images

## Technologies Used

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components
- **TanStack Query**: Data fetching and caching
- **wouter**: Routing
- **react-hook-form**: Form handling
- **Zod**: Schema validation
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Drizzle ORM**: Database toolkit
- **PostgreSQL**: Relational database
- **Vite**: Development server

## Multilingual Support
- Vietnamese (vi)
- English (en)
- Chinese (zh)

## Admin Features
- Complete product lifecycle management
- Order processing and tracking
- Customer management
- Analytics and reporting
- Content management for banners and promotions

## User Features
- Account creation and management
- Product browsing and searching
- Shopping cart and checkout
- Order tracking
- Multiple language support

## Mobile Responsiveness
The website is fully responsive, providing optimal viewing and interaction experience across various devices:
- Desktop computers
- Tablets
- Mobile phones

## SEO Implementation
- Unique, descriptive page titles
- Meta descriptions
- Open Graph tags for social media sharing
- Semantic HTML structure
- Responsive images with alt text