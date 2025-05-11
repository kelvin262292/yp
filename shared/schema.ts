import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  role: text("role").notNull().default("user"),
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

// Brand schema
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  isFeatured: boolean("is_featured").default(false),
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

// Flash deal schema
export const flashDeals = pgTable("flash_deals", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalStock: integer("total_stock").notNull(),
  soldCount: integer("sold_count").default(0),
});

// Discount code schema
export const discountCodes = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type").notNull(), // percentage, fixed_amount
  discountValue: real("discount_value").notNull(),
  minOrderValue: real("min_order_value").default(0),
  maxDiscountAmount: real("max_discount_amount"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  isOneTimeUse: boolean("is_one_time_use").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User discount usage schema (for tracking user-specific discount usage)
export const userDiscountUsage = pgTable("user_discount_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  discountCodeId: integer("discount_code_id").references(() => discountCodes.id).notNull(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  usedAt: timestamp("used_at").defaultNow(),
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

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("pending"),
  totalAmount: real("total_amount").notNull(),
  shippingAddress: text("shipping_address"),
  shippingCity: text("shipping_city"),
  shippingProvince: text("shipping_province"),
  shippingPostalCode: text("shipping_postal_code"),
  shippingPhone: text("shipping_phone"),
  shippingName: text("shipping_name"),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  paymentIntentId: text("payment_intent_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order item schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
});

// Review schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  title: text("title"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Settings schema
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  group: text("group").notNull().default("general"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaigns schema
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  type: text("type").notNull(), // promotion, seasonal, holiday, flash_sale, clearance, etc.
  bannerUrl: text("banner_url"),
  targetAudience: text("target_audience"), // all, new_customers, returning_customers, etc.
  discountType: text("discount_type"), // percentage, fixed_amount
  discountValue: real("discount_value"),
  minOrderValue: real("min_order_value").default(0),
  maxDiscountAmount: real("max_discount_amount"),
  discountCode: text("discount_code"),
  productsIncluded: text("products_included").array(), // Array of product IDs
  categoriesIncluded: text("categories_included").array(), // Array of category IDs
  brandsIncluded: text("brands_included").array(), // Array of brand IDs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relationship definitions
export const usersRelations = relations(users, ({ many }) => ({
  carts: many(carts),
  orders: many(orders),
  reviews: many(reviews),
  discountUsage: many(userDiscountUsage),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parentCategory: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parentChild",
  }),
  childCategories: many(categories, {
    relationName: "parentChild",
  }),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  flashDeals: many(flashDeals),
  reviews: many(reviews),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  discountUsage: many(userDiscountUsage),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const flashDealsRelations = relations(flashDeals, ({ one }) => ({
  product: one(products, {
    fields: [flashDeals.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const discountCodesRelations = relations(discountCodes, ({ many }) => ({
  usages: many(userDiscountUsage),
}));

export const userDiscountUsageRelations = relations(userDiscountUsage, ({ one }) => ({
  user: one(users, {
    fields: [userDiscountUsage.userId],
    references: [users.id],
  }),
  discountCode: one(discountCodes, {
    fields: [userDiscountUsage.discountCodeId],
    references: [discountCodes.id],
  }),
  order: one(orders, {
    fields: [userDiscountUsage.orderId],
    references: [orders.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  // Relations can be added here when needed
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
  address: true,
  role: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  nameEn: true,
  nameZh: true,
  slug: true,
  icon: true,
  parentId: true,
});

export const updateCategorySchema = insertCategorySchema.partial();

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

export const updateProductSchema = insertProductSchema.partial();

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

export const updateBrandSchema = insertBrandSchema.partial();

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

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  status: true,
  totalAmount: true,
  shippingAddress: true,
  shippingCity: true,
  shippingProvince: true,
  shippingPostalCode: true,
  shippingPhone: true,
  shippingName: true,
  paymentMethod: true,
  paymentStatus: true,
  paymentIntentId: true,
  notes: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
  name: true,
  imageUrl: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  productId: true,
  userId: true,
  rating: true,
  comment: true,
  title: true,
  isVerifiedPurchase: true,
  isApproved: true,
});

export const insertDiscountCodeSchema = createInsertSchema(discountCodes).pick({
  code: true,
  description: true,
  discountType: true,
  discountValue: true,
  minOrderValue: true,
  maxDiscountAmount: true,
  startDate: true,
  endDate: true,
  isActive: true,
  usageLimit: true,
  isOneTimeUse: true,
});

export const insertUserDiscountUsageSchema = createInsertSchema(userDiscountUsage).pick({
  userId: true,
  discountCodeId: true,
  orderId: true,
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  key: true,
  value: true,
  group: true,
  description: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  isActive: true,
  type: true,
  bannerUrl: true,
  targetAudience: true,
  discountType: true,
  discountValue: true,
  minOrderValue: true,
  maxDiscountAmount: true,
  discountCode: true,
  productsIncluded: true,
  categoriesIncluded: true,
  brandsIncluded: true,
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

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type DiscountCode = typeof discountCodes.$inferSelect;
export type InsertDiscountCode = z.infer<typeof insertDiscountCodeSchema>;

export type UserDiscountUsage = typeof userDiscountUsage.$inferSelect;
export type InsertUserDiscountUsage = z.infer<typeof insertUserDiscountUsageSchema>;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
