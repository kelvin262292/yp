import { db } from './db';
import {
  users, type InsertUser,
  categories, type InsertCategory,
  products, type InsertProduct,
  brands, type InsertBrand,
  flashDeals, type InsertFlashDeal,
  banners, type InsertBanner
} from '@shared/schema';

async function main() {
  console.log('Initializing database with sample data...');

  // We'll skip checking for existing data and proceed with initialization

  try {
    // Create categories
    const phoneCategory = await db.insert(categories).values({
      name: "Điện thoại",
      nameEn: "Phones",
      nameZh: "手机",
      slug: "dien-thoai",
      icon: "fas fa-mobile-alt",
      parentId: null
    }).returning();

    const electronicsCategory = await db.insert(categories).values({
      name: "Điện tử",
      nameEn: "Electronics",
      nameZh: "电子产品",
      slug: "dien-tu",
      icon: "fas fa-laptop",
      parentId: null
    }).returning();

    const fashionCategory = await db.insert(categories).values({
      name: "Thời trang",
      nameEn: "Fashion",
      nameZh: "时尚",
      slug: "thoi-trang",
      icon: "fas fa-tshirt",
      parentId: null
    }).returning();

    const beautyCategory = await db.insert(categories).values({
      name: "Làm đẹp",
      nameEn: "Beauty",
      nameZh: "美妆",
      slug: "lam-dep",
      icon: "fas fa-spa",
      parentId: null
    }).returning();

    const homeCategory = await db.insert(categories).values({
      name: "Đồ gia dụng",
      nameEn: "Home",
      nameZh: "家居",
      slug: "do-gia-dung",
      icon: "fas fa-home",
      parentId: null
    }).returning();

    const sportsCategory = await db.insert(categories).values({
      name: "Thể thao",
      nameEn: "Sports",
      nameZh: "运动",
      slug: "the-thao",
      icon: "fas fa-running",
      parentId: null
    }).returning();

    console.log('Categories created.');

    // Create brands
    const appleBrand = await db.insert(brands).values({
      name: "Apple",
      logoUrl: "https://images.unsplash.com/photo-1494252713559-f26b4bf0b174?auto=format&fit=crop&w=120&h=120",
      isFeatured: true
    }).returning();

    const samsungBrand = await db.insert(brands).values({
      name: "Samsung",
      logoUrl: "https://pixabay.com/get/g8d8f1962eba5f6461b1575a47d057e69ad8e74295205bf4fc68566fe907bc80074aa767ad98d95903dc7ff0530900841c0d9eef470c0c9ec408dc3f092f052bd_1280.jpg",
      isFeatured: true
    }).returning();

    const adidasBrand = await db.insert(brands).values({
      name: "Adidas",
      logoUrl: "https://pixabay.com/get/g788a045e6ede94484d43aa63b49467eb95595db098a73c5bb7e8f0fcead2172f6fc9731780227695dbe5d06690324eedc29cc22a315e10d340f73e0a8cb53d5e_1280.jpg",
      isFeatured: true
    }).returning();

    const nikeBrand = await db.insert(brands).values({
      name: "Nike",
      logoUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=120&h=120",
      isFeatured: true
    }).returning();

    const lorealBrand = await db.insert(brands).values({
      name: "L'Oreal",
      logoUrl: "https://pixabay.com/get/g8e273fc5e577b469b8b6de6641cb6dd5d962339219d0038f3e77f3c167ac0d4c8c0910b851cb6c7e66a44e81fb97a29b79aa3c98beb0f88befdf7c1f3c93ee08_1280.jpg",
      isFeatured: true
    }).returning();

    const xiaomiBrand = await db.insert(brands).values({
      name: "Xiaomi",
      logoUrl: "https://pixabay.com/get/g6cb8dc94956b5b1a2261b5b259ae11a4f5d3e232c566b6fa054297620a22c32e9f6793d352cef60970200d80abc409fc00d70fc322b1a70555436a44ab2de0fc_1280.jpg",
      isFeatured: true
    }).returning();

    console.log('Brands created.');

    // Create products
    // Smartphones
    const smartphone = await db.insert(products).values({
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
      categoryId: phoneCategory[0].id,
      brandId: appleBrand[0].id,
      rating: 4.5,
      reviewCount: 124,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    }).returning();

    // Smartwatch
    const smartwatch = await db.insert(products).values({
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
      categoryId: electronicsCategory[0].id,
      brandId: appleBrand[0].id,
      rating: 4.0,
      reviewCount: 89,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    }).returning();

    // Wireless Earbuds
    const earbuds = await db.insert(products).values({
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
      categoryId: electronicsCategory[0].id,
      brandId: samsungBrand[0].id,
      rating: 4.5,
      reviewCount: 210,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: true,
      isNewArrival: false,
      freeShipping: true
    }).returning();

    // Laptop
    const laptop = await db.insert(products).values({
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
      categoryId: electronicsCategory[0].id,
      brandId: samsungBrand[0].id,
      rating: 5.0,
      reviewCount: 56,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    }).returning();

    // Digital Camera
    const camera = await db.insert(products).values({
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
      categoryId: electronicsCategory[0].id,
      brandId: samsungBrand[0].id,
      rating: 4.7,
      reviewCount: 32,
      stock: 100,
      isFeatured: true,
      isHotDeal: true,
      isBestSeller: false,
      isNewArrival: false,
      freeShipping: true
    }).returning();

    console.log('Products created.');

    // Create banners
    const banner1 = await db.insert(banners).values({
      title: "Flash Sale Điện Thoại",
      titleEn: "Smartphone Flash Sale",
      titleZh: "智能手机闪购",
      description: "Giảm đến 50% cho tất cả điện thoại thông minh",
      descriptionEn: "Up to 50% off all smartphones",
      descriptionZh: "所有智能手机最高可享受50%的折扣",
      imageUrl: "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1074&q=80",
      linkUrl: "/category/phones",
      isActive: true,
      position: 1
    }).returning();

    const banner2 = await db.insert(banners).values({
      title: "Thời Trang Mùa Hè",
      titleEn: "Summer Fashion Collection",
      titleZh: "夏季时尚系列",
      description: "Khám phá bộ sưu tập thời trang mùa hè mới nhất",
      descriptionEn: "Explore our new summer fashion collection",
      descriptionZh: "探索我们的新夏季时尚系列",
      imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1470&q=80",
      linkUrl: "/category/fashion",
      isActive: true,
      position: 2
    }).returning();

    const banner3 = await db.insert(banners).values({
      title: "Giảm Giá Thiết Bị Điện Tử",
      titleEn: "Electronics Sale",
      titleZh: "电子产品销售",
      description: "Tiết kiệm lớn cho các thiết bị điện tử hàng đầu",
      descriptionEn: "Big savings on top electronics",
      descriptionZh: "顶级电子产品大优惠",
      imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1501&q=80",
      linkUrl: "/category/electronics",
      isActive: true,
      position: 3
    }).returning();

    console.log('Banners created.');

    // Create flash deals
    const now = new Date();
    const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    const flashDeal1 = await db.insert(flashDeals).values({
      productId: smartphone[0].id,
      startDate: now,
      endDate: endTime,
      totalStock: 50,
      soldCount: 10
    }).returning();

    const flashDeal2 = await db.insert(flashDeals).values({
      productId: earbuds[0].id,
      startDate: now,
      endDate: endTime,
      totalStock: 30,
      soldCount: 5
    }).returning();

    const flashDeal3 = await db.insert(flashDeals).values({
      productId: smartwatch[0].id,
      startDate: now,
      endDate: endTime,
      totalStock: 20,
      soldCount: 8
    }).returning();

    console.log('Flash deals created.');
    console.log('Database initialization completed successfully!');

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });