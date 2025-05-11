import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/common/ProtectedRoute";

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  name: string;
  imageUrl?: string;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

const Orders = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", "/api/orders");
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          const error = await response.json();
          toast({
            title: "Lỗi",
            description: error.message || "Không thể tải danh sách đơn hàng",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Lỗi kết nối",
          description: "Đã xảy ra lỗi khi kết nối với máy chủ",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipping":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("order-status-pending");
      case "processing":
        return t("order-status-processing");
      case "shipping":
        return t("order-status-shipping");
      case "delivered":
        return t("order-status-delivered");
      case "cancelled":
        return t("order-status-cancelled");
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return t("payment-status-pending");
      case "completed":
        return t("payment-status-completed");
      case "failed":
        return t("payment-status-failed");
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "stripe":
        return "Stripe";
      case "cod":
        return t("payment-method-cod");
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const viewOrderDetails = (orderId: number) => {
    setLocation(`/account/orders/${orderId}`);
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>{t("my-orders")} - Yapee</title>
        <meta name="description" content={t("my-orders-description")} />
      </Helmet>

      <div className="bg-light py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/account">{t("account")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{t("my-orders")}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t("my-orders")}</CardTitle>
                <CardDescription>
                  {t("view-order-history")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableCaption>{t("order-table-caption")}</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("order-id")}</TableHead>
                          <TableHead>{t("date")}</TableHead>
                          <TableHead>{t("status")}</TableHead>
                          <TableHead>{t("payment")}</TableHead>
                          <TableHead className="text-right">{t("total")}</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs">{getPaymentMethodText(order.paymentMethod)}</span>
                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                  {getPaymentStatusText(order.paymentStatus)}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewOrderDetails(order.id)}
                              >
                                {t("view")}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">{t("no-orders-yet")}</p>
                    <Link href="/">
                      <Button>{t("continue-shopping")}</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/account">
                  <Button variant="outline">{t("back-to-account")}</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Orders; 