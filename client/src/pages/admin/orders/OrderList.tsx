import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Search, 
  Filter, 
  Calendar, 
  MoreHorizontal, 
  Eye, 
  FileText, 
  Printer,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import axios from 'axios';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';
import EmptyState from '@/components/ui/empty-state';

// Types
interface Customer {
  id: number;
  username: string;
  fullName: string;
  email: string;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
}

interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPhone: string;
  shippingName: string;
  paymentMethod: string;
  paymentStatus: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: Customer;
  orderItems: OrderItem[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface StatusCounts {
  [key: string]: number;
}

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

// Payment status badge component
const PaymentStatusBadge = ({ status }: { status: string }) => {
  const statuses: Record<string, { label: string, className: string }> = {
    'paid': { label: 'Đã thanh toán', className: 'bg-green-50 text-green-700 border-green-200' },
    'pending': { label: 'Chờ thanh toán', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    'refunded': { label: 'Đã hoàn tiền', className: 'bg-purple-50 text-purple-700 border-purple-200' },
    'failed': { label: 'Thất bại', className: 'bg-red-50 text-red-700 border-red-200' },
  };

  const statusInfo = statuses[status] || { label: status, className: '' };
  
  return (
    <Badge variant="outline" className={statusInfo.className}>
      {statusInfo.label}
    </Badge>
  );
};

// Payment method badge component
const PaymentMethodBadge = ({ method }: { method: string }) => {
  const methods: Record<string, { label: string }> = {
    'cod': { label: 'COD' },
    'bank-transfer': { label: 'Chuyển khoản' },
    'momo': { label: 'MoMo' },
    'vnpay': { label: 'VNPay' },
    'credit-card': { label: 'Thẻ tín dụng' },
  };

  const methodInfo = methods[method] || { label: method };
  
  return (
    <Badge variant="outline" className="border-gray-200">
      {methodInfo.label}
    </Badge>
  );
};

const OrderList = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({});
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Selected orders for bulk actions
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  // Fetch orders from API
  const fetchOrders = async (page = 1, status = '', search = '', sort = 'createdAt', order = 'desc') => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `/api/admin/orders?page=${page}&limit=10&sortBy=${sort}&sortOrder=${order}`;
      
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await axios.get(url);
      
      setOrders(response.data.orders);
      setPaginationInfo(response.data.pagination);
      setStatusCounts(response.data.statusCounts);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, []);

  // Refetch when filters or pagination change
  useEffect(() => {
    fetchOrders(currentPage, activeTab !== 'all' ? activeTab : '', searchQuery, sortBy, sortOrder);
  }, [currentPage, activeTab, sortBy, sortOrder]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders(1, activeTab !== 'all' ? activeTab : '', searchQuery, sortBy, sortOrder);
  };

  // Handle search on enter key
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSelectedOrders([]);
    setAllSelected(false);
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
    setAllSelected(!allSelected);
  };
  
  // Handle single select
  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
    } else {
        return [...prev, orderId];
      }
    });
  };

  // Handle order status update
  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      
      // Refresh the orders list
      fetchOrders(currentPage, activeTab !== 'all' ? activeTab : '', searchQuery, sortBy, sortOrder);
      toast.success(`Order status updated successfully`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };
  
  // Get total for all statuses
  const getTotalOrderCount = () => {
    return Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchOrders(currentPage, activeTab !== 'all' ? activeTab : '', searchQuery, sortBy, sortOrder)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
          </Button>
        </div>
      </div>
      
        {/* Search and filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 flex items-center">
            <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                placeholder="Tìm theo mã đơn hàng, tên khách hàng..."
                className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                />
            </div>
            <Button variant="default" className="ml-2" onClick={handleSearch}>
              Tìm
              </Button>
          </div>
          
          <div className="md:col-span-6 flex justify-end items-center gap-2">
            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="createdAt">Ngày tạo</SelectItem>
                <SelectItem value="totalAmount">Tổng tiền</SelectItem>
                <SelectItem value="id">Mã đơn hàng</SelectItem>
                  </SelectContent>
                </Select>
              
                    <Button
                      variant="outline"
              className="px-3"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
              {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                    </Button>
          </div>
              </div>

        {/* Order Status Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
                <TabsTrigger 
                  value="all" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-4 px-6"
                >
                  Tất cả ({getTotalOrderCount()})
                </TabsTrigger>
                <TabsTrigger 
                  value="pending" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-4 px-6"
                >
                  Chờ xử lý ({statusCounts.pending || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="processing" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-4 px-6"
                >
                  Đang xử lý ({statusCounts.processing || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="shipping" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-4 px-6"
                >
                  Đang giao ({statusCounts.shipping || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="delivered" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-4 px-6"
                >
                  Đã giao ({statusCounts.delivered || 0})
                </TabsTrigger>
                <TabsTrigger 
                  value="cancelled" 
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-4 px-6"
                >
                  Đã hủy ({statusCounts.cancelled || 0})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="p-0 mt-0">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Spinner size="lg" />
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center py-12">
                    <p className="text-red-500">{error}</p>
                    <Button variant="outline" className="ml-4" onClick={() => fetchOrders()}>
                      Thử lại
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <EmptyState
                    title="Không tìm thấy đơn hàng nào"
                    description="Không có đơn hàng nào phù hợp với tiêu chí tìm kiếm của bạn."
                    icon={<FileText className="h-12 w-12 text-gray-400" />}
                  />
                ) : (
                  <>
                    {/* Orders table */}
          <div className="overflow-x-auto">
                      <table className="w-full">
              <thead>
                <tr className="border-b">
                            <th className="py-3 px-4 text-left font-medium text-sm">
                    <Checkbox 
                                checked={allSelected}
                      onCheckedChange={handleSelectAll}
                                aria-label="Select all"
                    />
                  </th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Mã đơn</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Khách hàng</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Ngày tạo</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Trạng thái</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Thanh toán</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Tổng tiền</th>
                            <th className="py-3 px-4 text-center font-medium text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                          {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                        <Checkbox 
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => handleSelectOrder(order.id)}
                                  aria-label={`Select order ${order.id}`}
                        />
                      </td>
                              <td className="py-3 px-4 font-medium">#{order.id}</td>
                              <td className="py-3 px-4">
                                <div className="flex flex-col">
                                  <span className="font-medium">{order.shippingName}</span>
                                  <span className="text-sm text-gray-500">{order.shippingPhone}</span>
                        </div>
                      </td>
                              <td className="py-3 px-4 text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                              <td className="py-3 px-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                              <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <PaymentMethodBadge method={order.paymentMethod} />
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                      </td>
                              <td className="py-3 px-4 font-medium">
                                {formatPrice(order.totalAmount)}
                      </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-center items-center gap-2">
                                  <Link href={`/admin/orders/${order.id}`}>
                                    <Button variant="ghost" size="icon" title="Xem chi tiết">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" title="Tùy chọn">
                                        <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                        <Link href={`/admin/orders/${order.id}`}>
                                          <DropdownMenuItem>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Xem chi tiết
                                          </DropdownMenuItem>
                                </Link>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Cập nhật trạng thái</DropdownMenuLabel>
                                        {order.status !== 'pending' && (
                                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'pending')}>
                                            Chờ xử lý
                                          </DropdownMenuItem>
                                        )}
                                        {order.status !== 'processing' && (
                                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'processing')}>
                                            Đang xử lý
                                          </DropdownMenuItem>
                                        )}
                                        {order.status !== 'shipping' && (
                                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'shipping')}>
                                            Đang giao
                              </DropdownMenuItem>
                                        )}
                                        {order.status !== 'delivered' && (
                                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                                            Đã giao
                              </DropdownMenuItem>
                                        )}
                                        {order.status !== 'cancelled' && (
                                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                                            Hủy đơn hàng
                              </DropdownMenuItem>
                                        )}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                                </div>
                      </td>
                    </tr>
                          ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
                    <div className="flex items-center justify-between p-4 border-t">
                      <div className="text-sm text-gray-500">
                        Hiển thị {orders.length} trong tổng số {paginationInfo.totalItems} đơn hàng
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                </Button>
                        <span className="text-sm">
                          Trang {currentPage} / {paginationInfo.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, paginationInfo.totalPages))}
                          disabled={currentPage === paginationInfo.totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
                  </>
          )}
              </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
};

export default OrderList;