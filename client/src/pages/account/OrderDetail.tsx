import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet";
import { useRoute, Link } from "wouter";
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
  shippingAddress?: string;
  shippingCity?: string;
  shippingProvince?: string;
  shippingPostalCode?: string;
  shippingPhone?: string;
  shippingName?: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentIntentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const OrderDetail = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [match, params] = useRoute("/account/orders/:id");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        const response = await apiRequest("GET", `/api/orders/${params.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          const error = await response.json();
          toast({
            title: "Lỗi",
            description: error.message || "Không thể tải thông tin đơn hàng",
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

    fetchOrderDetails();
  }, [params?.id, toast]);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>{t("order-details")} #{params?.id} - Yapee</title>
        <meta name="description" content={t("order-details-description")} />
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
                <BreadcrumbLink href="/account/orders">{t("my-orders")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{t("order")} #{params?.id}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
            </div>
          ) : order ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t("order")} #{order.id}</CardTitle>
                    <CardDescription>
                      {t("placed-on")} {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-3">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-lg mb-2">{t("shipping-info")}</h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">{t("name")}:</span> {order.shippingName}
                        </p>
                        <p>
                          <span className="font-medium">{t("phone")}:</span> {order.shippingPhone}
                        </p>
                        <p>
                          <span className="font-medium">{t("address")}:</span> {order.shippingAddress}
                        </p>
                        {order.shippingCity && (
                          <p>
                            <span className="font-medium">{t("city")}:</span> {order.shippingCity}
                          </p>
                        )}
                        {order.shippingProvince && (
                          <p>
                            <span className="font-medium">{t("province")}:</span> {order.shippingProvince}
                          </p>
                        )}
                        {order.shippingPostalCode && (
                          <p>
                            <span className="font-medium">{t("postal-code")}:</span> {order.shippingPostalCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-2">{t("payment-info")}</h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">{t("payment-method")}:</span> {getPaymentMethodText(order.paymentMethod)}
                        </p>
                        <p>
                          <span className="font-medium">{t("payment-status")}:</span> {getPaymentStatusText(order.paymentStatus)}
                        </p>
                        {order.paymentIntentId && (
                          <p>
                            <span className="font-medium">{t("transaction-id")}:</span> {order.paymentIntentId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg mb-2">{t("order-items")}</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">{t("product")}</TableHead>
                          <TableHead>{t("name")}</TableHead>
                          <TableHead className="text-right">{t("price")}</TableHead>
                          <TableHead className="text-right">{t("quantity")}</TableHead>
                          <TableHead className="text-right">{t("total")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">No image</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Link href={`/product/${item.productId}`} className="hover:underline">
                                {item.name}
                              </Link>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {order.notes && (
                    <div>
                      <h3 className="font-medium text-lg mb-2">{t("order-notes")}</h3>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <div>
                    <Link href="/account/orders">
                      <Button variant="outline">{t("back-to-orders")}</Button>
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className="mb-1">
                      <span className="font-medium">{t("total")}:</span>{" "}
                      <span className="font-bold text-lg">{formatCurrency(order.totalAmount)}</span>
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{t("order-not-found")}</CardTitle>
                  <CardDescription>
                    {t("order-not-found-description")}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href="/account/orders">
                    <Button variant="outline">{t("back-to-orders")}</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrderDetail; 