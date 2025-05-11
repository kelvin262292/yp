import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Package } from "lucide-react";

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const SuccessPage = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [match, params] = useRoute("/checkout/success/:id");
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

  return (
    <>
      <Helmet>
        <title>{t("order-success")} - Yapee</title>
        <meta name="description" content={t("order-success-description")} />
      </Helmet>

      <div className="bg-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
              </div>
            ) : order ? (
              <Card className="shadow-lg">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">{t("order-success-title")}</CardTitle>
                  <CardDescription>
                    {t("order-success-message")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t("order-id")}:</span>
                      <span>#{order.id}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t("date")}:</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t("payment-method")}:</span>
                      <span>
                        {order.paymentMethod === "stripe" 
                          ? "Stripe" 
                          : t("cash-on-delivery")}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t("payment-status")}:</span>
                      <span>
                        {order.paymentStatus === "completed"
                          ? t("payment-completed")
                          : order.paymentStatus === "pending"
                          ? t("payment-pending")
                          : t("payment-failed")}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t mt-2">
                      <span>{t("total")}:</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-gray-600 flex items-center justify-center">
                      <Package className="mr-2 h-5 w-5" />
                      {t("order-confirmation-sent")}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Link href={`/account/orders/${order.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      {t("view-order-details")}
                    </Button>
                  </Link>
                  <Link href="/" className="w-full">
                    <Button className="w-full">
                      {t("continue-shopping")}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{t("order-not-found")}</CardTitle>
                  <CardDescription>
                    {t("order-not-found-description")}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href="/">
                    <Button>{t("go-to-homepage")}</Button>
                  </Link>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage; 