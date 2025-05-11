import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { 
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  CalendarRange,
  RefreshCw,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  FileText,
} from "lucide-react";
import axios from "axios";
import Spinner from "@/components/ui/spinner";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Định dạng tiền tệ VND
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

// Màu cho biểu đồ tròn
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Component hiển thị số liệu tổng quan với xu hướng
const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  trendLabel,
  iconColor = "text-primary",
  trendColor = "text-green-600"
}: { 
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  trendValue: string;
  trendLabel: string;
  iconColor?: string;
  trendColor?: string;
}) => {
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
  const actualTrendColor = trend === 'up' ? "text-green-600" : "text-red-600";
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-3xl font-bold">{value}</h2>
          </div>
          <div className={`p-2.5 rounded-full bg-primary/10 ${iconColor}`}>
            {icon}
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <TrendIcon className={`h-4 w-4 mr-1 ${actualTrendColor}`} />
          <span className={`font-medium ${actualTrendColor}`}>{trendValue}</span>
          <span className="text-muted-foreground ml-1">{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const ReportsDashboard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState("bar");
  const [loading, setLoading] = useState(false);
  
  // Các state để lưu trữ dữ liệu từ API
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productStats, setProductStats] = useState<any[]>([]);
  const [customerStats, setCustomerStats] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    statusCounts: {}
  });
  
  // Tải dữ liệu khi component mount và khi timeRange thay đổi
  useEffect(() => {
    fetchDashboardData();
    fetchSalesData();
  }, [timeRange]);
  
  // Hàm tải dữ liệu dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard/stats');
      setDashboardStats(response.data);
      
      // Tải dữ liệu sản phẩm phổ biến
      const productsResponse = await axios.get('/api/admin/stats/products', {
        params: { sortBy: 'sales', limit: 5 }
      });
      setProductStats(productsResponse.data);
      
      // Tải dữ liệu khách hàng
      const customersResponse = await axios.get('/api/admin/stats/customers', {
        params: { period: timeRange, sortBy: 'spent', limit: 5 }
      });
      setCustomerStats(customersResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu thống kê. Vui lòng thử lại sau."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm tải dữ liệu doanh số
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const period = timeRange === 'year' ? 'yearly' : timeRange === 'week' ? 'daily' : 'monthly';
      
      const response = await axios.get('/api/admin/stats/sales', {
        params: { period }
      });
      
      // Định dạng dữ liệu cho biểu đồ
      const formattedData = response.data.data.map((item: any) => {
        if (period === 'monthly') {
          const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                              'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
          return {
            month: monthNames[item.month - 1],
            sales: item.total
          };
        } else if (period === 'daily') {
          return {
            day: format(new Date(item.date), 'dd/MM'),
            sales: item.total
          };
        } else {
          return {
            year: item.year.toString(),
            sales: item.total
          };
        }
      });
      
      setSalesData(formattedData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải dữ liệu doanh số. Vui lòng thử lại sau."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Tính toán dữ liệu danh mục từ productStats
  const getCategoryData = () => {
    const categoryMap = productStats.reduce((acc: any, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += product.totalRevenue;
      return acc;
    }, {});
    
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // Dữ liệu thống kê
  const getStatsData = () => [
    {
      title: "Doanh thu",
      value: formatCurrency(dashboardStats.totalSales || 0),
      icon: <DollarSign className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+12.5%",
      trendLabel: "so với tháng trước",
      iconColor: "text-green-600"
    },
    {
      title: "Đơn hàng",
      value: dashboardStats.totalOrders?.toString() || "0",
      icon: <ShoppingCart className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+8.2%",
      trendLabel: "so với tháng trước",
      iconColor: "text-blue-600"
    },
    {
      title: "Khách hàng",
      value: dashboardStats.totalCustomers?.toString() || "0",
      icon: <Users className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+15.3%",
      trendLabel: "so với tháng trước",
      iconColor: "text-purple-600"
    },
    {
      title: "Sản phẩm",
      value: dashboardStats.totalProducts?.toString() || "0",
      icon: <Package className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+5.7%",
      trendLabel: "so với tháng trước",
      iconColor: "text-amber-600"
    }
  ];
  
  const handleRefresh = () => {
    fetchDashboardData();
    fetchSalesData();
    toast({
      title: "Đang làm mới",
      description: "Đang tải lại dữ liệu báo cáo..."
    });
  };
  
  const handleDownload = () => {
    // Trong thực tế, sẽ tạo và tải xuống tệp CSV/Excel
    toast({
      title: "Đang chuẩn bị tải xuống",
      description: "Đang chuẩn bị báo cáo để tải xuống..."
    });
  };
  
  const renderSalesChart = () => {
    if (salesData.length === 0) {
      return (
        <div className="flex justify-center items-center h-[350px]">
          <p className="text-muted-foreground">Không có dữ liệu doanh số</p>
        </div>
      );
    }
    
    const dataKey = timeRange === 'week' ? 'day' : timeRange === 'year' ? 'year' : 'month';
    
    switch(chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKey} />
              <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Doanh thu" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKey} />
              <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Doanh thu" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKey} />
              <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };
  
  if (loading && salesData.length === 0) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-[500px]">
            <Spinner size="lg" />
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Báo cáo & Thống kê | Yapee Admin</title>
      </Helmet>
      
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Báo cáo & Thống kê</h1>
            <p className="text-muted-foreground">Xem số liệu thống kê và báo cáo kinh doanh</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getStatsData().map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        
        <Tabs defaultValue="sales" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="sales">
                <TrendingUp className="h-4 w-4 mr-2" />
                Doanh số
              </TabsTrigger>
              <TabsTrigger value="products">
                <Package className="h-4 w-4 mr-2" />
                Sản phẩm
              </TabsTrigger>
              <TabsTrigger value="customers">
                <Users className="h-4 w-4 mr-2" />
                Khách hàng
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <CalendarRange className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Chọn khoảng thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Thống kê doanh số</CardTitle>
                  <CardDescription>
                    Doanh số bán hàng theo {timeRange === 'week' ? 'ngày' : timeRange === 'month' ? 'tháng' : 'năm'}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={chartType === "bar" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={chartType === "line" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("line")}
                  >
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={chartType === "area" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartType("area")}
                  >
                    <AreaChart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-[350px]">
                    <Spinner />
                  </div>
                ) : (
                  renderSalesChart()
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Cập nhật lần cuối: {format(new Date(), 'HH:mm dd/MM/yyyy')}
                </p>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <FileText className="h-4 w-4 mr-2" />
                  Tải xuống báo cáo
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Phân bổ doanh số theo danh mục</CardTitle>
                  <CardDescription>
                    Doanh số bán hàng theo từng danh mục sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-[300px]">
                      <Spinner />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getCategoryData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getCategoryData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái đơn hàng</CardTitle>
                  <CardDescription>
                    Tỷ lệ đơn hàng theo trạng thái
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-[300px]">
                      <Spinner />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Đang chờ', value: dashboardStats.statusCounts?.pending || 0 },
                            { name: 'Đang xử lý', value: dashboardStats.statusCounts?.processing || 0 },
                            { name: 'Đang giao', value: dashboardStats.statusCounts?.shipping || 0 },
                            { name: 'Đã giao', value: dashboardStats.statusCounts?.delivered || 0 },
                            { name: 'Đã hủy', value: dashboardStats.statusCounts?.cancelled || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#f97316" />
                          <Cell fill="#3b82f6" />
                          <Cell fill="#a855f7" />
                          <Cell fill="#22c55e" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
                <CardDescription>
                  Top sản phẩm bán chạy nhất trong {timeRange === 'week' ? '7 ngày qua' : timeRange === 'month' ? '30 ngày qua' : 'năm nay'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner />
                  </div>
                ) : productStats.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Không có dữ liệu sản phẩm</p>
                ) : (
                  <div className="space-y-8">
                    {productStats.map((product, index) => (
                      <div key={product.id} className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Danh mục: {product.category}</p>
                            <p className="text-sm text-muted-foreground">
                              Đã bán: <span className="font-medium">{product.totalQuantity}</span> sản phẩm
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(product.totalRevenue)}</p>
                          <p className="text-sm text-muted-foreground">Giá trung bình: {formatCurrency(product.averagePrice)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Xem báo cáo đầy đủ
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Khách hàng tiềm năng</CardTitle>
                <CardDescription>
                  Top khách hàng chi tiêu nhiều nhất trong {timeRange === 'week' ? '7 ngày qua' : timeRange === 'month' ? '30 ngày qua' : 'năm nay'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner />
                  </div>
                ) : customerStats.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Không có dữ liệu khách hàng</p>
                ) : (
                  <div className="space-y-8">
                    {customerStats.map((customer, index) => (
                      <div key={customer.id} className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 rounded-full bg-primary/10 text-primary items-center justify-center font-bold">
                            {customer.fullName?.charAt(0) || customer.username?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium">{customer.fullName || customer.username}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Số đơn hàng: <span className="font-medium">{customer.orderCount}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(customer.totalSpent)}</p>
                          <p className="text-sm text-muted-foreground">
                            Trung bình: {formatCurrency(customer.avgOrderValue)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Xem báo cáo đầy đủ
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsDashboard;