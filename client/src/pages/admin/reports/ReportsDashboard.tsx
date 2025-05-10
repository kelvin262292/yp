import { Helmet } from "react-helmet";
import { useState } from "react";
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
} from "lucide-react";

// Dữ liệu bán hàng theo tháng
const salesData = [
  { month: 'Tháng 1', sales: 1200000 },
  { month: 'Tháng 2', sales: 1900000 },
  { month: 'Tháng 3', sales: 2400000 },
  { month: 'Tháng 4', sales: 1800000 },
  { month: 'Tháng 5', sales: 2800000 },
  { month: 'Tháng 6', sales: 3100000 },
  { month: 'Tháng 7', sales: 2700000 },
  { month: 'Tháng 8', sales: 3600000 },
  { month: 'Tháng 9', sales: 3200000 },
  { month: 'Tháng 10', sales: 3800000 },
  { month: 'Tháng 11', sales: 4100000 },
  { month: 'Tháng 12', sales: 4900000 },
];

// Dữ liệu danh mục sản phẩm
const categoryData = [
  { name: 'Điện thoại', value: 42 },
  { name: 'Laptop', value: 28 },
  { name: 'Tai nghe', value: 15 },
  { name: 'Phụ kiện', value: 10 },
  { name: 'Khác', value: 5 },
];

// Dữ liệu cho biểu đồ tăng trưởng
const growthData = [
  { name: 'T1', value: 400 },
  { name: 'T2', value: 450 },
  { name: 'T3', value: 520 },
  { name: 'T4', value: 590 },
  { name: 'T5', value: 680 },
  { name: 'T6', value: 720 },
  { name: 'T7', value: 800 },
  { name: 'T8', value: 910 },
  { name: 'T9', value: 1020 },
  { name: 'T10', value: 1080 },
  { name: 'T11', value: 1200 },
  { name: 'T12', value: 1320 },
];

// Dữ liệu cho biểu đồ khách hàng mới
const newCustomersData = [
  { name: 'T1', value: 120 },
  { name: 'T2', value: 140 },
  { name: 'T3', value: 180 },
  { name: 'T4', value: 160 },
  { name: 'T5', value: 210 },
  { name: 'T6', value: 240 },
  { name: 'T7', value: 230 },
  { name: 'T8', value: 270 },
  { name: 'T9', value: 300 },
  { name: 'T10', value: 320 },
  { name: 'T11', value: 380 },
  { name: 'T12', value: 420 },
];

// Màu cho biểu đồ tròn
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Định dạng tiền tệ VND
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

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
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState("bar");
  
  // Dữ liệu tổng quan
  const stats = [
    {
      title: "Doanh thu",
      value: formatCurrency(35800000),
      icon: <DollarSign className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+12.5%",
      trendLabel: "so với tháng trước",
      iconColor: "text-green-600"
    },
    {
      title: "Đơn hàng",
      value: "248",
      icon: <ShoppingCart className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+8.2%",
      trendLabel: "so với tháng trước",
      iconColor: "text-blue-600"
    },
    {
      title: "Khách hàng mới",
      value: "385",
      icon: <Users className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+15.3%",
      trendLabel: "so với tháng trước",
      iconColor: "text-purple-600"
    },
    {
      title: "Sản phẩm bán ra",
      value: "529",
      icon: <Package className="h-5 w-5" />,
      trend: "down" as const,
      trendValue: "-3.1%",
      trendLabel: "so với tháng trước",
      iconColor: "text-amber-600"
    }
  ];
  
  const handleRefresh = () => {
    // Trong thực tế, sẽ tải lại dữ liệu từ server
    alert("Đang tải lại dữ liệu báo cáo...");
  };
  
  const handleDownload = () => {
    // Trong thực tế, sẽ tạo và tải xuống tệp CSV/Excel
    alert("Đang tạo báo cáo để tải xuống...");
  };
  
  const renderSalesChart = () => {
    switch(chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
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
              <XAxis dataKey="month" />
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
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000000}tr`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Báo cáo & Thống kê | Yapee Admin</title>
        <meta name="description" content="Xem báo cáo và phân tích dữ liệu chi tiết về hoạt động kinh doanh, doanh thu và xu hướng khách hàng." />
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Báo cáo & Thống kê</h1>
            <p className="text-muted-foreground">Phân tích chi tiết về hoạt động kinh doanh của bạn</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Làm mới
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
        
        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        
        <Tabs defaultValue="sales" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="sales">Doanh thu</TabsTrigger>
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger value="customers">Khách hàng</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Khoảng thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
                  <SelectItem value="quarter">Quý này</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Tab doanh thu */}
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Doanh thu bán hàng</CardTitle>
                    <CardDescription>
                      Doanh thu theo tháng trong năm
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1 bg-muted p-1 rounded-md">
                    <Button 
                      variant={chartType === "bar" ? "secondary" : "ghost"} 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setChartType("bar")}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={chartType === "line" ? "secondary" : "ghost"} 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setChartType("line")}
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={chartType === "area" ? "secondary" : "ghost"} 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setChartType("area")}
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderSalesChart()}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-5">
                <div>
                  <p className="text-sm font-medium">Tổng doanh thu</p>
                  <p className="text-2xl font-bold">{formatCurrency(35800000)}</p>
                </div>
                <Button variant="outline" size="sm">
                  <CalendarRange className="h-4 w-4 mr-1" />
                  Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Danh mục bán chạy</CardTitle>
                  <CardDescription>
                    Phân bổ doanh thu theo danh mục sản phẩm
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tăng trưởng</CardTitle>
                  <CardDescription>
                    Tốc độ tăng trưởng doanh thu theo tháng
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value} đơn`} />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab sản phẩm */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích sản phẩm</CardTitle>
                <CardDescription>
                  Hiệu suất bán hàng của các sản phẩm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Smartphone X Pro 128GB</p>
                        <p className="text-sm text-muted-foreground">Điện thoại / Smartphone</p>
                      </div>
                      <div className="font-medium">152 đã bán</div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Laptop Gaming 15</p>
                        <p className="text-sm text-muted-foreground">Laptop / Gaming</p>
                      </div>
                      <div className="font-medium">98 đã bán</div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Wireless Earbuds Pro</p>
                        <p className="text-sm text-muted-foreground">Âm thanh / Tai nghe</p>
                      </div>
                      <div className="font-medium">87 đã bán</div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "58%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Smart TV 43 inch</p>
                        <p className="text-sm text-muted-foreground">Điện tử / TV</p>
                      </div>
                      <div className="font-medium">75 đã bán</div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Smartwatch Series 5</p>
                        <p className="text-sm text-muted-foreground">Đồng hồ / Smartwatch</p>
                      </div>
                      <div className="font-medium">62 đã bán</div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "38%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Xem tất cả sản phẩm</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Tab khách hàng */}
          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Khách hàng mới</CardTitle>
                  <CardDescription>
                    Số lượng khách hàng đăng ký mới theo tháng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={newCustomersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value} khách hàng`} />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="grid grid-cols-3 w-full gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
                      <p className="text-xl font-bold">3,240</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Khách hàng mới</p>
                      <p className="text-xl font-bold">+385</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tỉ lệ hồi lại</p>
                      <p className="text-xl font-bold">42%</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Phân tích địa lý</CardTitle>
                  <CardDescription>
                    Phân bố khách hàng theo khu vực địa lý
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Hà Nội</p>
                        <p className="text-sm text-muted-foreground">Miền Bắc</p>
                      </div>
                      <div className="font-medium">35%</div>
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">TP. Hồ Chí Minh</p>
                        <p className="text-sm text-muted-foreground">Miền Nam</p>
                      </div>
                      <div className="font-medium">42%</div>
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Đà Nẵng</p>
                        <p className="text-sm text-muted-foreground">Miền Trung</p>
                      </div>
                      <div className="font-medium">12%</div>
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Cần Thơ</p>
                        <p className="text-sm text-muted-foreground">Miền Tây</p>
                      </div>
                      <div className="font-medium">8%</div>
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Khác</p>
                        <p className="text-sm text-muted-foreground">Các tỉnh khác</p>
                      </div>
                      <div className="font-medium">3%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsDashboard;