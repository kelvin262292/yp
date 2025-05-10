import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useStripe } from '@stripe/react-stripe-js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/context/LanguageContext';
import { 
  CheckCircle, ShoppingBag, FileText, 
  Printer, Clock, CreditCard, Package, Calendar 
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';

const PaymentStatusBadge = ({ status }: { status: string }) => {
  let badgeColor = "";
  let statusText = "";
  
  switch (status) {
    case 'succeeded':
      badgeColor = "bg-green-100 text-green-800";
      statusText = "Đã thanh toán";
      break;
    case 'processing':
      badgeColor = "bg-blue-100 text-blue-800";
      statusText = "Đang xử lý";
      break;
    case 'requires_payment_method':
      badgeColor = "bg-red-100 text-red-800";
      statusText = "Thanh toán thất bại";
      break;
    default:
      badgeColor = "bg-gray-100 text-gray-800";
      statusText = "Không xác định";
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
      {statusText}
    </span>
  );
};

const CheckoutSuccess = () => {
  const stripe = useStripe();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const { t } = useLanguage();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [orderId] = useState(`#YP-${Math.floor(100000 + Math.random() * 900000)}`);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!stripe) {
      return;
    }
    
    // Xử lý kết quả thanh toán từ URL query params
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    
    if (!clientSecret) {
      setIsLoading(false);
      return;
    }
    
    // Lấy chi tiết thanh toán và hiển thị kết quả
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      setPaymentStatus(paymentIntent?.status || null);
      
      switch (paymentIntent?.status) {
        case 'succeeded':
          toast({
            title: 'Thanh toán thành công!',
            description: 'Cảm ơn bạn đã mua hàng tại Yapee.',
          });
          // Xóa giỏ hàng sau khi thanh toán thành công
          clearCart();
          break;
        case 'processing':
          toast({
            title: 'Thanh toán đang được xử lý',
            description: 'Chúng tôi sẽ cập nhật trạng thái đơn hàng cho bạn ngay khi hoàn tất.',
          });
          break;
        case 'requires_payment_method':
          toast({
            title: 'Thanh toán thất bại',
            description: 'Vui lòng thử lại với một phương thức thanh toán khác.',
            variant: 'destructive',
          });
          break;
        default:
          toast({
            title: 'Có lỗi xảy ra',
            description: 'Vui lòng liên hệ bộ phận hỗ trợ khách hàng để được hỗ trợ.',
            variant: 'destructive',
          });
          break;
      }
      setIsLoading(false);
    }).catch(error => {
      console.error('Lỗi khi truy vấn thông tin thanh toán:', error);
      setIsLoading(false);
    });
  }, [stripe, toast, clearCart]);
  
  // Helper để định dạng ngày
  const formatDate = (date: Date): string => {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Mock data cho order summary
  const orderDate = new Date();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(orderDate.getDate() + 3);
  
  const handlePrint = () => {
    window.print();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Đặt hàng thành công | Yapee</title>
        <meta name="description" content="Đơn hàng của bạn đã được xác nhận và đang được xử lý." />
      </Helmet>
      
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-green-50 to-emerald-50">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">Đặt hàng thành công!</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-6 space-y-6 pt-8">
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <div className="text-sm text-gray-500 mb-1">Mã đơn hàng</div>
                <div className="text-xl font-bold">{orderId}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
                <Printer size={14} />
                In đơn hàng
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                  <CreditCard size={18} className="text-primary" />
                  Thông tin thanh toán
                </h3>
                <Separator className="my-3" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Trạng thái thanh toán</span>
                    <PaymentStatusBadge status={paymentStatus || 'unknown'} />
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Phương thức thanh toán</span>
                    <span className="font-medium">Thẻ tín dụng/Ghi nợ</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Thời gian thanh toán</span>
                    <span className="font-medium">{formatDate(orderDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                  <Package size={18} className="text-primary" />
                  Thông tin vận chuyển
                </h3>
                <Separator className="my-3" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Trạng thái đơn hàng</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Đang chuẩn bị
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Phương thức vận chuyển</span>
                    <span className="font-medium">Giao hàng nhanh</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Dự kiến giao hàng</span>
                    <span className="font-medium">{formatDate(estimatedDelivery)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-primary" />
                <h3 className="font-medium text-base">Theo dõi trạng thái đơn hàng</h3>
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="relative pl-10 pb-5">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100"></div>
                  <div className="font-medium">Đã xác nhận đơn hàng</div>
                  <div className="text-sm text-gray-500">{formatDate(orderDate)}</div>
                </div>
                
                <div className="relative pl-10 pb-5">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                  <div className="font-medium">Đang chuẩn bị hàng</div>
                  <div className="text-sm text-gray-500">Đơn hàng của bạn đang được chuẩn bị</div>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-gray-100"></div>
                  <div className="font-medium text-gray-500">Đang vận chuyển</div>
                  <div className="text-sm text-gray-500">Dự kiến: {formatDate(estimatedDelivery)}</div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-4 pb-8 bg-gray-50 border-t border-gray-100">
            <Link href="/account/orders">
              <Button variant="outline" className="w-full sm:w-auto gap-1">
                <FileText size={16} />
                Quản lý đơn hàng
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto gap-1">
                <ShoppingBag size={16} />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;