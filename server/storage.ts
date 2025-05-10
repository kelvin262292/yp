import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  carts, type Cart, type InsertCart,
  cartItems, type CartItem, type InsertCartItem,
  brands, type Brand, type InsertBrand,
  flashDeals, type FlashDeal, type InsertFlashDeal,
  banners, type Banner, type InsertBanner
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(options?: { 
    categoryId?: number, 
    limit?: number, 
    isFeatured?: boolean,
    isHotDeal?: boolean,
    isBestSeller?: boolean,
    isNewArrival?: boolean 
  }): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart operations
  getCart(id: number): Promise<Cart | undefined>;
  getCartBySessionId(sessionId: string): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  
  // Cart item operations
  getCartItems(cartId: number): Promise<CartItem[]>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  
  // Brand operations
  getBrands(options?: { isFeatured?: boolean }): Promise<Brand[]>;
  getBrandById(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  // Flash deal operations
  getFlashDeals(): Promise<(FlashDeal & { product: Product })[]>;
  getFlashDealById(id: number): Promise<(FlashDeal & { product: Product }) | undefined>;
  createFlashDeal(flashDeal: InsertFlashDeal): Promise<FlashDeal>;
  updateFlashDealSoldCount(id: number, increment: number): Promise<FlashDeal | undefined>;
  
  // Banner operations
  getBanners(options?: { isActive?: boolean }): Promise<Banner[]>;
  getBannerById(id: number): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  private brands: Map<number, Brand>;
  private flashDeals: Map<number, FlashDeal>;
  private banners: Map<number, Banner>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private cartIdCounter: number;
  private cartItemIdCounter: number;
  private brandIdCounter: number;
  private flashDealIdCounter: number;
  private bannerIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.brands = new Map();
    this.flashDeals = new Map();
    this.banners = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.cartIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.brandIdCounter = 1;
    this.flashDealIdCounter = 1;
    this.bannerIdCounter = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Initialize categories
    const phoneCategory = this.createCategory({
      name: "Điện thoại",
      nameEn: "Phones",
      nameZh: "手机",
      slug: "dien-thoai",
      icon: "fas fa-mobile-alt",
      parentId: null
    });
    
    const electronicsCategory = this.createCategory({
      name: "Điện tử",
      nameEn: "Electronics",
      nameZh: "电子产品",
      slug: "dien-tu",
      icon: "fas fa-laptop",
      parentId: null
    });
    
    const fashionCategory = this.createCategory({
      name: "Thời trang",
      nameEn: "Fashion",
      nameZh: "时尚",
      slug: "thoi-trang",
      icon: "fas fa-tshirt",
      parentId: null
    });
    
    const beautyCategory = this.createCategory({
      name: "Làm đẹp",
      nameEn: "Beauty",
      nameZh: "美妆",
      slug: "lam-dep",
      icon: "fas fa-spa",
      parentId: null
    });
    
    const homeCategory = this.createCategory({
      name: "Đồ gia dụng",
      nameEn: "Home",
      nameZh: "家居",
      slug: "do-gia-dung",
      icon: "fas fa-home",
      parentId: null
    });
    
    const sportsCategory = this.createCategory({
      name: "Thể thao",
      nameEn: "Sports",
      nameZh: "运动",
      slug: "the-thao",
      icon: "fas fa-running",
      parentId: null
    });
    
    // Initialize brands
    const appleBrand = this.createBrand({
      name: "Apple",
      logoUrl: "https://images.unsplash.com/photo-1494252713559-f26b4bf0b174?auto=format&fit=crop&w=120&h=120",
      isFeatured: true
    });
    
    const samsungBrand = this.createBrand({
      name: "Samsung",
      logoUrl: "https://pixabay.com/get/g8d8f1962eba5f6461b1575a47d057e69ad8e74295205bf4fc68566fe907bc80074aa767ad98d95903dc7ff0530900841c0d9eef470c0c9ec408dc3f092f052bd_1280.jpg",
      isFeatured: true
    });
    
    const adidasBrand = this.createBrand({
      name: "Adidas",
      logoUrl: "https://pixabay.com/get/g788a045e6ede94484d43aa63b49467eb95595db098a73c5bb7e8f0fcead2172f6fc9731780227695dbe5d06690324eedc29cc22a315e10d340f73e0a8cb53d5e_1280.jpg",
      isFeatured: true
    });
    
    const nikeBrand = this.createBrand({
      name: "Nike",
      logoUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=120&h=120",
      isFeatured: true
    });
    
    const lorealBrand = this.createBrand({
      name: "L'Oreal",
      logoUrl: "https://pixabay.com/get/g8e273fc5e577b469b8b6de6641cb6dd5d962339219d0038f3e77f3c167ac0d4c8c0910b851cb6c7e66a44e81fb97a29b79aa3c98beb0f88befdf7c1f3c93ee08_1280.jpg",
      isFeatured: true
    });
    
    const xiaomiBrand = this.createBrand({
      name: "Xiaomi",
      logoUrl: "https://pixabay.com/get/g6cb8dc94956b5b1a2261b5b259ae11a4f5d3e232c566b6fa054297620a22c32e9f6793d352cef60970200d80abc409fc00d70fc322b1a70555436a44ab2de0fc_1280.jpg",
      isFeatured: true
    });
    
    // Initialize products
    // Smartphones
    const smartphone = this.createProduct({
      name: "Smartphone X Pro 128GB",
      nameEn: "Smartphone X Pro 128GB",
      nameZh: "Smartphone X Pro 128GB 智能手机",
      slug: "smartphone-x-pro-128gb",
      description: "Điện thoại thông minh cao cấp với hiệu năng mạnh mẽ",
      descriptionEn: "Premium smartphone with powerful performance",
      descriptionZh: "高性能高端智能手机",
      price: 2990000,
      originalPrice: 4990000,
      discountPercentage: 40,
      imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=240&h=240",
      categoryId: phoneCategory.id,
      rating: 4.5,
      reviewCount: 124,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Smartwatch
    const smartwatch = this.createProduct({
      name: "Smart Watch Series 5",
      nameEn: "Smart Watch Series 5",
      nameZh: "Smart Watch Series 5 智能手表",
      slug: "smart-watch-series-5",
      description: "Đồng hồ thông minh với nhiều tính năng sức khỏe",
      descriptionEn: "Smart watch with multiple health monitoring features",
      descriptionZh: "具有多种健康监测功能的智能手表",
      price: 1490000,
      originalPrice: 2190000,
      discountPercentage: 30,
      imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=240&h=240",
      categoryId: electronicsCategory.id,
      rating: 4.0,
      reviewCount: 89,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Wireless Earbuds
    const earbuds = this.createProduct({
      name: "Wireless Earbuds Pro",
      nameEn: "Wireless Earbuds Pro",
      nameZh: "Wireless Earbuds Pro 无线耳机",
      slug: "wireless-earbuds-pro",
      description: "Tai nghe không dây cao cấp với âm thanh chất lượng cao",
      descriptionEn: "Premium wireless earbuds with high-quality sound",
      descriptionZh: "高品质音质的高端无线耳机",
      price: 790000,
      originalPrice: 1590000,
      discountPercentage: 50,
      imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=240&h=240",
      categoryId: electronicsCategory.id,
      rating: 4.5,
      reviewCount: 210,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: true,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Laptop
    const laptop = this.createProduct({
      name: "Laptop UltraBook Slim",
      nameEn: "Laptop UltraBook Slim",
      nameZh: "Laptop UltraBook Slim 超薄笔记本电脑",
      slug: "laptop-ultrabook-slim",
      description: "Laptop siêu mỏng với hiệu suất mạnh mẽ",
      descriptionEn: "Ultra-thin laptop with powerful performance",
      descriptionZh: "性能强劲的超薄笔记本电脑",
      price: 12990000,
      originalPrice: 19990000,
      discountPercentage: 35,
      imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=240&h=240",
      categoryId: electronicsCategory.id,
      rating: 5.0,
      reviewCount: 56,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Digital Camera
    const camera = this.createProduct({
      name: "Digital Camera Pro X",
      nameEn: "Digital Camera Pro X",
      nameZh: "Digital Camera Pro X 数码相机",
      slug: "digital-camera-pro-x",
      description: "Máy ảnh kỹ thuật số chuyên nghiệp với chất lượng hình ảnh tuyệt vời",
      descriptionEn: "Professional digital camera with excellent image quality",
      descriptionZh: "图像质量出色的专业数码相机",
      price: 8990000,
      originalPrice: 11990000,
      discountPercentage: 25,
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=240&h=240",
      categoryId: electronicsCategory.id,
      rating: 4.7,
      reviewCount: 32,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Fashion Handbag
    const handbag = this.createProduct({
      name: "Premium Fashion Handbag for Women",
      nameEn: "Premium Fashion Handbag for Women",
      nameZh: "女士高级时尚手提包",
      slug: "premium-fashion-handbag-for-women",
      description: "Túi xách thời trang cao cấp cho phụ nữ",
      descriptionEn: "Premium fashion handbag for women",
      descriptionZh: "女士高级时尚手提包",
      price: 899000,
      originalPrice: 1199000,
      discountPercentage: 25,
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=240&h=240",
      categoryId: fashionCategory.id,
      rating: 4.5,
      reviewCount: 245,
      stock: 50,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Running Shoes
    const shoes = this.createProduct({
      name: "Premium Sports Running Shoes",
      nameEn: "Premium Sports Running Shoes",
      nameZh: "高级运动跑鞋",
      slug: "premium-sports-running-shoes",
      description: "Giày chạy bộ thể thao cao cấp",
      descriptionEn: "Premium sports running shoes",
      descriptionZh: "高级运动跑鞋",
      price: 1290000,
      originalPrice: 1790000,
      discountPercentage: 28,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=240&h=240",
      categoryId: fashionCategory.id,
      rating: 5.0,
      reviewCount: 189,
      stock: 75,
      isFeatured: true,
      isHotDeal: false,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Facial Serum
    const serum = this.createProduct({
      name: "Premium Facial Serum Anti-Aging",
      nameEn: "Premium Facial Serum Anti-Aging",
      nameZh: "高级抗衰老面部精华液",
      slug: "premium-facial-serum-anti-aging",
      description: "Serum dưỡng da mặt chống lão hóa cao cấp",
      descriptionEn: "Premium anti-aging facial serum",
      descriptionZh: "高级抗衰老面部精华液",
      price: 549000,
      originalPrice: 790000,
      discountPercentage: 30,
      imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=240&h=240",
      categoryId: beautyCategory.id,
      rating: 4.0,
      reviewCount: 324,
      stock: 100,
      isFeatured: true,
      isHotDeal: false,
      isBestSeller: true,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Bluetooth Speaker
    const speaker = this.createProduct({
      name: "Portable Bluetooth Speaker Waterproof",
      nameEn: "Portable Bluetooth Speaker Waterproof",
      nameZh: "便携式防水蓝牙音箱",
      slug: "portable-bluetooth-speaker-waterproof",
      description: "Loa Bluetooth di động chống nước",
      descriptionEn: "Portable waterproof Bluetooth speaker",
      descriptionZh: "便携式防水蓝牙音箱",
      price: 699000,
      originalPrice: 999000,
      discountPercentage: 30,
      imageUrl: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=240&h=240",
      categoryId: electronicsCategory.id,
      rating: 4.7,
      reviewCount: 152,
      stock: 60,
      isFeatured: true,
      isHotDeal: false,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Health Monitoring Smartwatch
    const healthWatch = this.createProduct({
      name: "Smart Watch with Health Monitoring",
      nameEn: "Smart Watch with Health Monitoring",
      nameZh: "健康监测智能手表",
      slug: "smart-watch-with-health-monitoring",
      description: "Đồng hồ thông minh với tính năng theo dõi sức khỏe",
      descriptionEn: "Smart watch with health monitoring features",
      descriptionZh: "健康监测智能手表",
      price: 1190000,
      originalPrice: 1590000,
      discountPercentage: 25,
      imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=240&h=240",
      categoryId: electronicsCategory.id,
      rating: 4.0,
      reviewCount: 98,
      stock: 45,
      isFeatured: true,
      isHotDeal: false,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    });
    
    // Laptop Stand
    const laptopStand = this.createProduct({
      name: "Adjustable Laptop Stand Aluminum",
      nameEn: "Adjustable Laptop Stand Aluminum",
      nameZh: "可调节铝制笔记本电脑支架",
      slug: "adjustable-laptop-stand-aluminum",
      description: "Giá đỡ laptop bằng nhôm có thể điều chỉnh",
      descriptionEn: "Adjustable aluminum laptop stand",
      descriptionZh: "可调节铝制笔记本电脑支架",
      price: 399000,
      originalPrice: 599000,
      discountPercentage: 33,
      imageUrl: "https://pixabay.com/get/gc5513d0b51028eb100956145efc33b95daa10189796ab51827e7a1a22dea299fffcee82cb7b009b0645c39de84c28d30f609a4eff666b3679070a002cb80f32e_1280.jpg",
      categoryId: homeCategory.id,
      rating: 4.5,
      reviewCount: 76,
      stock: 100,
      isFeatured: true,
      isHotDeal: false,
      isBestSeller: false,
      isNewArrival: true,
      freeShipping: true
    });
    
    // Initialize flash deals
    const now = new Date();
    const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    
    this.createFlashDeal({
      productId: smartphone.id,
      startDate: now,
      endDate: endTime,
      totalStock: 100,
      soldCount: 75
    });
    
    this.createFlashDeal({
      productId: smartwatch.id,
      startDate: now,
      endDate: endTime,
      totalStock: 100,
      soldCount: 60
    });
    
    this.createFlashDeal({
      productId: earbuds.id,
      startDate: now,
      endDate: endTime,
      totalStock: 100,
      soldCount: 85
    });
    
    this.createFlashDeal({
      productId: laptop.id,
      startDate: now,
      endDate: endTime,
      totalStock: 100,
      soldCount: 40
    });
    
    this.createFlashDeal({
      productId: camera.id,
      startDate: now,
      endDate: endTime,
      totalStock: 100,
      soldCount: 30
    });
    
    // Initialize banners
    this.createBanner({
      title: "Summer Sale 2023",
      titleEn: "Summer Sale 2023",
      titleZh: "2023夏季特卖",
      description: "Giảm giá lên đến 70%",
      descriptionEn: "Discounts up to 70%",
      descriptionZh: "最高优惠70%",
      imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1200&h=400",
      linkUrl: "/summer-sale",
      isActive: true,
      position: 1
    });
    
    this.createBanner({
      title: "Thời Trang Thu Đông",
      titleEn: "Fall/Winter Fashion",
      titleZh: "秋冬时尚",
      description: "Bộ sưu tập mới nhất đã có mặt",
      descriptionEn: "New collection available now",
      descriptionZh: "新系列现已上市",
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&h=400",
      linkUrl: "/fashion",
      isActive: true,
      position: 2
    });
    
    this.createBanner({
      title: "Đặt Trước iPhone 15",
      titleEn: "Pre-order iPhone 15",
      titleZh: "预购iPhone 15",
      description: "Nhận quà tặng đặc biệt khi đặt trước",
      descriptionEn: "Get special gifts when pre-ordering",
      descriptionZh: "预购获得特别礼物",
      imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1200&h=400",
      linkUrl: "/iphone-15",
      isActive: true,
      position: 3
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product methods
  async getProducts(options?: { 
    categoryId?: number, 
    limit?: number, 
    isFeatured?: boolean,
    isHotDeal?: boolean,
    isBestSeller?: boolean,
    isNewArrival?: boolean 
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (options?.categoryId) {
      products = products.filter(product => product.categoryId === options.categoryId);
    }
    
    if (options?.isFeatured) {
      products = products.filter(product => product.isFeatured);
    }
    
    if (options?.isHotDeal) {
      products = products.filter(product => product.isHotDeal);
    }
    
    if (options?.isBestSeller) {
      products = products.filter(product => product.isBestSeller);
    }
    
    if (options?.isNewArrival) {
      products = products.filter(product => product.isNewArrival);
    }
    
    if (options?.limit && options.limit > 0) {
      products = products.slice(0, options.limit);
    }
    
    return products;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
    );
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.nameEn.toLowerCase().includes(lowerQuery) ||
        product.nameZh.toLowerCase().includes(lowerQuery) ||
        (product.description && product.description.toLowerCase().includes(lowerQuery)) ||
        (product.descriptionEn && product.descriptionEn.toLowerCase().includes(lowerQuery)) ||
        (product.descriptionZh && product.descriptionZh.toLowerCase().includes(lowerQuery))
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }
  
  // Cart methods
  async getCart(id: number): Promise<Cart | undefined> {
    return this.carts.get(id);
  }
  
  async getCartBySessionId(sessionId: string): Promise<Cart | undefined> {
    return Array.from(this.carts.values()).find(
      (cart) => cart.sessionId === sessionId,
    );
  }
  
  async createCart(insertCart: InsertCart): Promise<Cart> {
    const id = this.cartIdCounter++;
    const cart: Cart = { ...insertCart, id, createdAt: new Date() };
    this.carts.set(id, cart);
    return cart;
  }
  
  // Cart item methods
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.cartId === cartId,
    );
  }
  
  async addCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.cartId === insertCartItem.cartId && item.productId === insertCartItem.productId,
    );
    
    if (existingItem) {
      // Update quantity instead of adding a new item
      const updatedQuantity = existingItem.quantity + insertCartItem.quantity;
      return this.updateCartItemQuantity(existingItem.id, updatedQuantity) as Promise<CartItem>;
    }
    
    const id = this.cartItemIdCounter++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem: CartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  // Brand methods
  async getBrands(options?: { isFeatured?: boolean }): Promise<Brand[]> {
    let brands = Array.from(this.brands.values());
    
    if (options?.isFeatured) {
      brands = brands.filter(brand => brand.isFeatured);
    }
    
    return brands;
  }
  
  async getBrandById(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }
  
  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = this.brandIdCounter++;
    const brand: Brand = { ...insertBrand, id };
    this.brands.set(id, brand);
    return brand;
  }
  
  // Flash deal methods
  async getFlashDeals(): Promise<(FlashDeal & { product: Product })[]> {
    const flashDeals = Array.from(this.flashDeals.values());
    const validDeals = [];
    
    for (const deal of flashDeals) {
      const product = this.products.get(deal.productId);
      if (product) {
        validDeals.push({ ...deal, product });
      } else {
        console.warn(`Product with ID ${deal.productId} not found for flash deal ${deal.id}`);
      }
    }
    
    return validDeals;
  }
  
  async getFlashDealById(id: number): Promise<(FlashDeal & { product: Product }) | undefined> {
    const flashDeal = this.flashDeals.get(id);
    if (!flashDeal) return undefined;
    
    const product = this.products.get(flashDeal.productId);
    if (!product) return undefined;
    
    return { ...flashDeal, product };
  }
  
  async createFlashDeal(insertFlashDeal: InsertFlashDeal): Promise<FlashDeal> {
    const id = this.flashDealIdCounter++;
    const flashDeal: FlashDeal = { ...insertFlashDeal, id };
    this.flashDeals.set(id, flashDeal);
    return flashDeal;
  }
  
  async updateFlashDealSoldCount(id: number, increment: number): Promise<FlashDeal | undefined> {
    const flashDeal = this.flashDeals.get(id);
    if (!flashDeal) return undefined;
    
    const updatedSoldCount = flashDeal.soldCount + increment;
    const updatedFlashDeal: FlashDeal = { ...flashDeal, soldCount: updatedSoldCount };
    this.flashDeals.set(id, updatedFlashDeal);
    return updatedFlashDeal;
  }
  
  // Banner methods
  async getBanners(options?: { isActive?: boolean }): Promise<Banner[]> {
    let banners = Array.from(this.banners.values());
    
    if (options?.isActive) {
      banners = banners.filter(banner => banner.isActive);
    }
    
    return banners.sort((a, b) => a.position - b.position);
  }
  
  async getBannerById(id: number): Promise<Banner | undefined> {
    return this.banners.get(id);
  }
  
  async createBanner(insertBanner: InsertBanner): Promise<Banner> {
    const id = this.bannerIdCounter++;
    const banner: Banner = { ...insertBanner, id };
    this.banners.set(id, banner);
    return banner;
  }
}

// Import the DatabaseStorage class
import { DatabaseStorage } from './database-storage';

// Create an instance of the DatabaseStorage class
// Import DatabaseStorage class
import { DatabaseStorage } from './database-storage';

// Export an instance of DatabaseStorage for use throughout the application
export const storage = new DatabaseStorage();
