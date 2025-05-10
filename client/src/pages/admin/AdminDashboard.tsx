import React from 'react';
import { Link } from 'wouter';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package2, 
  ArrowRight, 
  Package, 
  Truck, 
  Check, 
  XCircle,
  BarChart3,
  LineChart
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import StatCard from '@/components/admin/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Sample data for demonstration
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 5890 },
  { name: 'Jun', sales: 4390 },
  { name: 'Jul', sales: 6490 },
];

const productCategoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Fashion', value: 300 },
  { name: 'Beauty', value: 200 },
  { name: 'Home', value: 160 },
  { name: 'Sports', value: 140 },
];

const recentOrders = [
  { id: '#YP1234', customer: 'Nguyễn Văn A', date: '2023-05-01', status: 'delivered', total: '1,299,000₫' },
  { id: '#YP1235', customer: 'Trần Thị B', date: '2023-05-01', status: 'processing', total: '599,000₫' },
  { id: '#YP1236', customer: 'Lê Văn C', date: '2023-05-02', status: 'processing', total: '189,000₫' },
  { id: '#YP1237', customer: 'Phạm Thị D', date: '2023-05-03', status: 'pending', total: '2,450,000₫' },
  { id: '#YP1238', customer: 'Hoàng Văn E', date: '2023-05-03', status: 'cancelled', total: '799,000₫' },
];

const getOrderStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered':
      return <span className="text-xs py-1 px-2 bg-green-100 text-green-800 rounded-full">Delivered</span>;
    case 'processing':
      return <span className="text-xs py-1 px-2 bg-blue-100 text-blue-800 rounded-full">Processing</span>;
    case 'pending':
      return <span className="text-xs py-1 px-2 bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
    case 'cancelled':
      return <span className="text-xs py-1 px-2 bg-red-100 text-red-800 rounded-full">Cancelled</span>;
    default:
      return null;
  }
};

const AdminDashboard = () => {
  const { t } = useLanguage();

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">{t('admin.dashboardTitle')}</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title={t('admin.totalSales')}
          value="324,700,000₫"
          icon={<DollarSign size={24} />}
          change={{ value: "12% so với tháng trước", isPositive: true }}
        />
        <StatCard 
          title={t('admin.totalOrders')}
          value="1,234"
          icon={<ShoppingBag size={24} />}
          change={{ value: "5% so với tháng trước", isPositive: true }}
        />
        <StatCard 
          title={t('admin.totalCustomers')}
          value="5,890"
          icon={<Users size={24} />}
          change={{ value: "8% so với tháng trước", isPositive: true }}
        />
        <StatCard 
          title={t('admin.totalProducts')}
          value="2,458"
          icon={<Package2 size={24} />}
          change={{ value: "3% so với tháng trước", isPositive: false }}
        />
      </div>
      
      {/* Orders Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t('admin.pendingOrders')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-yellow-100 rounded-full text-yellow-700">
                <Package size={18} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">42</p>
                <Link href="/admin/orders/pending" className="text-xs text-primary hover:underline flex items-center justify-end">
                  {t('admin.viewAll')} <ArrowRight size={12} className="ml-1" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t('admin.processingOrders')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-full text-blue-700">
                <Truck size={18} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">78</p>
                <Link href="/admin/orders/processing" className="text-xs text-primary hover:underline flex items-center justify-end">
                  {t('admin.viewAll')} <ArrowRight size={12} className="ml-1" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t('admin.completedOrders')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-full text-green-700">
                <Check size={18} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">956</p>
                <Link href="/admin/orders/completed" className="text-xs text-primary hover:underline flex items-center justify-end">
                  {t('admin.viewAll')} <ArrowRight size={12} className="ml-1" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">
              {t('admin.cancelledOrders')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-red-100 rounded-full text-red-700">
                <XCircle size={18} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">24</p>
                <Link href="/admin/orders/cancelled" className="text-xs text-primary hover:underline flex items-center justify-end">
                  {t('admin.viewAll')} <ArrowRight size={12} className="ml-1" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart size={18} />
              {t('admin.salesOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#0F146D" fill="#0F146D" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 size={18} />
              {t('admin.topCategories')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productCategoryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#F57224" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.recentOrders')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium py-2 px-2">{t('admin.orderId')}</th>
                  <th className="text-left font-medium py-2 px-2">{t('admin.customer')}</th>
                  <th className="text-left font-medium py-2 px-2">{t('admin.date')}</th>
                  <th className="text-left font-medium py-2 px-2">{t('admin.status')}</th>
                  <th className="text-right font-medium py-2 px-2">{t('admin.total')}</th>
                  <th className="text-right font-medium py-2 px-2">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-3 px-2">{order.customer}</td>
                    <td className="py-3 px-2">{order.date}</td>
                    <td className="py-3 px-2">
                      {getOrderStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">{order.total}</td>
                    <td className="py-3 px-2 text-right">
                      <Link 
                        href={`/admin/orders/${order.id}`} 
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20"
                      >
                        {t('admin.viewDetails')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link 
              href="/admin/orders" 
              className="text-sm text-primary hover:underline flex items-center justify-end mx-2"
            >
              {t('admin.viewAllOrders')} <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;