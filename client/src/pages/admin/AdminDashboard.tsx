import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  ArrowUpRight, 
  Clock,
  CheckCheck,
  Truck,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';

// Currency formatter
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Status badge component
const OrderStatusBadge = ({ status }: { status: string }) => {
  const statuses: Record<string, { label: string, className: string }> = {
    'pending': { label: 'Chờ xử lý', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    'processing': { label: 'Đang xử lý', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    'shipping': { label: 'Đang giao', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    'delivered': { label: 'Đã giao', className: 'bg-green-50 text-green-700 border-green-200' },
    'cancelled': { label: 'Đã hủy', className: 'bg-red-50 text-red-700 border-red-200' },
  };

  const statusInfo = statuses[status] || { label: status, className: '' };
  
  return (
    <Badge variant="outline" className={statusInfo.className}>
      {statusInfo.label}
    </Badge>
  );
};

interface DashboardStats {
  sales: {
    total: number;
  };
  orders: {
    total: number;
    byStatus: Record<string, number>;
  };
  customers: {
    total: number;
  };
  products: {
    total: number;
  };
  recentOrders: any[];
}

interface SalesDataPoint {
  label: string;
  value: number;
}

interface SalesDataResponse {
  period: string;
  data: SalesDataPoint[];
}

interface PopularProduct {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
  totalQuantity: number;
  totalRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [yearlySalesData, setYearlySalesData] = useState<SalesDataPoint[]>([]);
  const [salesPeriod, setSalesPeriod] = useState<string>('monthly');
  
  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      // Fetch dashboard stats
      const statsResponse = await apiRequest('GET', '/api/admin/dashboard/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      // Fetch recent orders
      const recentOrdersResponse = await apiRequest('GET', '/api/admin/dashboard/recent-orders?limit=5');
      const recentOrdersData = await recentOrdersResponse.json();
      setRecentOrders(recentOrdersData);
      
      // Fetch popular products
      const popularProductsResponse = await apiRequest('GET', '/api/admin/dashboard/popular-products');
      const popularProductsData = await popularProductsResponse.json();
      setPopularProducts(popularProductsData);
      
      // Fetch monthly sales data
      const monthlySalesResponse = await apiRequest('GET', '/api/admin/dashboard/sales-by-period?period=monthly');
      const monthlySalesData = await monthlySalesResponse.json();
      setSalesData(monthlySalesData.data);
      
      // Fetch yearly sales data
      const yearlySalesResponse = await apiRequest('GET', '/api/admin/dashboard/sales-by-period?period=yearly');
      const yearlySalesData = await yearlySalesResponse.json();
      setYearlySalesData(yearlySalesData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // Fetch sales data when period changes
  const fetchSalesData = async (period: string) => {
    try {
      const response = await apiRequest('GET', `/api/admin/dashboard/sales-by-period?period=${period}`);
      const salesData = await response.json();
      
      if (period === 'yearly') {
        setYearlySalesData(salesData.data);
      } else {
        setSalesData(salesData.data);
      }
    } catch (error) {
      console.error(`Error fetching ${period} sales data:`, error);
      toast.error(`Không thể tải dữ liệu doanh thu ${period === 'yearly' ? 'theo năm' : 'theo tháng'}`);
    }
  };
  
  // Handle period change
  const handlePeriodChange = (period: string) => {
    setSalesPeriod(period);
    if ((period === 'monthly' && salesData.length === 0) || 
        (period === 'yearly' && yearlySalesData.length === 0)) {
      fetchSalesData(period);
    }
  };
  
  // Convert sales data to format expected by chart
  const getChartData = () => {
    if (salesPeriod === 'yearly') {
      return yearlySalesData.map(item => ({
        name: item.label,
        total: item.value
      }));
    } else {
      return salesData.map(item => ({
        name: item.label,
        total: item.value
      }));
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Tải lại
          </Button>
          <Button variant="outline" size="sm">
            {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner size="lg" />
        </div>
      ) : stats ? (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-start">
                <div className="p-2 bg-primary/10 rounded-md mb-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{formatPrice(stats.sales.total)}</h3>
                <p className="text-sm text-gray-500">Tổng doanh thu</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-start">
                <div className="p-2 bg-green-500/10 rounded-md mb-3">
                  <ShoppingBag className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold">{stats.orders.total.toLocaleString()}</h3>
                <p className="text-sm text-gray-500">Tổng đơn hàng</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-start">
                <div className="p-2 bg-blue-500/10 rounded-md mb-3">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold">{stats.customers.total.toLocaleString()}</h3>
                <p className="text-sm text-gray-500">Tổng khách hàng</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-start">
                <div className="p-2 bg-orange-500/10 rounded-md mb-3">
                  <Package className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold">{stats.products.total.toLocaleString()}</h3>
                <p className="text-sm text-gray-500">Tổng sản phẩm</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Order status cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-yellow-700">{stats.orders.byStatus.pending || 0}</h3>
                  <p className="text-sm text-yellow-600">Chờ xử lý</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-500 opacity-80" />
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-blue-700">{stats.orders.byStatus.processing || 0}</h3>
                  <p className="text-sm text-blue-600">Đang xử lý</p>
                </div>
                <Package className="h-10 w-10 text-blue-500 opacity-80" />
              </CardContent>
            </Card>
            
            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700">{stats.orders.byStatus.shipping || 0}</h3>
                  <p className="text-sm text-indigo-600">Đang giao</p>
                </div>
                <Truck className="h-10 w-10 text-indigo-500 opacity-80" />
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-green-700">{stats.orders.byStatus.delivered || 0}</h3>
                  <p className="text-sm text-green-600">Đã giao</p>
                </div>
                <CheckCheck className="h-10 w-10 text-green-500 opacity-80" />
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-red-700">{stats.orders.byStatus.cancelled || 0}</h3>
                  <p className="text-sm text-red-600">Đã hủy</p>
                </div>
                <XCircle className="h-10 w-10 text-red-500 opacity-80" />
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">Không thể tải dữ liệu dashboard</p>
          <Button variant="outline" className="ml-4" onClick={fetchDashboardData}>
            Thử lại
          </Button>
        </div>
      )}
      
      {/* Sales chart */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly" onValueChange={handlePeriodChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="monthly">Theo tháng</TabsTrigger>
                <TabsTrigger value="yearly">Theo năm</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly" className="h-[300px]">
                {salesData.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()}>
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000000}M`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatPrice(value), 'Doanh thu']}
                        labelStyle={{ color: '#111' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '8px' 
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        fill="rgba(37, 99, 235, 0.8)" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>
              
              <TabsContent value="yearly" className="h-[300px]">
                {yearlySalesData.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <Spinner size="lg" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()}>
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value / 1000000000}B`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatPrice(value), 'Doanh thu']}
                        labelStyle={{ color: '#111' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '8px' 
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        fill="rgba(37, 99, 235, 0.8)" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="gap-1">
                Xem tất cả
                <ArrowUpRight size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-gray-500">Không có đơn hàng nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm">Mã đơn</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Khách hàng</th>
                      <th className="text-left py-3 px-4 font-medium text-sm">Trạng thái</th>
                      <th className="text-right py-3 px-4 font-medium text-sm">Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">
                          <Link href={`/admin/orders/${order.id}`}>
                            <span className="text-primary hover:underline">#{order.id}</span>
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          {order.shippingName}
                        </td>
                        <td className="py-3 px-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Popular products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="gap-1">
                Xem tất cả
                <ArrowUpRight size={16} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {popularProducts.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-gray-500">Không có dữ liệu sản phẩm</p>
              </div>
            ) : (
              <div className="space-y-4">
                {popularProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 py-2">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <h4 className="font-medium text-sm line-clamp-1 hover:text-primary hover:underline">
                          {product.name}
                        </h4>
                      </Link>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>Đã bán: {product.totalQuantity}</span>
                        <span className="mx-2">•</span>
                        <span>Tồn kho: {product.stock}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(product.price)}</p>
                      <p className="text-xs text-gray-500 mt-1">Doanh thu: {formatPrice(product.totalRevenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;