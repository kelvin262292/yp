import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertCartSchema } from "@shared/schema";
import { nanoid } from "nanoid";

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

  const httpServer = createServer(app);
  return httpServer;
}
