import React from 'react';
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

// Sample data for the dashboard
const salesData = [
  { name: 'Jan', total: 120000000 },
  { name: 'Feb', total: 145000000 },
  { name: 'Mar', total: 180000000 },
  { name: 'Apr', total: 160000000 },
  { name: 'May', total: 200000000 },
  { name: 'Jun', total: 190000000 },
  { name: 'Jul', total: 240000000 },
  { name: 'Aug', total: 230000000 },
  { name: 'Sep', total: 270000000 },
  { name: 'Oct', total: 250000000 },
  { name: 'Nov', total: 290000000 },
  { name: 'Dec', total: 320000000 },
];

const yearlyData = [
  { name: '2019', total: 1200000000 },
  { name: '2020', total: 1500000000 },
  { name: '2021', total: 1800000000 },
  { name: '2022', total: 2100000000 },
  { name: '2023', total: 2500000000 },
  { name: '2024', total: 2800000000 },
];

const categoryData = [
  { name: 'Điện thoại', value: 35 },
  { name: 'Điện tử', value: 25 },
  { name: 'Thời trang', value: 15 },
  { name: 'Làm đẹp', value: 12 },
  { name: 'Đồ gia dụng', value: 8 },
  { name: 'Khác', value: 5 },
];

const recentOrders = [
  {
    id: 'YP1234',
    customer: 'Nguyễn Văn A',
    date: '2023-05-01',
    status: 'processing',
    total: 1299000
  },
  {
    id: 'YP1235',
    customer: 'Trần Thị B',
    date: '2023-05-01',
    status: 'processing',
    total: 599000
  },
  {
    id: 'YP1236',
    customer: 'Lê Văn C',
    date: '2023-05-02',
    status: 'delivered',
    total: 189000
  },
  {
    id: 'YP1237',
    customer: 'Phạm Thị D',
    date: '2023-05-03',
    status: 'pending',
    total: 2450000
  },
  {
    id: 'YP1238',
    customer: 'Hoàng Văn E',
    date: '2023-05-03',
    status: 'cancelled',
    total: 799000
  }
];

// Currency formatter
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Status badge component
const OrderStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case 'processing':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
    case 'shipping':
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Shipping</Badge>;
    case 'delivered':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.dashboard')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-start">
            <div className="p-2 bg-primary/10 rounded-md mb-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">{formatPrice(2800000000)}</h3>
            <p className="text-sm text-gray-500">{t('admin.totalSales')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-start">
            <div className="p-2 bg-green-500/10 rounded-md mb-3">
              <ShoppingBag className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold">24,512</h3>
            <p className="text-sm text-gray-500">{t('admin.totalOrders')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-start">
            <div className="p-2 bg-blue-500/10 rounded-md mb-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">12,234</h3>
            <p className="text-sm text-gray-500">{t('admin.totalCustomers')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-start">
            <div className="p-2 bg-orange-500/10 rounded-md mb-3">
              <Package className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold">1,865</h3>
            <p className="text-sm text-gray-500">{t('admin.totalProducts')}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Order status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-yellow-700">128</h3>
              <p className="text-sm text-yellow-600">{t('admin.pendingOrders')}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-500 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-blue-700">254</h3>
              <p className="text-sm text-blue-600">{t('admin.processingOrders')}</p>
            </div>
            <Package className="h-10 w-10 text-blue-500 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-indigo-700">87</h3>
              <p className="text-sm text-indigo-600">{t('admin.shippingOrders')}</p>
            </div>
            <Truck className="h-10 w-10 text-indigo-500 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-green-700">1,432</h3>
              <p className="text-sm text-green-600">{t('admin.completedOrders')}</p>
            </div>
            <CheckCheck className="h-10 w-10 text-green-500 opacity-80" />
          </CardContent>
        </Card>
      </div>
      
      {/* Sales chart */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.salesOverview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly">
              <TabsList className="mb-4">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value / 1000000}M`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${formatPrice(value)}`, 'Revenue']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar
                      dataKey="total"
                      fill="hsl(221.2, 83.2%, 53.3%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="yearly" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyData}>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value / 1000000000}B`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${formatPrice(value)}`, 'Revenue']}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Bar
                      dataKey="total"
                      fill="hsl(221.2, 83.2%, 53.3%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Categories & Recent orders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top categories */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t('admin.topCategories')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${category.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{category.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent orders */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t('admin.recentOrders')}</CardTitle>
            </div>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                {t('admin.viewAll')}
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 font-medium">{t('admin.orderId')}</th>
                      <th className="text-left py-3 font-medium">{t('admin.customer')}</th>
                      <th className="text-left py-3 font-medium">{t('admin.date')}</th>
                      <th className="text-left py-3 font-medium">{t('admin.status')}</th>
                      <th className="text-right py-3 font-medium">{t('admin.total')}</th>
                      <th className="text-right py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="py-3">
                          <span className="font-medium">#{order.id}</span>
                        </td>
                        <td className="py-3">{order.customer}</td>
                        <td className="py-3">{order.date}</td>
                        <td className="py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="py-3 text-right font-medium">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3 text-right">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              {t('admin.viewDetails')}
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;