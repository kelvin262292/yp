import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { 
  insertCartItemSchema, 
  insertCartSchema, 
  insertProductSchema, 
  insertCategorySchema, 
  insertBrandSchema,
  insertFlashDealSchema,
  insertBannerSchema,
  insertUserSchema,
  reviews, insertReviewSchema,
  insertDiscountCodeSchema,
  discountCodes,
  userDiscountUsage,
  users, products, categories, brands, flashDeals, banners, 
  orders, orderItems, cartItems, carts 
} from "@shared/schema";
import { nanoid } from "nanoid";
import passport from "passport";
import bcrypt from "bcryptjs";
import { isAuthenticated, isAdmin } from "./auth-middleware";
import express from 'express';
import { db } from './db';
import { eq, and, like, desc, asc, sql, or, gte, lte, isNull, count, avg, sum, ne, gt, lt, inArray } from 'drizzle-orm';
import adminRouter from './routes/admin';

// Khởi tạo Stripe với khóa API
let stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.log('Sử dụng khóa Stripe giả cho môi trường phát triển');
    stripeKey = 'sk_test_mock_key_for_development';
  } else {
    throw new Error('Thiếu khóa API STRIPE_SECRET_KEY cho Stripe');
  }
}
const stripe = new Stripe(stripeKey, {
  apiVersion: "2023-10-16",
});

const router = express.Router();

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";
  
  // Register admin routes
  app.use(`${apiPrefix}/admin`, adminRouter);
  
  // Authentication Routes
  app.post(`${apiPrefix}/auth/login`, (req: Request, res: Response, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info.message || 'Đăng nhập thất bại' });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        
        req.session.isAuthenticated = true;
        req.session.userId = user.id;
        
        return res.json({
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        });
      });
    })(req, res, next);
  });
  
  app.post(`${apiPrefix}/auth/register`, async (req: Request, res: Response) => {
    try {
      // Validate request body
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        role: 'user' // Default role is user
      });
      
      return res.status(201).json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error('Lỗi đăng ký người dùng:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký' });
    }
  });
  
  app.post(`${apiPrefix}/auth/logout`, (req: Request, res: Response) => {
    req.logout(() => {
      req.session.destroy((err) => {
        if (err) {
          console.error('Lỗi khi xóa session:', err);
          return res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng xuất' });
        }
        
        res.clearCookie('connect.sid');
        return res.json({ message: 'Đăng xuất thành công' });
      });
    });
  });
  
  app.post(`${apiPrefix}/auth/password-reset`, async (req: Request, res: Response) => {
    // TODO: Implement password reset functionality
    return res.status(501).json({ message: 'Chức năng đang được phát triển' });
  });
  
  app.get(`${apiPrefix}/auth/me`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId!);
      
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
      }
      
      return res.json({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' });
    }
  });
  
  // Categories
  app.get(`${apiPrefix}/categories`, async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error getting categories:", error);
      res.status(500).json({ message: "Error retrieving categories" });
    }
  });
  
  app.get(`${apiPrefix}/categories/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error getting category:", error);
      res.status(500).json({ message: "Error retrieving category" });
    }
  });
  
  // Products
  app.get(`${apiPrefix}/products`, async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const isFeatured = req.query.isFeatured === 'true';
      const isHotDeal = req.query.isHotDeal === 'true';
      const isBestSeller = req.query.isBestSeller === 'true';
      const isNewArrival = req.query.isNewArrival === 'true';
      
      const products = await storage.getProducts({ 
        categoryId, 
        limit, 
        isFeatured,
        isHotDeal,
        isBestSeller,
        isNewArrival
      });
      
      res.json(products);
    } catch (error) {
      console.error("Error getting products:", error);
      res.status(500).json({ message: "Error retrieving products" });
    }
  });
  
  app.get(`${apiPrefix}/products/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error getting product:", error);
      res.status(500).json({ message: "Error retrieving product" });
    }
  });
  
  app.get(`${apiPrefix}/products/slug/:slug`, async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error getting product by slug:", error);
      res.status(500).json({ message: "Error retrieving product" });
    }
  });
  
  app.get(`${apiPrefix}/products/search/:query`, async (req: Request, res: Response) => {
    try {
      const query = req.params.query;
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Error searching products" });
    }
  });
  
  // Brands
  app.get(`${apiPrefix}/brands`, async (req: Request, res: Response) => {
    try {
      const isFeatured = req.query.isFeatured === 'true';
      const brands = await storage.getBrands({ isFeatured });
      res.json(brands);
    } catch (error) {
      console.error("Error getting brands:", error);
      res.status(500).json({ message: "Error retrieving brands" });
    }
  });
  
  app.get(`${apiPrefix}/brands/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const brand = await storage.getBrandById(id);
      
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      
      res.json(brand);
    } catch (error) {
      console.error("Error getting brand:", error);
      res.status(500).json({ message: "Error retrieving brand" });
    }
  });
  
  // Flash deals
  app.get(`${apiPrefix}/flash-deals`, async (req: Request, res: Response) => {
    try {
      const flashDeals = await storage.getFlashDeals();
      res.json(flashDeals);
    } catch (error) {
      console.error("Error getting flash deals:", error);
      res.status(500).json({ message: "Error retrieving flash deals" });
    }
  });
  
  app.get(`${apiPrefix}/flash-deals/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const flashDeal = await storage.getFlashDealById(id);
      
      if (!flashDeal) {
        return res.status(404).json({ message: "Flash deal not found" });
      }
      
      res.json(flashDeal);
    } catch (error) {
      console.error("Error getting flash deal:", error);
      res.status(500).json({ message: "Error retrieving flash deal" });
    }
  });
  
  // Banners
  app.get(`${apiPrefix}/banners`, async (req: Request, res: Response) => {
    try {
      const isActive = req.query.isActive === 'true';
      const banners = await storage.getBanners({ isActive });
      res.json(banners);
    } catch (error) {
      console.error("Error getting banners:", error);
      res.status(500).json({ message: "Error retrieving banners" });
    }
  });
  
  // Cart
  app.get(`${apiPrefix}/cart/:sessionId`, async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId;
      let cart = await storage.getCartBySessionId(sessionId);
      
      if (!cart) {
        // Create a new cart if one doesn't exist
        cart = await storage.createCart({ 
          userId: null as any,
          sessionId 
        });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      
      // Fetch product details for each cart item
      const cartItemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json({
        ...cart,
        items: cartItemsWithProducts
      });
    } catch (error) {
      console.error("Error getting cart:", error);
      res.status(500).json({ message: "Error retrieving cart" });
    }
  });
  
  app.post(`${apiPrefix}/cart`, async (req: Request, res: Response) => {
    try {
      // Generate a random session ID if one is not provided
      const sessionId = req.body.sessionId || nanoid();
      
      // Check if a cart with this session ID already exists
      let cart = await storage.getCartBySessionId(sessionId);
      
      if (!cart) {
        // Validate request
        const cartData = insertCartSchema.parse({
          sessionId,
          userId: req.body.userId || null
        });
        
        // Create a new cart
        cart = await storage.createCart(cartData);
      }
      
      res.status(201).json(cart);
    } catch (error) {
      console.error("Error creating cart:", error);
      res.status(500).json({ message: "Error creating cart" });
    }
  });
  
  app.post(`${apiPrefix}/cart/items`, async (req: Request, res: Response) => {
    try {
      // Validate request
      const cartItemData = insertCartItemSchema.parse({
        cartId: req.body.cartId,
        productId: req.body.productId,
        quantity: req.body.quantity
      });
      
      // Check if product exists
      const product = await storage.getProductById(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if cart exists
      const cart = await storage.getCart(cartItemData.cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      // Add item to cart
      const cartItem = await storage.addCartItem(cartItemData);
      
      // Get updated cart with items
      const cartItems = await storage.getCartItems(cart.id);
      const cartItemsWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.status(201).json({
        item: cartItem,
        cart: {
          ...cart,
          items: cartItemsWithProducts
        }
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ message: "Error adding item to cart" });
    }
  });
  
  app.put(`${apiPrefix}/cart/items/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedCartItem = await storage.updateCartItemQuantity(id, quantity);
      
      if (!updatedCartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedCartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Error updating cart item" });
    }
  });
  
  app.delete(`${apiPrefix}/cart/items/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeCartItem(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Error removing cart item" });
    }
  });
  
  // Admin API endpoints
  
  // Products admin endpoints
  app.post(`${apiPrefix}/admin/products`, async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Error creating product" });
    }
  });
  
  app.put(`${apiPrefix}/admin/products/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      // Validate product exists
      const existingProduct = await storage.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Update product logic would go here
      // Currently, our storage interface doesn't have an updateProduct method
      // This is where we would implement it in a real application
      
      res.json({ message: "Product updated successfully", id });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product" });
    }
  });
  
  app.delete(`${apiPrefix}/admin/products/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      // Delete product logic would go here
      // Currently, our storage interface doesn't have a deleteProduct method
      // This is where we would implement it in a real application
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Error deleting product" });
    }
  });
  
  // Categories admin endpoints
  app.post(`${apiPrefix}/admin/categories`, async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Error creating category" });
    }
  });
  
  app.put(`${apiPrefix}/admin/categories/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      // Validate category exists
      const existingCategory = await storage.getCategoryById(id);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // Update category logic would go here
      
      res.json({ message: "Category updated successfully", id });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Error updating category" });
    }
  });
  
  app.delete(`${apiPrefix}/admin/categories/:id`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      // Delete category logic would go here
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Error deleting category" });
    }
  });
  
  // Brands admin endpoints
  app.post(`${apiPrefix}/admin/brands`, async (req: Request, res: Response) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(500).json({ message: "Error creating brand" });
    }
  });
  
  // Flash deals admin endpoints
  app.post(`${apiPrefix}/admin/flash-deals`, async (req: Request, res: Response) => {
    try {
      const flashDealData = insertFlashDealSchema.parse(req.body);
      const flashDeal = await storage.createFlashDeal(flashDealData);
      res.status(201).json(flashDeal);
    } catch (error) {
      console.error("Error creating flash deal:", error);
      res.status(500).json({ message: "Error creating flash deal" });
    }
  });
  
  app.put(`${apiPrefix}/admin/flash-deals/:id/sold-count`, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { increment } = req.body;
      
      if (typeof increment !== 'number') {
        return res.status(400).json({ message: "Invalid increment value" });
      }
      
      const updatedFlashDeal = await storage.updateFlashDealSoldCount(id, increment);
      if (!updatedFlashDeal) {
        return res.status(404).json({ message: "Flash deal not found" });
      }
      
      res.json(updatedFlashDeal);
    } catch (error) {
      console.error("Error updating flash deal sold count:", error);
      res.status(500).json({ message: "Error updating flash deal sold count" });
    }
  });
  
  // Banners admin endpoints
  app.post(`${apiPrefix}/admin/banners`, async (req: Request, res: Response) => {
    try {
      const bannerData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(bannerData);
      res.status(201).json(banner);
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({ message: "Error creating banner" });
    }
  });
  
  // Admin dashboard stats
  app.get(`${apiPrefix}/admin/stats`, async (req: Request, res: Response) => {
    try {
      // In a real application, we would implement logic to gather statistics
      // For now, we'll return mock data
      res.json({
        totalProducts: 120,
        totalOrders: 450,
        totalSales: 12500,
        totalCustomers: 300,
        recentOrders: [],
        salesData: []
      });
    } catch (error) {
      console.error("Error getting admin stats:", error);
      res.status(500).json({ message: "Error getting admin stats" });
    }
  });

  // API thanh toán với Stripe
  app.post(`${apiPrefix}/create-payment-intent`, async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Số tiền không hợp lệ" });
      }
      
      console.log("Đang tạo payment intent với số tiền:", amount);
      
      // Tạo payment intent với Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // VND không có phần thập phân nên không cần nhân với 100
        currency: "vnd",
        payment_method_types: ['card'],
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      console.log("Đã tạo payment intent thành công:", paymentIntent.id);
      
      // Trả về client secret
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Lỗi khi tạo payment intent:", error);
      res.status(500).json({ 
        message: "Lỗi khi xử lý thanh toán",
        error: error.message 
      });
    }
  });
  
  // Payment Confirmation Route
  app.post(`${apiPrefix}/confirm-payment`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { orderId, paymentIntentId } = req.body;
      
      if (!orderId || !paymentIntentId) {
        return res.status(400).json({ message: "Order ID and Payment Intent ID are required" });
      }
      
      // Update order payment status
      const updatedOrder = await storage.updatePaymentStatus(
        parseInt(orderId), 
        'completed', 
        paymentIntentId
      );
      
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json({ 
        success: true, 
        order: updatedOrder 
      });
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Error confirming payment" });
    }
  });
  
  // Order routes for user
  app.get(`${apiPrefix}/orders`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const orders = await storage.getOrders({ userId, limit, offset });
      
      // Fetch items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            items
          };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      console.error("Error getting orders:", error);
      res.status(500).json({ message: "Error retrieving orders" });
    }
  });

  app.get(`${apiPrefix}/orders/:id`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId;
      
      const order = await storage.getOrderWithItems(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if the order belongs to the user
      if (order.userId !== userId) {
        return res.status(403).json({ message: "You don't have permission to access this order" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error getting order:", error);
      res.status(500).json({ message: "Error retrieving order" });
    }
  });

  app.post(`${apiPrefix}/orders`, isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId;
      const { 
        totalAmount, 
        shippingAddress, 
        shippingCity, 
        shippingProvince, 
        shippingPostalCode, 
        shippingPhone, 
        shippingName, 
        paymentMethod,
        notes,
        cartItems 
      } = req.body;
      
      // Validate required fields
      if (!totalAmount || !paymentMethod || !cartItems || !cartItems.length) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Create order
      const order = await storage.createOrder({
        userId,
        totalAmount,
        shippingAddress,
        shippingCity,
        shippingProvince,
        shippingPostalCode,
        shippingPhone,
        shippingName,
        paymentMethod,
        notes
      });
      
      // Add order items
      const orderItemsPromises = cartItems.map(async (item: any) => {
        const product = await storage.getProductById(item.productId);
        
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        
        // Update product stock
        await storage.updateProductStock(product.id, item.quantity);
        
        // Add order item
        return storage.addOrderItem({
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
          imageUrl: product.imageUrl
        });
      });
      
      const items = await Promise.all(orderItemsPromises);
      
      res.status(201).json({
        ...order,
        items
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  });

  // Admin order routes
  app.get(`${apiPrefix}/admin/orders`, isAdmin, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const orders = await storage.getOrders({ 
        status, 
        limit, 
        offset 
      });
      
      // Fetch items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            items
          };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      console.error("Error getting admin orders:", error);
      res.status(500).json({ message: "Error retrieving orders" });
    }
  });

  app.patch(`${apiPrefix}/admin/orders/:id/status`, isAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.getOrderById(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Error updating order status" });
    }
  });

  app.get(`${apiPrefix}/admin/orders/stats`, isAdmin, async (req: Request, res: Response) => {
    try {
      // In a real application, we would implement statistics functionality
      // For now, we'll return basic mock stats
      res.json({
        totalOrders: 150,
        pendingOrders: 25,
        processingOrders: 35,
        shippingOrders: 40,
        deliveredOrders: 40, 
        cancelledOrders: 10,
        totalRevenue: 15000000,
      });
    } catch (error) {
      console.error("Error getting order stats:", error);
      res.status(500).json({ message: "Error retrieving order statistics" });
    }
  });

  // Webhook route for Stripe to update payment status
  app.post(`${apiPrefix}/webhooks/stripe`, async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Update order payment status
        if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
          const orderId = parseInt(paymentIntent.metadata.orderId);
          await storage.updatePaymentStatus(orderId, 'completed', paymentIntent.id);
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        
        // Update order payment status to failed
        if (failedPaymentIntent.metadata && failedPaymentIntent.metadata.orderId) {
          const orderId = parseInt(failedPaymentIntent.metadata.orderId);
          await storage.updatePaymentStatus(orderId, 'failed', failedPaymentIntent.id);
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  });
  
  // Reviews endpoints
  app.get('/api/products/:id/reviews', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Fetch reviews for the product
      const productReviews = await db.query.reviews.findMany({
        where: eq(reviews.productId, productId),
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              fullName: true,
            }
          }
        },
        offset: offset,
        limit: limit,
        orderBy: [desc(reviews.createdAt)]
      });

      // Get total count for pagination
      const totalCount = await db
        .select({ count: count() })
        .from(reviews)
        .where(eq(reviews.productId, productId));

      // Calculate average rating
      const ratingStats = await db
        .select({
          averageRating: avg(reviews.rating),
          totalReviews: count()
        })
        .from(reviews)
        .where(eq(reviews.productId, productId));

      // Get rating distribution
      const ratingDistribution = await db
        .select({
          rating: reviews.rating,
          count: count()
        })
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .groupBy(reviews.rating);

      return res.json({
        reviews: productReviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount[0].count / limit),
          totalItems: totalCount[0].count,
          itemsPerPage: limit
        },
        stats: {
          averageRating: ratingStats[0]?.averageRating || 0,
          totalReviews: ratingStats[0]?.totalReviews || 0,
          distribution: ratingDistribution
        }
      });
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/products/:id/reviews', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = req.user.id;

      // Validate review data
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId,
        userId
      });

      // Check if user has already reviewed this product
      const existingReview = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productId, productId),
          eq(reviews.userId, userId)
        )
      });

      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this product' });
      }

      // Check if product exists
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId)
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if user has purchased the product (optional, for verified purchase)
      const hasOrderedProduct = await db
        .select()
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(and(
          eq(orderItems.productId, productId),
          eq(orders.userId, userId),
          eq(orders.status, 'completed')
        ))
        .limit(1);

      // Insert review
      const newReview = await db.insert(reviews).values({
        ...reviewData,
        isVerifiedPurchase: hasOrderedProduct.length > 0
      }).returning();

      // Update product rating and review count
      const allProductReviews = await db
        .select({
          averageRating: avg(reviews.rating),
          totalReviews: count()
        })
        .from(reviews)
        .where(eq(reviews.productId, productId));

      await db.update(products)
        .set({
          rating: allProductReviews[0]?.averageRating || product.rating,
          reviewCount: allProductReviews[0]?.totalReviews || product.reviewCount
        })
        .where(eq(products.id, productId));

      return res.status(201).json(newReview[0]);
    } catch (error) {
      console.error('Error creating product review:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/products/:productId/reviews/:reviewId', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.id;

      // Check if review belongs to user or user is admin
      const review = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.id, reviewId),
          eq(reviews.productId, productId)
        )
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (review.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You are not authorized to edit this review' });
      }

      // Update review
      const updatedReview = await db.update(reviews)
        .set({
          rating: req.body.rating || review.rating,
          title: req.body.title || review.title,
          comment: req.body.comment || review.comment,
          updatedAt: new Date()
        })
        .where(eq(reviews.id, reviewId))
        .returning();

      // Update product rating
      const allProductReviews = await db
        .select({
          averageRating: avg(reviews.rating),
          totalReviews: count()
        })
        .from(reviews)
        .where(eq(reviews.productId, productId));

      await db.update(products)
        .set({
          rating: allProductReviews[0]?.averageRating || 0,
          reviewCount: allProductReviews[0]?.totalReviews || 0
        })
        .where(eq(products.id, productId));

      return res.json(updatedReview[0]);
    } catch (error) {
      console.error('Error updating product review:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/products/:productId/reviews/:reviewId', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviewId = parseInt(req.params.reviewId);
      const userId = req.user.id;

      // Check if review belongs to user or user is admin
      const review = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.id, reviewId),
          eq(reviews.productId, productId)
        )
      });

      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (review.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You are not authorized to delete this review' });
      }

      // Delete review
      await db.delete(reviews)
        .where(eq(reviews.id, reviewId));

      // Update product rating
      const allProductReviews = await db
        .select({
          averageRating: avg(reviews.rating),
          totalReviews: count()
        })
        .from(reviews)
        .where(eq(reviews.productId, productId));

      await db.update(products)
        .set({
          rating: allProductReviews[0]?.averageRating || 0,
          reviewCount: allProductReviews[0]?.totalReviews || 0
        })
        .where(eq(products.id, productId));

      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting product review:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Flash Deals endpoints
  app.get('/api/flash-deals/active', async (req, res) => {
    try {
      const currentDate = new Date();

      // Sử dụng SQL trực tiếp
      const activeFlashDeals = await db.select({
          id: flashDeals.id,
          productId: flashDeals.productId,
          startDate: flashDeals.startDate,
          endDate: flashDeals.endDate,
          totalStock: flashDeals.totalStock,
          soldCount: flashDeals.soldCount,
          product: products
      })
      .from(flashDeals)
      .leftJoin(products, eq(flashDeals.productId, products.id))
      .where(
        and(
          lte(flashDeals.startDate, currentDate), 
          gte(flashDeals.endDate, currentDate)
        )
      )
      .orderBy(asc(flashDeals.endDate));
      
      if (activeFlashDeals.length === 0) {
        return res.status(404).json({ message: "No active flash deals found" });
      }

      res.json(activeFlashDeals);
    } catch (error) {
      console.error("Error getting active flash deals:", error);
      res.status(500).json({ message: "Error retrieving active flash deals" });
    }
  });

  // Admin flash deals endpoints
  app.post('/api/flash-deals', isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { productId, startDate, endDate, totalStock } = req.body;

      // Validate required fields
      if (!productId || !startDate || !endDate || !totalStock) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if product exists
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId)
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Check if product already has an active flash deal
      const existingDeal = await db.query.flashDeals.findFirst({
        where: and(
          eq(flashDeals.productId, productId),
          gte(flashDeals.endDate, new Date())
        )
      });

      if (existingDeal) {
        return res.status(400).json({ error: 'Product already has an active flash deal' });
      }

      // Create new flash deal
      const newFlashDeal = await db.insert(flashDeals).values({
        productId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalStock,
        soldCount: 0
      }).returning();

      // Update product to mark it as a hot deal
      await db.update(products)
        .set({ isHotDeal: true })
        .where(eq(products.id, productId));

      return res.status(201).json(newFlashDeal[0]);
    } catch (error) {
      console.error('Error creating flash deal:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/flash-deals/:id', isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const dealId = parseInt(req.params.id);
      const { startDate, endDate, totalStock } = req.body;

      // Find flash deal
      const flashDeal = await db.query.flashDeals.findFirst({
        where: eq(flashDeals.id, dealId)
      });

      if (!flashDeal) {
        return res.status(404).json({ error: 'Flash deal not found' });
      }

      // Update flash deal
      const updatedDeal = await db.update(flashDeals)
        .set({
          startDate: startDate ? new Date(startDate) : flashDeal.startDate,
          endDate: endDate ? new Date(endDate) : flashDeal.endDate,
          totalStock: totalStock || flashDeal.totalStock
        })
        .where(eq(flashDeals.id, dealId))
        .returning();

      return res.json(updatedDeal[0]);
    } catch (error) {
      console.error('Error updating flash deal:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/flash-deals/:id', isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const dealId = parseInt(req.params.id);

      // Find flash deal
      const flashDeal = await db.query.flashDeals.findFirst({
        where: eq(flashDeals.id, dealId)
      });

      if (!flashDeal) {
        return res.status(404).json({ error: 'Flash deal not found' });
      }

      // Delete flash deal
      await db.delete(flashDeals)
        .where(eq(flashDeals.id, dealId));

      // Update product to remove hot deal flag if this was the only flash deal for the product
      const remainingDeals = await db.query.flashDeals.findMany({
        where: and(
          eq(flashDeals.productId, flashDeal.productId),
          gte(flashDeals.endDate, new Date())
        )
      });

      if (remainingDeals.length === 0) {
        await db.update(products)
          .set({ isHotDeal: false })
          .where(eq(products.id, flashDeal.productId));
      }

      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting flash deal:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Discount code endpoints
  app.get('/api/discount-codes', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const discountCodesData = await db.query.discountCodes.findMany({
        orderBy: [desc(discountCodes.createdAt)]
      });

      return res.json(discountCodesData);
    } catch (error) {
      console.error('Error fetching discount codes:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/discount-codes/:code/validate', isAuthenticated, async (req, res) => {
    try {
      const code = req.params.code;
      const userId = req.user.id;
      
      // Find discount code
      const discountCode = await db.query.discountCodes.findFirst({
        where: eq(discountCodes.code, code)
      });

      if (!discountCode) {
        return res.status(404).json({ valid: false, error: 'Discount code not found' });
      }

      // Check if code is active
      if (!discountCode.isActive) {
        return res.status(400).json({ valid: false, error: 'Discount code is inactive' });
      }

      // Check if code is expired
      const currentDate = new Date();
      if (discountCode.startDate > currentDate || discountCode.endDate < currentDate) {
        return res.status(400).json({ valid: false, error: 'Discount code is expired or not yet active' });
      }

      // Check if usage limit is reached
      if (discountCode.usageLimit !== null && discountCode.usageCount >= discountCode.usageLimit) {
        return res.status(400).json({ valid: false, error: 'Discount code usage limit reached' });
      }

      // Check if one-time use and user has already used it
      if (discountCode.isOneTimeUse) {
        const userUsage = await db.query.userDiscountUsage.findFirst({
          where: and(
            eq(userDiscountUsage.userId, userId),
            eq(userDiscountUsage.discountCodeId, discountCode.id)
          )
        });

        if (userUsage) {
          return res.status(400).json({ valid: false, error: 'You have already used this discount code' });
        }
      }

      return res.json({
        valid: true,
        discountCode: {
          id: discountCode.id,
          code: discountCode.code,
          discountType: discountCode.discountType,
          discountValue: discountCode.discountValue,
          minOrderValue: discountCode.minOrderValue,
          maxDiscountAmount: discountCode.maxDiscountAmount
        }
      });
    } catch (error) {
      console.error('Error validating discount code:', error);
      return res.status(500).json({ valid: false, error: 'Internal server error' });
    }
  });

  app.post('/api/discount-codes', isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const discountCodeData = insertDiscountCodeSchema.parse(req.body);

      // Check if code already exists
      const existingCode = await db.query.discountCodes.findFirst({
        where: eq(discountCodes.code, discountCodeData.code)
      });

      if (existingCode) {
        return res.status(400).json({ error: 'Discount code already exists' });
      }

      // Create new discount code
      const newDiscountCode = await db.insert(discountCodes).values(discountCodeData).returning();

      return res.status(201).json(newDiscountCode[0]);
    } catch (error) {
      console.error('Error creating discount code:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/discount-codes/:id', isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const discountCodeId = parseInt(req.params.id);
      const updateData = req.body;

      // Check if discount code exists
      const discountCode = await db.query.discountCodes.findFirst({
        where: eq(discountCodes.id, discountCodeId)
      });

      if (!discountCode) {
        return res.status(404).json({ error: 'Discount code not found' });
      }

      // Update discount code
      const updatedDiscountCode = await db.update(discountCodes)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(discountCodes.id, discountCodeId))
        .returning();

      return res.json(updatedDiscountCode[0]);
    } catch (error) {
      console.error('Error updating discount code:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/discount-codes/:id', isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const discountCodeId = parseInt(req.params.id);

      // Check if discount code exists
      const discountCode = await db.query.discountCodes.findFirst({
        where: eq(discountCodes.id, discountCodeId)
      });

      if (!discountCode) {
        return res.status(404).json({ error: 'Discount code not found' });
      }

      // Check if discount code has been used
      const usageCount = await db.query.userDiscountUsage.findMany({
        where: eq(userDiscountUsage.discountCodeId, discountCodeId)
      });

      if (usageCount.length > 0) {
        // Instead of deleting, deactivate the discount code
        await db.update(discountCodes)
          .set({ 
            isActive: false,
            updatedAt: new Date()
          })
          .where(eq(discountCodes.id, discountCodeId));

        return res.json({ success: true, message: 'Discount code has been deactivated as it has been used' });
      }

      // Delete discount code if not used
      await db.delete(discountCodes)
        .where(eq(discountCodes.id, discountCodeId));

      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting discount code:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Product Recommendation endpoints
  app.get('/api/products/:id/recommendations', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      // Find the product
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
        with: {
          category: true
        }
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Get recommendations based on:
      // 1. Same category, similar price range
      // 2. Same brand
      // 3. Popular products (high rating)
      
      // Get products from same category with similar price range
      let similarProducts = await db.query.products.findMany({
        where: and(
          eq(products.categoryId, product.categoryId),
          ne(products.id, productId),
          gte(products.price, product.price * 0.7), // 70% to 130% of the price
          lte(products.price, product.price * 1.3)
        ),
        limit: 5,
        orderBy: [desc(products.rating)]
      });

      // If not enough products, get products from same brand
      if (similarProducts.length < 5 && product.brandId) {
        const brandProducts = await db.query.products.findMany({
          where: and(
            eq(products.brandId, product.brandId),
            ne(products.id, productId),
            not(inArray(products.id, similarProducts.map(p => p.id)))
          ),
          limit: 5 - similarProducts.length,
          orderBy: [desc(products.rating)]
        });
        
        similarProducts = [...similarProducts, ...brandProducts];
      }

      // If still not enough, get popular products
      if (similarProducts.length < 10) {
        const popularProducts = await db.query.products.findMany({
          where: and(
            ne(products.id, productId),
            not(inArray(products.id, similarProducts.map(p => p.id)))
          ),
          limit: 10 - similarProducts.length,
          orderBy: [desc(products.rating), desc(products.reviewCount)]
        });
        
        similarProducts = [...similarProducts, ...popularProducts];
      }

      return res.json(similarProducts);
    } catch (error) {
      console.error('Error getting product recommendations:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Recently viewed products endpoint (uses session storage on client)

  // Get frequently bought together products
  app.get('/api/products/:id/frequently-bought-together', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      // Find the product
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId)
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Find orders containing this product
      const ordersWithProduct = await db
        .select({ orderId: orderItems.orderId })
        .from(orderItems)
        .where(eq(orderItems.productId, productId));
      
      if (ordersWithProduct.length === 0) {
        // Return popular products if no orders found
        const popularProducts = await db.query.products.findMany({
          where: ne(products.id, productId),
          limit: 4,
          orderBy: [desc(products.rating), desc(products.reviewCount)]
        });
        
        return res.json(popularProducts);
      }
      
      // Get other products from same orders
      const orderIds = ordersWithProduct.map(o => o.orderId);
      
      const frequentlyBoughtProducts = await db
        .select({
          productId: orderItems.productId,
          count: count()
        })
        .from(orderItems)
        .where(and(
          inArray(orderItems.orderId, orderIds),
          ne(orderItems.productId, productId)
        ))
        .groupBy(orderItems.productId)
        .orderBy(desc(sql`count`))
        .limit(4);
      
      // Get full product details
      const productIds = frequentlyBoughtProducts.map(p => p.productId);
      const productDetails = await db.query.products.findMany({
        where: inArray(products.id, productIds)
      });
      
      // Sort by frequency
      const sortedProducts = productIds.map(id => 
        productDetails.find(p => p.id === id)
      ).filter(Boolean);
      
      return res.json(sortedProducts);
    } catch (error) {
      console.error('Error getting frequently bought products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // YapeeMall endpoints
  app.get('/api/brands/featured', async (req, res) => {
    try {
      const featuredBrands = await db.query.brands.findMany({
        where: eq(brands.isFeatured, true),
        orderBy: [asc(brands.name)]
      });

      return res.json(featuredBrands);
    } catch (error) {
      console.error('Error fetching featured brands:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/yapee-mall/products', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const offset = (page - 1) * limit;
      
      // Get brand IDs for brands marked as featured (YapeeMall brands)
      const featuredBrands = await db.query.brands.findMany({
        where: eq(brands.isFeatured, true),
        columns: { id: true }
      });
      
      const brandIds = featuredBrands.map(brand => brand.id);
      
      if (brandIds.length === 0) {
        return res.json({
          products: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit
          }
        });
      }
      
      // Get products from featured brands
      const products = await db.query.products.findMany({
        where: inArray(products.brandId, brandIds),
        with: {
          brand: true,
          category: true
        },
        limit: limit,
        offset: offset,
        orderBy: [desc(products.createdAt)]
      });
      
      // Get total count for pagination
      const totalCount = await db
        .select({ count: count() })
        .from(products)
        .where(inArray(products.brandId, brandIds));
      
      return res.json({
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount[0].count / limit),
          totalItems: totalCount[0].count,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      console.error('Error fetching YapeeMall products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

export default router;
