import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
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

// Category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  nameZh: text("name_zh").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  parentId: integer("parent_id").references(() => categories.id),
});

// Product schema
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

// Cart schema
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  sessionId: text("session_id"),
});

// Cart item schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").references(() => carts.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
});

// Brand schema
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  isFeatured: boolean("is_featured").default(false),
});

// Flash deal schema
export const flashDeals = pgTable("flash_deals", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalStock: integer("total_stock").notNull(),
  soldCount: integer("sold_count").default(0),
});

// Banner schema
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

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
  address: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  nameEn: true,
  nameZh: true,
  slug: true,
  icon: true,
  parentId: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  nameEn: true,
  nameZh: true,
  slug: true,
  description: true,
  descriptionEn: true,
  descriptionZh: true,
  price: true,
  originalPrice: true,
  discountPercentage: true,
  imageUrl: true,
  categoryId: true,
  rating: true,
  reviewCount: true,
  stock: true,
  isFeatured: true,
  isHotDeal: true,
  isBestSeller: true,
  isNewArrival: true,
  freeShipping: true,
});

export const insertCartSchema = createInsertSchema(carts).pick({
  userId: true,
  sessionId: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  cartId: true,
  productId: true,
  quantity: true,
});

export const insertBrandSchema = createInsertSchema(brands).pick({
  name: true,
  logoUrl: true,
  isFeatured: true,
});

export const insertFlashDealSchema = createInsertSchema(flashDeals).pick({
  productId: true,
  startDate: true,
  endDate: true,
  totalStock: true,
  soldCount: true,
});

export const insertBannerSchema = createInsertSchema(banners).pick({
  title: true,
  titleEn: true,
  titleZh: true,
  description: true,
  descriptionEn: true,
  descriptionZh: true,
  imageUrl: true,
  linkUrl: true,
  isActive: true,
  position: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;

export type FlashDeal = typeof flashDeals.$inferSelect;
export type InsertFlashDeal = z.infer<typeof insertFlashDealSchema>;

export type Banner = typeof banners.$inferSelect;
export type InsertBanner = z.infer<typeof insertBannerSchema>;
