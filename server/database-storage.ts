import { eq, and, like, desc, asc, sql, or, isNull } from 'drizzle-orm';
import { db } from './db';
import type { IStorage } from './storage';
import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  carts, type Cart, type InsertCart,
  cartItems, type CartItem, type InsertCartItem,
  brands, type Brand, type InsertBrand,
  flashDeals, type FlashDeal, type InsertFlashDeal,
  banners, type Banner, type InsertBanner,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem
} from '@shared/schema';

export class DatabaseStorage implements IStorage {
  db: typeof db;

  constructor(db: typeof db) {
    this.db = db;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: typeof users.$inferInsert): Promise<User> {
    const [user] = await this.db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<typeof users.$inferInsert>): Promise<User | undefined> {
    const [updatedUser] = await this.db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await this.db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await this.db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [createdCategory] = await this.db.insert(categories).values(category).returning();
    return createdCategory;
  }

  // Product operations
  async getProducts(options?: {
    categoryId?: number,
    limit?: number,
    isFeatured?: boolean,
    isHotDeal?: boolean,
    isBestSeller?: boolean,
    isNewArrival?: boolean
  }): Promise<Product[]> {
    let query = this.db.select().from(products);

    if (options) {
      const conditions = [];

      if (options.categoryId) {
        conditions.push(eq(products.categoryId, options.categoryId));
      }

      if (options.isFeatured) {
        conditions.push(eq(products.isFeatured, true));
      }

      if (options.isHotDeal) {
        conditions.push(eq(products.isHotDeal, true));
      }

      if (options.isBestSeller) {
        conditions.push(eq(products.isBestSeller, true));
      }

      if (options.isNewArrival) {
        conditions.push(eq(products.isNewArrival, true));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }
    }

    return await query;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await this.db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await this.db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await this.db
      .select()
      .from(products)
      .where(
        or(
          like(sql`lower(${products.name})`, searchTerm),
          like(sql`lower(${products.nameEn})`, searchTerm),
          like(sql`lower(${products.nameZh})`, searchTerm),
          like(sql`lower(${products.description})`, searchTerm),
          like(sql`lower(${products.descriptionEn})`, searchTerm),
          like(sql`lower(${products.descriptionZh})`, searchTerm)
        )
      )
      .limit(20);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [createdProduct] = await this.db.insert(products).values(product).returning();
    return createdProduct;
  }

  async updateProductStock(id: number, quantity: number): Promise<boolean> {
    try {
      const [product] = await this.db.select().from(products).where(eq(products.id, id));
      
      if (!product) return false;
      
      const newStock = Math.max(0, (product.stock || 0) - quantity);
      await this.db.update(products)
        .set({ stock: newStock })
        .where(eq(products.id, id));
        
      return true;
    } catch (error) {
      console.error("Error updating product stock:", error);
      return false;
    }
  }

  // Cart operations
  async getCart(id: number): Promise<Cart | undefined> {
    const [cart] = await this.db.select().from(carts).where(eq(carts.id, id));
    return cart;
  }

  async getCartBySessionId(sessionId: string): Promise<Cart | undefined> {
    const [cart] = await this.db.select().from(carts).where(eq(carts.sessionId, sessionId));
    return cart;
  }

  async createCart(cart: InsertCart): Promise<Cart> {
    const [createdCart] = await this.db.insert(carts).values(cart).returning();
    return createdCart;
  }

  // Cart item operations
  async getCartItems(cartId: number): Promise<CartItem[]> {
    const items = await this.db.select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));
      
    return items;
  }

  async addCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists in the cart
    const [existingItem] = await this.db.select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartItem.cartId),
          eq(cartItems.productId, cartItem.productId)
        )
      );

    if (existingItem) {
      // Update the quantity of the existing item
      const newQuantity = existingItem.quantity + (cartItem.quantity || 1);
      const [updatedItem] = await this.db.update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    // Create a new cart item
    const [createdCartItem] = await this.db.insert(cartItems)
      .values({ ...cartItem, quantity: cartItem.quantity || 1 })
      .returning();
      
    return createdCartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedCartItem] = await this.db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
      
    return updatedCartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    const result = await this.db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount > 0;
  }

  // Brand operations
  async getBrands(options?: { isFeatured?: boolean }): Promise<Brand[]> {
    let query = this.db.select().from(brands);

    if (options?.isFeatured) {
      query = query.where(eq(brands.isFeatured, true));
    }

    return await query;
  }

  async getBrandById(id: number): Promise<Brand | undefined> {
    const [brand] = await this.db.select().from(brands).where(eq(brands.id, id));
    return brand;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [createdBrand] = await this.db.insert(brands).values(brand).returning();
    return createdBrand;
  }

  // Flash deal operations
  async getFlashDeals(): Promise<(FlashDeal & { product: Product })[]> {
    const deals = await this.db.select({
      id: flashDeals.id,
      productId: flashDeals.productId,
      startDate: flashDeals.startDate,
      endDate: flashDeals.endDate,
      totalStock: flashDeals.totalStock,
      soldCount: flashDeals.soldCount,
      product: products
    })
    .from(flashDeals)
    .innerJoin(products, eq(flashDeals.productId, products.id))
    .where(
      and(
        sql`${flashDeals.startDate} <= NOW()`,
        sql`${flashDeals.endDate} >= NOW()`
      )
    );
    
    return deals;
  }

  async getFlashDealById(id: number): Promise<(FlashDeal & { product: Product }) | undefined> {
    try {
      // Đảm bảo this.db được định nghĩa trước khi sử dụng
      if (!this.db) {
        console.error("Database connection is undefined");
        return undefined;
      }
      
      const [deal] = await this.db.select({
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
      .where(eq(flashDeals.id, id));

      return deal;
    } catch (error) {
      console.error("Error getting flash deal:", error);
      return undefined;
    }
  }

  async createFlashDeal(flashDeal: InsertFlashDeal): Promise<FlashDeal> {
    const [createdFlashDeal] = await this.db.insert(flashDeals).values(flashDeal).returning();
    return createdFlashDeal;
  }

  async updateFlashDealSoldCount(id: number, increment: number): Promise<FlashDeal | undefined> {
    try {
      const [flashDeal] = await this.db.select().from(flashDeals).where(eq(flashDeals.id, id));

      if (!flashDeal) return undefined;
      
      // Tính toán giá trị mới cho soldCount
      const newSoldCount = flashDeal.soldCount + increment;

      const [updatedFlashDeal] = await this.db.update(flashDeals)
        .set({ soldCount: newSoldCount })
        .where(eq(flashDeals.id, id))
        .returning();
        
      return updatedFlashDeal;
    } catch (error) {
      console.error("Error updating flash deal sold count:", error);
      return undefined;
    }
  }

  // Banner operations
  async getBanners(options?: { isActive?: boolean }): Promise<Banner[]> {
    let query = this.db.select().from(banners);

    if (options?.isActive) {
      query = query.where(eq(banners.isActive, true));
    }

    // Order by position if available
    query = query.orderBy(asc(banners.position));
    
    return await query;
  }

  async getBannerById(id: number): Promise<Banner | undefined> {
    const [banner] = await this.db.select().from(banners).where(eq(banners.id, id));
    return banner;
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const [createdBanner] = await this.db.insert(banners).values(banner).returning();
    return createdBanner;
  }

  // Order operations
  async getOrders(options?: { 
    userId?: number,
    status?: string,
    limit?: number,
    offset?: number
  }): Promise<Order[]> {
    let query = this.db.select().from(orders);

    if (options) {
      const conditions = [];

      if (options.userId) {
        conditions.push(eq(orders.userId, options.userId));
      }

      if (options.status) {
        conditions.push(eq(orders.status, options.status));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Add pagination
      if (options.limit) {
        query = query.limit(options.limit);
        if (options.offset) {
          query = query.offset(options.offset);
        }
      }
    }

    // Order by created date, newest first
    query = query.orderBy(desc(orders.createdAt));
    
    return await query;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await this.db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await this.db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async getOrderWithItems(id: number): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const [order] = await this.db.select().from(orders).where(eq(orders.id, id));
    
    if (!order) return undefined;
    
    const items = await this.getOrderItems(order.id);
    
    return {
      ...order,
      items
    };
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [createdOrder] = await this.db.insert(orders).values(orderData).returning();
    return createdOrder;
  }

  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [createdOrderItem] = await this.db.insert(orderItems).values(orderItem).returning();
    return createdOrderItem;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await this.db.update(orders)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
      
    return updatedOrder;
  }

  async updatePaymentStatus(id: number, paymentStatus: string, paymentIntentId?: string): Promise<Order | undefined> {
    const [updatedOrder] = await this.db.update(orders)
      .set({ 
        paymentStatus,
        paymentIntentId,
        updatedAt: new Date()
      })
      .where(eq(orders.id, id))
      .returning();
      
    return updatedOrder;
  }

  async getUserOrderCount(userId: number): Promise<number> {
    const result = await this.db.select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(eq(orders.userId, userId));
      
    return result[0]?.count || 0;
  }
}