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
  banners, type Banner, type InsertBanner
} from '@shared/schema';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [createdCategory] = await db.insert(categories).values(category).returning();
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
    let query = db.select().from(products);

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
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db
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
    const [createdProduct] = await db.insert(products).values(product).returning();
    return createdProduct;
  }

  // Cart operations
  async getCart(id: number): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.id, id));
    return cart;
  }

  async getCartBySessionId(sessionId: string): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId));
    return cart;
  }

  async createCart(cart: InsertCart): Promise<Cart> {
    const [createdCart] = await db.insert(carts).values(cart).returning();
    return createdCart;
  }

  // Cart item operations
  async getCartItems(cartId: number): Promise<CartItem[]> {
    const items = await db.select()
      .from(cartItems)
      .where(eq(cartItems.cartId, cartId));
      
    return items;
  }

  async addCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists in the cart
    const [existingItem] = await db.select()
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
      const [updatedItem] = await db.update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    // Create a new cart item
    const [createdCartItem] = await db.insert(cartItems)
      .values({ ...cartItem, quantity: cartItem.quantity || 1 })
      .returning();
      
    return createdCartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedCartItem] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
      
    return updatedCartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount > 0;
  }

  // Brand operations
  async getBrands(options?: { isFeatured?: boolean }): Promise<Brand[]> {
    let query = db.select().from(brands);

    if (options?.isFeatured) {
      query = query.where(eq(brands.isFeatured, true));
    }

    return await query;
  }

  async getBrandById(id: number): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    return brand;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [createdBrand] = await db.insert(brands).values(brand).returning();
    return createdBrand;
  }

  // Flash deal operations
  async getFlashDeals(): Promise<(FlashDeal & { product: Product })[]> {
    const deals = await db.select({
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
    const [deal] = await db.select({
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
    .where(eq(flashDeals.id, id));
    
    return deal;
  }

  async createFlashDeal(flashDeal: InsertFlashDeal): Promise<FlashDeal> {
    const [createdFlashDeal] = await db.insert(flashDeals).values(flashDeal).returning();
    return createdFlashDeal;
  }

  async updateFlashDealSoldCount(id: number, increment: number): Promise<FlashDeal | undefined> {
    const [flashDeal] = await db.select().from(flashDeals).where(eq(flashDeals.id, id));
    
    if (!flashDeal) return undefined;
    
    const newSoldCount = (flashDeal.soldCount || 0) + increment;
    const [updatedFlashDeal] = await db.update(flashDeals)
      .set({ soldCount: newSoldCount })
      .where(eq(flashDeals.id, id))
      .returning();
      
    return updatedFlashDeal;
  }

  // Banner operations
  async getBanners(options?: { isActive?: boolean }): Promise<Banner[]> {
    let query = db.select().from(banners);

    if (options?.isActive) {
      query = query.where(eq(banners.isActive, true));
    }

    // Order by position if available
    query = query.orderBy(asc(banners.position));
    
    return await query;
  }

  async getBannerById(id: number): Promise<Banner | undefined> {
    const [banner] = await db.select().from(banners).where(eq(banners.id, id));
    return banner;
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const [createdBanner] = await db.insert(banners).values(banner).returning();
    return createdBanner;
  }
}