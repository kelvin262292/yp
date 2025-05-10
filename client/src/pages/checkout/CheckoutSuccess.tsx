import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { useStripe } from '@stripe/react-stripe-js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const CheckoutSuccess = () => {
  const stripe = useStripe();
  const { toast } = useToast();
  const { clearCart } = useCart();
  
  useEffect(() => {
    if (!stripe) {
      return;
    }
    
    // Xử lý kết quả thanh toán từ URL query params
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    
    if (!clientSecret) {
      return;
    }
    
    // Lấy chi tiết thanh toán và hiển thị kết quả
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
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
    });
  }, [stripe, toast, clearCart]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Đặt hàng thành công | Yapee</title>
      </Helmet>
      
      <Header />
      
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="text-center pb-10">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-3xl">Đặt hàng thành công!</CardTitle>
          </CardHeader>
          
          <CardContent className="pb-6 space-y-4">
            <div className="text-center text-gray-600 max-w-md mx-auto">
              <p className="mb-2">Cảm ơn bạn đã mua sắm tại Yapee. Chúng tôi đã nhận được đơn hàng và đang xử lý.</p>
              <p>Bạn sẽ nhận được email xác nhận đơn hàng trong thời gian sớm nhất.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <div className="text-sm text-gray-500 mb-2">Mã đơn hàng</div>
              <div className="text-xl font-bold">#YP-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-3">Thông tin đơn hàng</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Trạng thái thanh toán</span>
                  <span className="font-medium text-green-600">Đã thanh toán</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Phương thức thanh toán</span>
                  <span className="font-medium">Thẻ tín dụng/Ghi nợ</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Trạng thái đơn hàng</span>
                  <span className="font-medium">Đang xử lý</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Thời gian đặt hàng</span>
                  <span className="font-medium">{new Date().toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4 pt-4 pb-6">
            <Link href="/account">
              <Button variant="outline">Xem chi tiết đơn hàng</Button>
            </Link>
            <Link href="/">
              <Button className="gap-1">
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