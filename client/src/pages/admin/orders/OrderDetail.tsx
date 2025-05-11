import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Phone,
  Printer,
  RefreshCw,
  Send,
  Truck,
  User,
  ChevronLeft,
  Check,
  X
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Spinner from '@/components/ui/spinner';

// Types
interface Customer {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
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
  shippingFee: number;
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

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Get status text and color
const getOrderStatusInfo = (status: string) => {
  const statuses: Record<string, { label: string, className: string }> = {
    'pending': { label: 'Chờ xử lý', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    'processing': { label: 'Đang xử lý', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    'shipping': { label: 'Đang giao', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    'delivered': { label: 'Đã giao', className: 'bg-green-50 text-green-700 border-green-200' },
    'cancelled': { label: 'Đã hủy', className: 'bg-red-50 text-red-700 border-red-200' },
  };

  return statuses[status] || { label: status, className: '' };
};

// Get payment method info
const getPaymentMethodInfo = (method: string) => {
  const methods: Record<string, { label: string }> = {
    'cod': { label: 'Thanh toán khi nhận hàng (COD)' },
    'bank-transfer': { label: 'Chuyển khoản ngân hàng' },
    'momo': { label: 'Ví MoMo' },
    'vnpay': { label: 'VNPay' },
    'credit-card': { label: 'Thẻ tín dụng' },
  };

  return methods[method] || { label: method };
};

// Get payment status info
const getPaymentStatusInfo = (status: string) => {
  const statuses: Record<string, { label: string, className: string }> = {
    'paid': { label: 'Đã thanh toán', className: 'bg-green-50 text-green-700 border-green-200' },
    'pending': { label: 'Chờ thanh toán', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    'refunded': { label: 'Đã hoàn tiền', className: 'bg-purple-50 text-purple-700 border-purple-200' },
    'failed': { label: 'Thất bại', className: 'bg-red-50 text-red-700 border-red-200' },
  };

  return statuses[status] || { label: status, className: '' };
};

const OrderDetail = () => {
  const { t } = useLanguage();
  const [, params] = useRoute('/admin/orders/:id');
  const orderId = params?.id ? parseInt(params.id) : 0;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  // Fetch order details
  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/admin/orders/${orderId}`);
      setOrder(response.data);
      setSelectedStatus(response.data.status);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại.');
      toast.error('Không thể tải thông tin đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Update order status
  const updateOrderStatus = async () => {
    if (!order || order.status === selectedStatus) return;
    
    setUpdatingStatus(true);
    
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: selectedStatus });
      
      // Refresh order details
      fetchOrderDetails();
      toast.success('Cập nhật trạng thái đơn hàng thành công');
      setStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Không thể cập nhật trạng thái đơn hàng');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Print invoice
  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-xl font-semibold text-red-500 mb-4">{error || 'Đơn hàng không tồn tại'}</h2>
          <Button onClick={fetchOrderDetails}>Thử lại</Button>
          <Link href="/admin/orders">
            <Button variant="outline" className="mt-2">Quay lại danh sách đơn hàng</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const orderStatusInfo = getOrderStatusInfo(order.status);
  const paymentMethodInfo = getPaymentMethodInfo(order.paymentMethod);
  const paymentStatusInfo = getPaymentStatusInfo(order.paymentStatus);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
              <p className="text-gray-500">
                Đặt ngày {formatDate(order.createdAt)} lúc {formatTime(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchOrderDetails}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tải lại
            </Button>
            <Button variant="outline" onClick={printInvoice}>
              <Printer className="h-4 w-4 mr-2" />
              In hóa đơn
            </Button>
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Package className="h-4 w-4 mr-2" />
                  Cập nhật trạng thái
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                  <DialogDescription>
                    Cập nhật trạng thái đơn hàng #{order.id}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="processing">Đang xử lý</SelectItem>
                      <SelectItem value="shipping">Đang giao</SelectItem>
                      <SelectItem value="delivered">Đã giao</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedStatus === 'cancelled' && (
                    <p className="text-sm text-red-500 mt-2">
                      Lưu ý: Hủy đơn hàng sẽ hoàn lại số lượng sản phẩm vào kho.
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    onClick={updateOrderStatus} 
                    disabled={updatingStatus || order.status === selectedStatus}
                  >
                    {updatingStatus && <Spinner className="mr-2" size="sm" />}
                    Cập nhật
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Order Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Thông tin đơn hàng</CardTitle>
                  <Badge className={orderStatusInfo.className}>
                    {orderStatusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order items */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">Giá</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {item.product.image && (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="w-12 h-12 object-cover rounded mr-3"
                                />
                              )}
                              <div>
                                <Link href={`/admin/products/${item.productId}/edit`}>
                                  <span className="font-medium hover:text-primary">{item.product.name}</span>
                                </Link>
                                <p className="text-sm text-gray-500">SKU: P{item.productId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right font-medium">{formatPrice(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Order summary */}
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tạm tính:</span>
                      <span>{formatPrice(order.totalAmount - (order.shippingFee || 0))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phí vận chuyển:</span>
                      <span>{formatPrice(order.shippingFee || 0)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Tổng cộng:</span>
                      <span className="text-lg">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer and Shipping Info */}
          <div className="space-y-5">
            {/* Customer Info */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Thông tin khách hàng</CardTitle>
                  {order.user && (
                    <Link href={`/admin/customers/${order.user.id}`}>
                      <Button variant="outline" size="sm">Xem hồ sơ</Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div className="grid gap-1">
                    <p className="font-medium">{order.shippingName}</p>
                    {order.user && (
                      <p className="text-sm text-gray-500">
                        {order.user.username ? `@${order.user.username}` : 'Tài khoản khách'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div className="grid gap-1">
                    <p className="font-medium">{order.shippingPhone}</p>
                    <p className="text-sm text-gray-500">Điện thoại liên hệ</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div className="grid gap-1">
                    <p className="font-medium">{order.shippingAddress}</p>
                    <p className="text-sm text-gray-500">
                      {order.shippingCity}, {order.shippingProvince}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Thông tin thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div className="grid gap-1">
                    <p className="font-medium">{paymentMethodInfo.label}</p>
                    <Badge className={paymentStatusInfo.className}>
                      {paymentStatusInfo.label}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div className="grid gap-1">
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                    <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div className="grid gap-1">
                    <p className="font-medium">{formatTime(order.createdAt)}</p>
                    <p className="text-sm text-gray-500">Thời gian đặt hàng</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Ghi chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Order Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử đơn hàng</CardTitle>
            <CardDescription>Các thay đổi và cập nhật của đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative ml-3 space-y-6 before:absolute before:inset-0 before:left-3 before:ml-0.5 before:border-l-2 before:border-gray-200">
              <div className="relative flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Check className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">Đơn hàng đã được tạo</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)} lúc {formatTime(order.createdAt)}
                  </p>
                </div>
              </div>
              {order.status === 'cancelled' && (
                <div className="relative flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <X className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">Đơn hàng đã bị hủy</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.updatedAt)} lúc {formatTime(order.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
              {order.status === 'processing' && (
                <div className="relative flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">Đơn hàng đang được xử lý</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.updatedAt)} lúc {formatTime(order.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
              {order.status === 'shipping' && (
                <div className="relative flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">Đơn hàng đang được giao</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.updatedAt)} lúc {formatTime(order.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
              {order.status === 'delivered' && (
                <div className="relative flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">Đơn hàng đã được giao thành công</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.updatedAt)} lúc {formatTime(order.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail; 