import { Router } from 'express';
import { db } from '../db';
import { isAdmin } from '../auth-middleware';
import { count, desc, eq, sql, sum, like, asc, and, isNull, not, inArray, or } from 'drizzle-orm';
import { orders, products, reviews, users, categories, brands, settings, campaigns } from '@shared/schema';
import { insertProductSchema, updateProductSchema, insertCategorySchema, updateCategorySchema, insertBrandSchema, updateBrandSchema, insertCampaignSchema } from '@shared/schema';

const router = Router();

// Apply admin middleware to all routes in this router
router.use(isAdmin);

/**
 * Get admin dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Get total sales
    const totalSalesResult = await db
      .select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(sql`${orders.status} != 'cancelled'`);
    
    // Get order counts by status
    const orderCounts = await db
      .select({
        status: orders.status,
        count: count(),
      })
      .from(orders)
      .groupBy(orders.status);
    
    // Get total number of products
    const [productsCount] = await db
      .select({ count: count() })
      .from(products);
    
    // Get total number of customers (users)
    const [customersCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'user'));
    
    // Get total number of orders
    const [ordersCount] = await db
      .select({ count: count() })
      .from(orders);
    
    // Prepare response data
    const totalSales = totalSalesResult[0]?.total || 0;
    
    // Get counts for each order status
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    };
    
    orderCounts.forEach((item) => {
      if (item.status in statusCounts) {
        statusCounts[item.status as keyof typeof statusCounts] = Number(item.count);
      }
    });
    
    res.json({
      totalSales,
      totalOrders: Number(ordersCount.count),
      totalProducts: Number(productsCount.count),
      totalCustomers: Number(customersCount.count),
      ...statusCounts
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thống kê admin' });
  }
});

/**
 * Get recent orders for admin dashboard
 */
router.get('/orders/recent', async (req, res) => {
  try {
    const recentOrders = await db
      .select({
        id: orders.id,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        customerId: orders.userId,
        customerName: users.fullName,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(5);
    
    // Format response
    const formattedOrders = recentOrders.map(order => ({
      id: `YP${order.id}`,
      customer: order.customerName || 'Khách hàng',
      date: order.createdAt.toISOString().split('T')[0],
      status: order.status,
      total: order.totalAmount
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ message: 'Lỗi khi lấy đơn hàng gần đây' });
  }
});

/**
 * Get monthly sales data
 */
router.get('/stats/sales/monthly', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // SQL to extract month from createdAt and group by month
    const monthlySales = await db
      .select({
        month: sql`EXTRACT(MONTH FROM ${orders.createdAt})::integer`,
        total: sum(orders.totalAmount),
      })
      .from(orders)
      .where(
        sql`EXTRACT(YEAR FROM ${orders.createdAt}) = ${currentYear} AND ${orders.status} != 'cancelled'`
      )
      .groupBy(sql`EXTRACT(MONTH FROM ${orders.createdAt})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${orders.createdAt})`);
    
    // Map data to month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Create full year dataset
    const salesData = monthNames.map((name, index) => {
      const monthData = monthlySales.find(item => item.month === index + 1);
      return {
        name,
        total: monthData ? Number(monthData.total) : 0
      };
    });
    
    res.json(salesData);
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu doanh số theo tháng' });
  }
});

/**
 * Get yearly sales data
 */
router.get('/stats/sales/yearly', async (req, res) => {
  try {
    // SQL to extract year from createdAt and group by year
    const yearlySales = await db
      .select({
        year: sql`EXTRACT(YEAR FROM ${orders.createdAt})::integer`,
        total: sum(orders.totalAmount),
      })
      .from(orders)
      .where(sql`${orders.status} != 'cancelled'`)
      .groupBy(sql`EXTRACT(YEAR FROM ${orders.createdAt})`)
      .orderBy(sql`EXTRACT(YEAR FROM ${orders.createdAt})`);
    
    // Format response
    const salesData = yearlySales.map(item => ({
      name: item.year.toString(),
      total: Number(item.total)
    }));
    
    res.json(salesData);
  } catch (error) {
    console.error('Error fetching yearly sales:', error);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu doanh số theo năm' });
  }
});

/**
 * Statistics & Reports Endpoints
 */

// Get sales statistics
router.get('/stats/sales', async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    // Default time range if not specified
    let start = startDate ? new Date(startDate as string) : new Date(currentYear, 0, 1); // Jan 1 of current year
    let end = endDate ? new Date(endDate as string) : now;
    
    // Daily sales in date range
    if (period === 'daily') {
      const salesByDay = await db
        .select({
          date: sql`DATE(${orders.createdAt})`,
          total: sum(orders.totalAmount),
          count: count()
        })
        .from(orders)
        .where(
          and(
            sql`DATE(${orders.createdAt}) >= DATE(${start})`,
            sql`DATE(${orders.createdAt}) <= DATE(${end})`,
            or(
              eq(orders.status, 'delivered'),
              eq(orders.status, 'shipping')
            )
          )
        )
        .groupBy(sql`DATE(${orders.createdAt})`)
        .orderBy(sql`DATE(${orders.createdAt})`);
      
      return res.json({
        period: 'daily',
        data: salesByDay.map(day => ({
          date: day.date,
          total: Number(day.total) || 0,
          count: Number(day.count) || 0
        }))
      });
    }
    
    // Monthly sales
    else if (period === 'monthly') {
      const salesByMonth = await db
        .select({
          year: sql`EXTRACT(YEAR FROM ${orders.createdAt})::integer`,
          month: sql`EXTRACT(MONTH FROM ${orders.createdAt})::integer`,
          total: sum(orders.totalAmount),
          count: count()
        })
        .from(orders)
        .where(
          and(
            sql`${orders.createdAt} >= ${start}`,
            sql`${orders.createdAt} <= ${end}`,
            or(
              eq(orders.status, 'delivered'),
              eq(orders.status, 'shipping')
            )
          )
        )
        .groupBy(
          sql`EXTRACT(YEAR FROM ${orders.createdAt})`,
          sql`EXTRACT(MONTH FROM ${orders.createdAt})`
        )
        .orderBy(
          sql`EXTRACT(YEAR FROM ${orders.createdAt})`,
          sql`EXTRACT(MONTH FROM ${orders.createdAt})`
        );
      
      return res.json({
        period: 'monthly',
        data: salesByMonth.map(month => ({
          year: month.year,
          month: month.month,
          total: Number(month.total) || 0,
          count: Number(month.count) || 0
        }))
      });
    }
    
    // Yearly sales
    else if (period === 'yearly') {
      const salesByYear = await db
        .select({
          year: sql`EXTRACT(YEAR FROM ${orders.createdAt})::integer`,
          total: sum(orders.totalAmount),
          count: count()
        })
        .from(orders)
        .where(
          and(
            sql`${orders.createdAt} >= ${start}`,
            sql`${orders.createdAt} <= ${end}`,
            or(
              eq(orders.status, 'delivered'),
              eq(orders.status, 'shipping')
            )
          )
        )
        .groupBy(sql`EXTRACT(YEAR FROM ${orders.createdAt})`)
        .orderBy(sql`EXTRACT(YEAR FROM ${orders.createdAt})`);
      
      return res.json({
        period: 'yearly',
        data: salesByYear.map(year => ({
          year: year.year,
          total: Number(year.total) || 0,
          count: Number(year.count) || 0
        }))
      });
    }
    
    else {
      return res.status(400).json({ error: 'Invalid period. Use daily, monthly, or yearly.' });
    }
  } catch (error) {
    console.error('Error getting sales statistics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product statistics
router.get('/stats/products', async (req, res) => {
  try {
    const { sortBy = 'sales', limit = 10, category, startDate, endDate } = req.query;
    const now = new Date();
    
    // Default time range if not specified
    let start = startDate ? new Date(startDate as string) : new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    let end = endDate ? new Date(endDate as string) : now;
    
    // Base query
    let query = db
      .select({
        productId: orderItems.productId,
        totalQuantity: sum(orderItems.quantity),
        totalRevenue: sum(sql`${orderItems.quantity} * ${orderItems.price}`),
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          sql`${orders.createdAt} >= ${start}`,
          sql`${orders.createdAt} <= ${end}`,
          or(
            eq(orders.status, 'delivered'),
            eq(orders.status, 'shipping')
          )
        )
      );
    
    // Add category filter if provided
    if (category) {
      query = query
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(products.categoryId, parseInt(category as string)));
    }
    
    // Group by product and sort
    query = query
      .groupBy(orderItems.productId);
    
    if (sortBy === 'quantity') {
      query = query.orderBy(desc(sum(orderItems.quantity)));
    } else {
      // Default sort by revenue
      query = query.orderBy(desc(sum(sql`${orderItems.quantity} * ${orderItems.price}`)));
    }
    
    // Limit results
    query = query.limit(parseInt(limit as string));
    
    // Execute query
    const topProducts = await query;
    
    // If no products found
    if (topProducts.length === 0) {
      return res.json([]);
    }
    
    // Get product details
    const productIds = topProducts.map(p => p.productId);
    const productDetails = await db.query.products.findMany({
      where: inArray(products.id, productIds),
      columns: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        price: true,
        stock: true,
        categoryId: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    });
    
    // Combine data
    const result = topProducts.map(product => {
      const details = productDetails.find(p => p.id === product.productId);
      return {
        id: product.productId,
        name: details?.name || 'Unknown Product',
        slug: details?.slug || '',
        imageUrl: details?.imageUrl || '',
        price: details?.price || 0,
        stock: details?.stock || 0,
        category: details?.category?.name || 'Unknown Category',
        totalQuantity: Number(product.totalQuantity) || 0,
        totalRevenue: Number(product.totalRevenue) || 0,
        averagePrice: Number(product.totalRevenue) / Number(product.totalQuantity) || 0
      };
    });
    
    return res.json(result);
  } catch (error) {
    console.error('Error getting product statistics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer statistics
router.get('/stats/customers', async (req, res) => {
  try {
    const { period = 'monthly', sortBy = 'orders', limit = 10 } = req.query;
    const now = new Date();
    
    // For period-based queries
    let timeFilter;
    if (period === 'daily') {
      timeFilter = sql`DATE(${orders.createdAt}) = DATE(${now})`;
    } else if (period === 'weekly') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // First day of current week (Sunday)
      timeFilter = sql`${orders.createdAt} >= ${weekStart}`;
    } else if (period === 'monthly') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      timeFilter = sql`${orders.createdAt} >= ${monthStart}`;
    } else if (period === 'yearly') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      timeFilter = sql`${orders.createdAt} >= ${yearStart}`;
    } else {
      // Default to all time
      timeFilter = sql`1=1`;
    }
    
    // Get top customers
    const customerStats = await db
      .select({
        userId: orders.userId,
        orderCount: count(orders.id),
        totalSpent: sum(orders.totalAmount),
        avgOrderValue: sql`SUM(${orders.totalAmount}) / COUNT(${orders.id})`,
      })
      .from(orders)
      .where(
        and(
          timeFilter,
          not(isNull(orders.userId)),
          or(
            eq(orders.status, 'delivered'),
            eq(orders.status, 'shipping')
          )
        )
      )
      .groupBy(orders.userId);
    
    // Sort by specified criterion
    let sortedStats;
    if (sortBy === 'spent') {
      sortedStats = customerStats.sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent));
    } else if (sortBy === 'average') {
      sortedStats = customerStats.sort((a, b) => Number(b.avgOrderValue) - Number(a.avgOrderValue));
    } else {
      // Default sort by order count
      sortedStats = customerStats.sort((a, b) => Number(b.orderCount) - Number(a.orderCount));
    }
    
    // Apply limit
    const limitedStats = sortedStats.slice(0, parseInt(limit as string));
    
    // Get customer details
    const userIds = limitedStats.map(stat => stat.userId);
    const userDetails = await db.query.users.findMany({
      where: inArray(users.id, userIds),
      columns: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
      }
    });
    
    // Combine data
    const result = limitedStats.map(stat => {
      const user = userDetails.find(u => u.id === stat.userId);
      return {
        id: stat.userId,
        username: user?.username || 'Unknown User',
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        orderCount: Number(stat.orderCount) || 0,
        totalSpent: Number(stat.totalSpent) || 0,
        avgOrderValue: Number(stat.avgOrderValue) || 0
      };
    });
    
    return res.json(result);
  } catch (error) {
    console.error('Error getting customer statistics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Product Management Endpoints
 */

// Get all products with pagination, sorting and filtering
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? asc : desc;
    const search = req.query.search as string || '';
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;
    const brandId = req.query.brandId ? parseInt(req.query.brandId as string) : null;

    // Build the where clause based on filters
    let whereClause = and();
    
    if (search) {
      whereClause = and(
        whereClause,
        like(products.name, `%${search}%`)
      );
    }
    
    if (categoryId) {
      whereClause = and(
        whereClause,
        eq(products.categoryId, categoryId)
      );
    }
    
    if (brandId) {
      whereClause = and(
        whereClause,
        eq(products.brandId, brandId)
      );
    }

    // Get products with pagination
    const productsList = await db.query.products.findMany({
      where: whereClause,
      with: {
        category: true,
        brand: true
      },
      limit,
      offset,
      orderBy: [sortOrder(products[sortBy as keyof typeof products])]
    });

    // Get total count for pagination
    const [totalCount] = await db
      .select({ count: count() })
      .from(products)
      .where(whereClause);

    // Get categories and brands for filters
    const categories = await db.query.categories.findMany({
      orderBy: [asc(categories.name)]
    });
    
    const brands = await db.query.brands.findMany({
      orderBy: [asc(brands.name)]
    });

    return res.json({
      products: productsList,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount.count / limit),
        totalItems: totalCount.count,
        itemsPerPage: limit
      },
      filters: {
        categories,
        brands
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        category: true,
        brand: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new product
router.post('/products', async (req, res) => {
  try {
    // Validate product data
    const productData = insertProductSchema.parse(req.body);

    // Check if category exists
    if (productData.categoryId) {
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, productData.categoryId)
      });

      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    // Check if brand exists
    if (productData.brandId) {
      const brand = await db.query.brands.findFirst({
        where: eq(brands.id, productData.brandId)
      });

      if (!brand) {
        return res.status(400).json({ error: 'Brand not found' });
      }
    }

    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Insert product
    const newProduct = await db.insert(products).values(productData).returning();

    return res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Validate product data
    const productData = updateProductSchema.parse(req.body);

    // Check if product exists
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId)
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if category exists
    if (productData.categoryId) {
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, productData.categoryId)
      });

      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }

    // Check if brand exists
    if (productData.brandId) {
      const brand = await db.query.brands.findFirst({
        where: eq(brands.id, productData.brandId)
      });

      if (!brand) {
        return res.status(400).json({ error: 'Brand not found' });
      }
    }

    // Generate slug if name is changed and slug is not provided
    if (productData.name && productData.name !== product.name && !productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Update product
    const updatedProduct = await db.update(products)
      .set({
        ...productData,
        updatedAt: new Date()
      })
      .where(eq(products.id, productId))
      .returning();

    return res.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    // Check if product exists
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId)
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if product has orders
    const hasOrders = await db.query.orderItems.findFirst({
      where: eq(orderItems.productId, productId)
    });
    
    if (hasOrders) {
      // Instead of deleting, mark as inactive
      await db.update(products)
        .set({ 
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(products.id, productId));
        
      return res.json({ 
        success: true, 
        message: 'Product has been marked as inactive as it has orders associated with it' 
      });
    }

    // Delete reviews first
    await db.delete(reviews)
      .where(eq(reviews.productId, productId));

    // Delete product
    await db.delete(products)
      .where(eq(products.id, productId));

    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Category Management Endpoints
 */

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categoriesList = await db.query.categories.findMany({
      with: {
        products: {
          columns: {
            id: true,
          },
        },
      },
      orderBy: [asc(categories.name)]
    });

    // Format response
    const formattedCategories = categoriesList.map(category => ({
      ...category,
      productCount: category.products.length
    }));

    return res.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single category by ID
router.get('/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
      with: {
        products: {
          columns: {
            id: true,
          },
        },
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Format response
    const formattedCategory = {
      ...category,
      productCount: category.products.length
    };

    return res.json(formattedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new category
router.post('/categories', async (req, res) => {
  try {
    // Validate category data
    const categoryData = insertCategorySchema.parse(req.body);

    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Insert category
    const newCategory = await db.insert(categories).values(categoryData).returning();

    return res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a category
router.put('/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    // Validate category data
    const categoryData = updateCategorySchema.parse(req.body);

    // Check if category exists
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId)
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Generate slug if name is changed and slug is not provided
    if (categoryData.name && categoryData.name !== category.name && !categoryData.slug) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Update category
    const updatedCategory = await db.update(categories)
      .set({
        ...categoryData,
        updatedAt: new Date()
      })
      .where(eq(categories.id, categoryId))
      .returning();

    return res.json(updatedCategory[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a category
router.delete('/categories/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    // Check if category exists
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId)
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Check if category has products
    const categoryProducts = await db.query.products.findMany({
      where: eq(products.categoryId, categoryId),
      limit: 1
    });
    
    if (categoryProducts.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with associated products. Remove products first or reassign them to another category.' 
      });
    }

    // Delete category
    await db.delete(categories)
      .where(eq(categories.id, categoryId));

    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Brand Management Endpoints
 */

// Get all brands
router.get('/brands', async (req, res) => {
  try {
    const brandsList = await db.query.brands.findMany({
      with: {
        products: {
          columns: {
            id: true,
          },
        },
      },
      orderBy: [asc(brands.name)]
    });

    // Format response
    const formattedBrands = brandsList.map(brand => ({
      ...brand,
      productCount: brand.products.length
    }));

    return res.json(formattedBrands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single brand by ID
router.get('/brands/:id', async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    const brand = await db.query.brands.findFirst({
      where: eq(brands.id, brandId),
      with: {
        products: {
          columns: {
            id: true,
          },
        },
      }
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Format response
    const formattedBrand = {
      ...brand,
      productCount: brand.products.length
    };

    return res.json(formattedBrand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new brand
router.post('/brands', async (req, res) => {
  try {
    // Validate brand data
    const brandData = insertBrandSchema.parse(req.body);

    // Insert brand
    const newBrand = await db.insert(brands).values(brandData).returning();

    return res.status(201).json(newBrand[0]);
  } catch (error) {
    console.error('Error creating brand:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a brand
router.put('/brands/:id', async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);
    
    // Validate brand data
    const brandData = updateBrandSchema.parse(req.body);

    // Check if brand exists
    const brand = await db.query.brands.findFirst({
      where: eq(brands.id, brandId)
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Update brand
    const updatedBrand = await db.update(brands)
      .set({
        ...brandData,
        updatedAt: new Date()
      })
      .where(eq(brands.id, brandId))
      .returning();

    return res.json(updatedBrand[0]);
  } catch (error) {
    console.error('Error updating brand:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a brand
router.delete('/brands/:id', async (req, res) => {
  try {
    const brandId = parseInt(req.params.id);

    // Check if brand exists
    const brand = await db.query.brands.findFirst({
      where: eq(brands.id, brandId)
    });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    
    // Check if brand has products
    const brandProducts = await db.query.products.findMany({
      where: eq(products.brandId, brandId),
      limit: 1
    });
    
    if (brandProducts.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete brand with associated products. Remove products first or reassign them to another brand.' 
      });
    }

    // Delete brand
    await db.delete(brands)
      .where(eq(brands.id, brandId));

    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Order Management Endpoints
 */

// Get all orders with pagination, filtering and sorting
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const searchTerm = req.query.search as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? asc : desc;
    
    // Build where clause based on filters
    let whereClause = and();
    
    if (status) {
      whereClause = and(whereClause, eq(orders.status, status));
    }
    
    if (searchTerm) {
      // Search by order ID, customer name, or customer email
      whereClause = and(
        whereClause,
        or(
          like(orders.id.toString(), `%${searchTerm}%`),
          like(orders.shippingName, `%${searchTerm}%`),
          like(orders.shippingPhone, `%${searchTerm}%`)
        )
      );
    }
    
    // Get orders with pagination
    const ordersList = await db.query.orders.findMany({
      where: whereClause,
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        },
        orderItems: {
          with: {
            product: true
          }
        }
      },
      limit,
      offset,
      orderBy: [sortOrder(orders[sortBy as keyof typeof orders])]
    });
    
    // Get total count for pagination
    const [totalCount] = await db
      .select({ count: count() })
      .from(orders)
      .where(whereClause);
    
    // Get count for each status for status tabs
    const statusCounts = await db
      .select({
        status: orders.status,
        count: count()
      })
      .from(orders)
      .groupBy(orders.status);
    
    const formattedStatusCounts = statusCounts.reduce((acc, { status, count }) => {
      acc[status] = Number(count);
      return acc;
    }, {} as Record<string, number>);
    
    return res.json({
      orders: ordersList,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount.count / limit),
        totalItems: totalCount.count,
        itemsPerPage: limit
      },
      statusCounts: formattedStatusCounts
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single order by ID
router.get('/orders/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        orderItems: {
          with: {
            product: true
          }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    return res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipping', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Check if order exists
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId)
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Handle special case: if order is being cancelled and was not cancelled before
    if (status === 'cancelled' && order.status !== 'cancelled') {
      // Get order items to update product stock
      const orderItems = await db.query.orderItems.findMany({
        where: eq(orderItems.orderId, orderId)
      });
      
      // Return items to inventory
      for (const item of orderItems) {
        await db.update(products)
          .set({
            stock: sql`${products.stock} + ${item.quantity}`,
            updatedAt: new Date()
          })
          .where(eq(products.id, item.productId));
      }
    }
    
    // Update order status
    const updatedOrder = await db.update(orders)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId))
      .returning();
    
    return res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order statistics
router.get('/orders/stats', async (req, res) => {
  try {
    // Get total order count
    const [totalOrders] = await db
      .select({ count: count() })
      .from(orders);
    
    // Get order counts by status
    const statusCounts = await db
      .select({
        status: orders.status,
        count: count()
      })
      .from(orders)
      .groupBy(orders.status);
    
    // Get total revenue from completed orders
    const [totalRevenue] = await db
      .select({
        total: sum(orders.totalAmount)
      })
      .from(orders)
      .where(
        or(
          eq(orders.status, 'delivered'),
          eq(orders.status, 'shipping')
        )
      );
    
    // Get revenue by month for current year
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = await db
      .select({
        month: sql`EXTRACT(MONTH FROM ${orders.createdAt})::integer`,
        total: sum(orders.totalAmount)
      })
      .from(orders)
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${orders.createdAt}) = ${currentYear}`,
          or(
            eq(orders.status, 'delivered'),
            eq(orders.status, 'shipping')
          )
        )
      )
      .groupBy(sql`EXTRACT(MONTH FROM ${orders.createdAt})`)
      .orderBy(sql`EXTRACT(MONTH FROM ${orders.createdAt})`);
    
    // Format status counts
    const formattedStatusCounts = statusCounts.reduce((acc, { status, count }) => {
      acc[status] = Number(count);
      return acc;
    }, {} as Record<string, number>);
    
    // Format monthly revenue
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyRevenue = monthNames.map((name, index) => {
      const monthData = monthlyRevenue.find(item => item.month === index + 1);
      return {
        name,
        total: monthData ? Number(monthData.total) : 0
      };
    });
    
    return res.json({
      totalOrders: Number(totalOrders.count),
      statusCounts: formattedStatusCounts,
      totalRevenue: Number(totalRevenue?.total || 0),
      monthlyRevenue: formattedMonthlyRevenue
    });
  } catch (error) {
    console.error('Error getting order statistics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Dashboard API Endpoints
 */

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get total sales
    const [totalSales] = await db
      .select({
        total: sum(orders.totalAmount)
      })
      .from(orders)
      .where(
        or(
          eq(orders.status, 'delivered'),
          eq(orders.status, 'shipping')
        )
      );
    
    // Get total orders
    const [totalOrders] = await db
      .select({ count: count() })
      .from(orders);
    
    // Get total customers
    const [totalCustomers] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'user'));
    
    // Get total products
    const [totalProducts] = await db
      .select({ count: count() })
      .from(products);
    
    // Get orders by status
    const ordersByStatus = await db
      .select({
        status: orders.status,
        count: count()
      })
      .from(orders)
      .groupBy(orders.status);
    
    // Format order status counts
    const statusCounts = ordersByStatus.reduce((acc, { status, count }) => {
      acc[status] = Number(count);
      return acc;
    }, {} as Record<string, number>);
    
    // Get recent orders (last 5)
    const recentOrders = await db.query.orders.findMany({
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            fullName: true
          }
        }
      },
      orderBy: [desc(orders.createdAt)],
      limit: 5
    });
    
    return res.json({
      sales: {
        total: Number(totalSales?.total || 0)
      },
      orders: {
        total: Number(totalOrders?.count || 0),
        byStatus: statusCounts
      },
      customers: {
        total: Number(totalCustomers?.count || 0)
      },
      products: {
        total: Number(totalProducts?.count || 0)
      },
      recentOrders
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sales by period
router.get('/dashboard/sales-by-period', async (req, res) => {
  try {
    const period = req.query.period as string || 'monthly';
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    
    let salesData;
    
    if (period === 'daily') {
      // Daily sales for the specified month
      salesData = await db
        .select({
          day: sql`EXTRACT(DAY FROM ${orders.createdAt})::integer`,
          total: sum(orders.totalAmount)
        })
        .from(orders)
        .where(
          and(
            sql`EXTRACT(YEAR FROM ${orders.createdAt}) = ${year}`,
            sql`EXTRACT(MONTH FROM ${orders.createdAt}) = ${month}`,
            or(
              eq(orders.status, 'delivered'),
              eq(orders.status, 'shipping')
            )
          )
        )
        .groupBy(sql`EXTRACT(DAY FROM ${orders.createdAt})`)
        .orderBy(sql`EXTRACT(DAY FROM ${orders.createdAt})`);
      
      // Format daily data for the full month
      const daysInMonth = new Date(year, month, 0).getDate();
      const formattedData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayData = salesData.find(item => item.day === day);
        return {
          label: `${day}`,
          value: dayData ? Number(dayData.total) : 0
        };
      });
      
      return res.json({
        period: 'daily',
        data: formattedData
      });
    } else if (period === 'monthly') {
      // Monthly sales for the specified year
      salesData = await db
        .select({
          month: sql`EXTRACT(MONTH FROM ${orders.createdAt})::integer`,
          total: sum(orders.totalAmount)
        })
        .from(orders)
        .where(
          and(
            sql`EXTRACT(YEAR FROM ${orders.createdAt}) = ${year}`,
            or(
              eq(orders.status, 'delivered'),
              eq(orders.status, 'shipping')
            )
          )
        )
        .groupBy(sql`EXTRACT(MONTH FROM ${orders.createdAt})`)
        .orderBy(sql`EXTRACT(MONTH FROM ${orders.createdAt})`);
      
      // Format monthly data for the full year
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedData = monthNames.map((name, index) => {
        const monthData = salesData.find(item => item.month === index + 1);
        return {
          label: name,
          value: monthData ? Number(monthData.total) : 0
        };
      });
      
      return res.json({
        period: 'monthly',
        data: formattedData
      });
    } else if (period === 'yearly') {
      // Get the last 5 years
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 4;
      
      // Yearly sales for the last 5 years
      salesData = await db
        .select({
          year: sql`EXTRACT(YEAR FROM ${orders.createdAt})::integer`,
          total: sum(orders.totalAmount)
        })
        .from(orders)
        .where(
          and(
            sql`EXTRACT(YEAR FROM ${orders.createdAt}) >= ${startYear}`,
            sql`EXTRACT(YEAR FROM ${orders.createdAt}) <= ${currentYear}`,
            or(
              eq(orders.status, 'delivered'),
              eq(orders.status, 'shipping')
            )
          )
        )
        .groupBy(sql`EXTRACT(YEAR FROM ${orders.createdAt})`)
        .orderBy(sql`EXTRACT(YEAR FROM ${orders.createdAt})`);
      
      // Format yearly data for the last 5 years
      const formattedData = Array.from({ length: 5 }, (_, i) => {
        const year = startYear + i;
        const yearData = salesData.find(item => item.year === year);
        return {
          label: `${year}`,
          value: yearData ? Number(yearData.total) : 0
        };
      });
      
      return res.json({
        period: 'yearly',
        data: formattedData
      });
    } else {
      return res.status(400).json({ error: 'Invalid period' });
    }
  } catch (error) {
    console.error('Error getting sales by period:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get popular products
router.get('/dashboard/popular-products', async (req, res) => {
  try {
    // Get top selling products
    const popularProducts = await db
      .select({
        productId: orderItems.productId,
        totalQuantity: sum(orderItems.quantity),
        totalRevenue: sum(sql`${orderItems.quantity} * ${orderItems.price}`)
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        or(
          eq(orders.status, 'delivered'),
          eq(orders.status, 'shipping')
        )
      )
      .groupBy(orderItems.productId)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(5);
    
    // Get product details
    const productIds = popularProducts.map(p => p.productId);
    
    if (productIds.length === 0) {
      return res.json([]);
    }
    
    const productDetails = await db.query.products.findMany({
      where: inArray(products.id, productIds),
      columns: {
        id: true,
        name: true,
        slug: true,
        price: true,
        image: true,
        stock: true
      }
    });
    
    // Combine data
    const result = popularProducts.map(product => {
      const details = productDetails.find(p => p.id === product.productId);
      return {
        id: product.productId,
        name: details?.name || 'Unknown Product',
        slug: details?.slug || '',
        image: details?.image || '',
        price: details?.price || 0,
        stock: details?.stock || 0,
        totalQuantity: Number(product.totalQuantity),
        totalRevenue: Number(product.totalRevenue)
      };
    });
    
    return res.json(result);
  } catch (error) {
    console.error('Error getting popular products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent orders
router.get('/dashboard/recent-orders', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const recentOrders = await db.query.orders.findMany({
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            fullName: true,
            email: true
          }
        },
        orderItems: {
          with: {
            product: {
              columns: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: [desc(orders.createdAt)],
      limit
    });
    
    return res.json(recentOrders);
  } catch (error) {
    console.error('Error getting recent orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Settings Management Endpoints
 */

// Get all settings
router.get('/settings', async (req, res) => {
  try {
    const group = req.query.group as string;
    let settingsData;

    if (group) {
      // Get settings by group
      settingsData = await db
        .select()
        .from(settings)
        .where(eq(settings.group, group))
        .orderBy(asc(settings.key));
    } else {
      // Get all settings
      settingsData = await db
        .select()
        .from(settings)
        .orderBy(asc(settings.group), asc(settings.key));
    }

    // Group settings by their groups
    const groupedSettings = settingsData.reduce((acc, setting) => {
      if (!acc[setting.group]) {
        acc[setting.group] = [];
      }
      acc[setting.group].push(setting);
      return acc;
    }, {} as Record<string, any[]>);

    return res.json(groupedSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get setting by key
router.get('/settings/:key', async (req, res) => {
  try {
    const key = req.params.key;
    
    const setting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    
    if (setting.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    return res.json(setting[0]);
  } catch (error) {
    console.error('Error fetching setting:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update setting
router.put('/settings/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const { value, group, description } = req.body;
    
    if (!value) {
      return res.status(400).json({ error: 'Value is required' });
    }
    
    // Check if setting exists
    const existingSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    
    if (existingSetting.length === 0) {
      // Create new setting
      const newSetting = await db.insert(settings)
        .values({
          key,
          value,
          group: group || 'general',
          description
        })
        .returning();
      
      return res.status(201).json(newSetting[0]);
    } else {
      // Update existing setting
      const updatedSetting = await db.update(settings)
        .set({
          value,
          group: group || existingSetting[0].group,
          description: description || existingSetting[0].description,
          updatedAt: new Date()
        })
        .where(eq(settings.key, key))
        .returning();
      
      return res.json(updatedSetting[0]);
    }
  } catch (error) {
    console.error('Error updating setting:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete setting
router.delete('/settings/:key', async (req, res) => {
  try {
    const key = req.params.key;
    
    // Check if setting exists
    const existingSetting = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    
    if (existingSetting.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    // Delete setting
    await db.delete(settings)
      .where(eq(settings.key, key));
    
    return res.json({ success: true, message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Batch update settings
router.post('/settings/batch', async (req, res) => {
  try {
    const { settings: settingsToUpdate } = req.body;
    
    if (!Array.isArray(settingsToUpdate) || settingsToUpdate.length === 0) {
      return res.status(400).json({ error: 'Invalid settings data' });
    }
    
    const results = [];
    
    // Process each setting
    for (const setting of settingsToUpdate) {
      if (!setting.key || !setting.value) {
        continue;
      }
      
      // Check if setting exists
      const existingSetting = await db
        .select()
        .from(settings)
        .where(eq(settings.key, setting.key))
        .limit(1);
      
      if (existingSetting.length === 0) {
        // Create new setting
        const newSetting = await db.insert(settings)
          .values({
            key: setting.key,
            value: setting.value,
            group: setting.group || 'general',
            description: setting.description
          })
          .returning();
        
        results.push(newSetting[0]);
      } else {
        // Update existing setting
        const updatedSetting = await db.update(settings)
          .set({
            value: setting.value,
            group: setting.group || existingSetting[0].group,
            description: setting.description || existingSetting[0].description,
            updatedAt: new Date()
          })
          .where(eq(settings.key, setting.key))
          .returning();
        
        results.push(updatedSetting[0]);
      }
    }
    
    return res.json(results);
  } catch (error) {
    console.error('Error updating settings in batch:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Marketing & Promotion Management Endpoints
 */

// Get all campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const { type, status, search } = req.query;
    let query = db.select().from(campaigns);
    
    // Apply type filter
    if (type) {
      query = query.where(eq(campaigns.type, type as string));
    }
    
    // Apply status filter
    if (status === 'active') {
      query = query.where(eq(campaigns.isActive, true));
    } else if (status === 'inactive') {
      query = query.where(eq(campaigns.isActive, false));
    }
    
    // Apply search filter
    if (search) {
      query = query.where(like(campaigns.name, `%${search}%`));
    }
    
    // Order by start date descending
    const results = await query.orderBy(desc(campaigns.startDate));
    
    return res.json(results);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get campaign by ID
router.get('/campaigns/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    
    const campaign = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    
    if (campaign.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    return res.json(campaign[0]);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create campaign
router.post('/campaigns', async (req, res) => {
  try {
    const validatedData = insertCampaignSchema.parse(req.body);
    
    const result = await db.insert(campaigns).values(validatedData).returning();
    
    return res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating campaign:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid campaign data', details: error.errors });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update campaign
router.put('/campaigns/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    
    const validatedData = insertCampaignSchema.parse(req.body);
    
    const existingCampaign = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    
    if (existingCampaign.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const result = await db
      .update(campaigns)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(campaigns.id, id))
      .returning();
    
    return res.json(result[0]);
  } catch (error) {
    console.error('Error updating campaign:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid campaign data', details: error.errors });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete campaign
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    
    const existingCampaign = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    
    if (existingCampaign.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    await db.delete(campaigns).where(eq(campaigns.id, id));
    
    return res.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get active campaigns
router.get('/active-campaigns', async (req, res) => {
  try {
    const now = new Date();
    
    const activeCampaigns = await db
      .select()
      .from(campaigns)
      .where(
        and(
          eq(campaigns.isActive, true),
          sql`${campaigns.startDate} <= ${now}`,
          sql`${campaigns.endDate} >= ${now}`
        )
      )
      .orderBy(desc(campaigns.startDate));
    
    return res.json(activeCampaigns);
  } catch (error) {
    console.error('Error fetching active campaigns:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * User Management Endpoints
 */

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, search, page = '1', limit = '10' } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;
    
    // Base query
    let query = db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      isActive: users.isActive,
      phone: users.phone,
      address: users.address,
      createdAt: users.createdAt
    }).from(users);
    
    // Apply role filter
    if (role) {
      query = query.where(eq(users.role, role as string));
    }
    
    // Apply search filter
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(users.username, searchTerm),
          like(users.email, searchTerm),
          like(users.fullName, searchTerm),
          like(users.phone, searchTerm)
        )
      );
    }
    
    // Get total count for pagination
    const totalCountQuery = db.select({ count: count() }).from(users);
    
    // Apply the same filters to count query
    if (role) {
      totalCountQuery.where(eq(users.role, role as string));
    }
    
    if (search) {
      const searchTerm = `%${search}%`;
      totalCountQuery.where(
        or(
          like(users.username, searchTerm),
          like(users.email, searchTerm),
          like(users.fullName, searchTerm),
          like(users.phone, searchTerm)
        )
      );
    }
    
    const [totalResult] = await totalCountQuery;
    const total = Number(totalResult?.count) || 0;
    
    // Apply pagination
    query = query.limit(limitNum).offset(offset).orderBy(desc(users.createdAt));
    
    // Execute query
    const result = await query;
    
    return res.json({
      users: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const user = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      isActive: users.isActive,
      phone: users.phone,
      address: users.address,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get order stats
    const orderStats = await db.select({
      totalOrders: count(),
      totalSpent: sum(orders.totalAmount)
    })
    .from(orders)
    .where(eq(orders.userId, id));
    
    return res.json({
      ...user[0],
      stats: {
        totalOrders: Number(orderStats[0]?.totalOrders) || 0,
        totalSpent: Number(orderStats[0]?.totalSpent) || 0
      }
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const { username, email, fullName, role, isActive, phone, address } = req.body;
    
    // Check if user exists
    const existingUser = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user
    const result = await db.update(users)
      .set({
        username,
        email,
        fullName,
        role,
        isActive,
        phone,
        address,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        isActive: users.isActive,
        phone: users.phone,
        address: users.address
      });
    
    return res.json(result[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Check if user exists
    const existingUser = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if the user is an admin
    if (existingUser[0].id === 1) {
      return res.status(403).json({ error: 'Cannot delete the main administrator account' });
    }
    
    // Delete user
    await db.delete(users).where(eq(users.id, id));
    
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 