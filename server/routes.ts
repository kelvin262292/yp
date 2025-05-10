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
  insertBannerSchema
} from "@shared/schema";
import { nanoid } from "nanoid";

// Khởi tạo Stripe với khóa API
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Thiếu khóa API STRIPE_SECRET_KEY cho Stripe');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";
  
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
      
      // Tạo payment intent với Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Số tiền đã là VND nên không cần nhân với 100
        currency: "vnd",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
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
  
  const httpServer = createServer(app);
  return httpServer;
}
