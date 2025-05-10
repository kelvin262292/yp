import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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

// Sample orders data for demonstration
const orders = [
  {
    id: 'YP1234',
    customer: {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0912345678'
    },
    date: new Date('2023-05-01'),
    status: 'processing',
    total: 1299000,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    items: 3
  },
  {
    id: 'YP1235',
    customer: {
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0923456789'
    },
    date: new Date('2023-05-01'),
    status: 'processing',
    total: 599000,
    paymentMethod: 'bank-transfer',
    paymentStatus: 'paid',
    items: 1
  },
  {
    id: 'YP1236',
    customer: {
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0934567890'
    },
    date: new Date('2023-05-02'),
    status: 'delivered',
    total: 189000,
    paymentMethod: 'momo',
    paymentStatus: 'paid',
    items: 2
  },
  {
    id: 'YP1237',
    customer: {
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      phone: '0945678901'
    },
    date: new Date('2023-05-03'),
    status: 'pending',
    total: 2450000,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    items: 4
  },
  {
    id: 'YP1238',
    customer: {
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      phone: '0956789012'
    },
    date: new Date('2023-05-03'),
    status: 'cancelled',
    total: 799000,
    paymentMethod: 'vnpay',
    paymentStatus: 'refunded',
    items: 1
  },
  {
    id: 'YP1239',
    customer: {
      name: 'Vũ Thị F',
      email: 'vuthif@example.com',
      phone: '0967890123'
    },
    date: new Date('2023-05-04'),
    status: 'delivered',
    total: 4750000,
    paymentMethod: 'bank-transfer',
    paymentStatus: 'paid',
    items: 6
  },
  {
    id: 'YP1240',
    customer: {
      name: 'Đặng Văn G',
      email: 'dangvang@example.com',
      phone: '0978901234'
    },
    date: new Date('2023-05-04'),
    status: 'shipping',
    total: 349000,
    paymentMethod: 'momo',
    paymentStatus: 'paid',
    items: 1
  },
  {
    id: 'YP1241',
    customer: {
      name: 'Bùi Thị H',
      email: 'buithih@example.com',
      phone: '0989012345'
    },
    date: new Date('2023-05-05'),
    status: 'shipping',
    total: 1670000,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    items: 3
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

// Payment status badge component
const PaymentStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'paid':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case 'refunded':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Refunded</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Payment method badge component
const PaymentMethodBadge = ({ method }: { method: string }) => {
  switch (method) {
    case 'cod':
      return <Badge variant="outline" className="border-gray-200">COD</Badge>;
    case 'bank-transfer':
      return <Badge variant="outline" className="border-gray-200">Bank Transfer</Badge>;
    case 'momo':
      return <Badge variant="outline" className="border-gray-200">MoMo</Badge>;
    case 'vnpay':
      return <Badge variant="outline" className="border-gray-200">VNPay</Badge>;
    case 'credit-card':
      return <Badge variant="outline" className="border-gray-200">Credit Card</Badge>;
    default:
      return <Badge variant="outline">{method}</Badge>;
  }
};

const OrderList = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | undefined>(undefined);
  const [selectedDateTo, setSelectedDateTo] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter orders based on tab and filters
  const filteredOrders = orders.filter(order => {
    // Tab filtering
    if (activeTab !== 'all' && order.status !== activeTab) return false;
    
    // Search filtering
    if (
      searchQuery && 
      !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Status filtering
    if (selectedStatus && order.status !== selectedStatus) return false;
    
    // Payment status filtering
    if (selectedPaymentStatus && order.paymentStatus !== selectedPaymentStatus) return false;
    
    // Payment method filtering
    if (selectedPaymentMethod && order.paymentMethod !== selectedPaymentMethod) return false;
    
    // Date filtering
    if (selectedDateFrom && new Date(order.date) < selectedDateFrom) return false;
    if (selectedDateTo) {
      const dateTo = new Date(selectedDateTo);
      dateTo.setHours(23, 59, 59, 999); // End of day
      if (new Date(order.date) > dateTo) return false;
    }
    
    return true;
  });
  
  // Handle select all checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
    setAllSelected(!allSelected);
  };
  
  // Handle individual checkbox
  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
      setAllSelected(false);
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
      if (selectedOrders.length + 1 === filteredOrders.length) {
        setAllSelected(true);
      }
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedPaymentStatus('');
    setSelectedPaymentMethod('');
    setSelectedDateFrom(undefined);
    setSelectedDateTo(undefined);
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.orders')}</h1>
          <p className="text-gray-500 mt-1">{t('admin.ordersDescription')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCw size={14} className="mr-2" />
            {t('admin.refresh')}
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download size={14} className="mr-2" />
            {t('admin.exportOrders')}
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Printer size={14} className="mr-2" />
            {t('admin.print')}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t('admin.searchOrders')}
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="mr-2" />
                {t('admin.filters')}
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.orderStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.paymentStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All payment statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.paymentMethod')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All payment methods</SelectItem>
                    <SelectItem value="cod">COD</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="momo">MoMo</SelectItem>
                    <SelectItem value="vnpay">VNPay</SelectItem>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDateFrom ? format(selectedDateFrom, 'dd/MM/yyyy') : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDateFrom}
                      onSelect={setSelectedDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDateTo ? format(selectedDateTo, 'dd/MM/yyyy') : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDateTo}
                      onSelect={setSelectedDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="md:col-span-5 flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  {t('admin.clearFilters')}
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2 text-left">
                    <Checkbox 
                      checked={allSelected && filteredOrders.length > 0}
                      onCheckedChange={handleSelectAll}
                      disabled={filteredOrders.length === 0}
                    />
                  </th>
                  <th className="py-3 px-2 text-left font-medium">{t('admin.orderId')}</th>
                  <th className="py-3 px-2 text-left font-medium">{t('admin.customer')}</th>
                  <th className="py-3 px-2 text-left font-medium">{t('admin.date')}</th>
                  <th className="py-3 px-2 text-left font-medium">{t('admin.status')}</th>
                  <th className="py-3 px-2 text-left font-medium">{t('admin.payment')}</th>
                  <th className="py-3 px-2 text-right font-medium">{t('admin.total')}</th>
                  <th className="py-3 px-2 text-right font-medium">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-gray-500">
                      {t('admin.noOrdersFound')}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <Checkbox 
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => handleSelectOrder(order.id)}
                        />
                      </td>
                      <td className="py-4 px-2">
                        <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline font-medium">
                          #{order.id}
                        </Link>
                      </td>
                      <td className="py-4 px-2">
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-xs text-gray-500">{order.customer.email}</p>
                          <p className="text-xs text-gray-500">{order.customer.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div>
                          <p>{format(order.date, 'dd/MM/yyyy')}</p>
                          <p className="text-xs text-gray-500">{format(order.date, 'HH:mm')}</p>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex flex-col gap-1">
                          <PaymentMethodBadge method={order.paymentMethod} />
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right font-medium">
                        <div>
                          <p>{formatPrice(order.total)}</p>
                          <p className="text-xs text-gray-500">{order.items} items</p>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/orders/${order.id}`} className="cursor-pointer">
                                  <Eye size={14} className="mr-2" />
                                  {t('admin.viewOrder')}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <FileText size={14} className="mr-2" />
                                {t('admin.invoice')}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Printer size={14} className="mr-2" />
                                {t('admin.printOrder')}
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                {t('admin.showing')} 1-{filteredOrders.length} {t('admin.of')} {filteredOrders.length} {t('admin.orders')}
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>
                  {t('admin.previous')}
                </Button>
                <Button variant="outline" size="sm" disabled>
                  {t('admin.next')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default OrderList;