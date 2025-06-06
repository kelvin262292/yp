import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Kiểm tra khóa API Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Thiếu khóa API VITE_STRIPE_PUBLIC_KEY cho Stripe');
}

// Khởi tạo Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Form thanh toán
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      toast({
        title: "Lỗi thanh toán",
        description: "Không thể kết nối với cổng thanh toán. Vui lòng thử lại sau.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Đang xử lý thanh toán...");
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });
      
      if (error) {
        console.error("Lỗi thanh toán:", error);
        toast({
          title: "Lỗi thanh toán",
          description: error.message || "Đã xảy ra lỗi trong quá trình thanh toán",
          variant: "destructive"
        });
      } else {
        console.log("Đã xử lý thanh toán thành công, đang chuyển hướng...");
      }
    } catch (err: any) {
      console.error("Lỗi không xác định:", err);
      toast({
        title: "Lỗi xử lý",
        description: err.message || "Đã xảy ra lỗi không xác định",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-6" />
      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            Đang xử lý...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Hoàn tất thanh toán
          </div>
        )}
      </Button>
      
      {/* Thông tin bảo mật */}
      <div className="mt-6 text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          Thanh toán an toàn qua Stripe
        </div>
        <p>Thông tin thẻ của bạn được mã hóa và bảo mật tuyệt đối.</p>
      </div>
    </form>
  );
};

// Trang thanh toán
const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const { cartItems } = useCart();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Tính tổng tiền giỏ hàng
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      // Sử dụng giá có chiết khấu nếu có, nếu không thì dùng giá gốc
      const price = item.product.discountPercentage && item.product.originalPrice 
        ? item.product.price // Đã là giá giảm
        : item.product.price; // Giá thường
      return sum + price * item.quantity;
    }, 0);
  };
  
  const orderTotal = calculateTotal();
  const shippingFee = 30000; // Phí vận chuyển
  const grandTotal = orderTotal + shippingFee;
  
  useEffect(() => {
    // Khởi tạo PaymentIntent khi trang được tải
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-payment-intent', { 
          amount: grandTotal 
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast({
          title: "Lỗi kết nối",
          description: "Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      }
    };
    
    createPaymentIntent();
  }, [grandTotal, toast]);
  
  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
        </div>
        <Footer />
      </div>
    );
  }
  
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#059669',
      },
    },
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Thanh toán | Yapee</title>
      </Helmet>
      
      <Header />
      
      <div className="container max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Thanh toán đơn hàng</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Thông tin thanh toán</CardTitle>
                <CardDescription>Vui lòng nhập thông tin thẻ để hoàn tất thanh toán</CardDescription>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm />
                </Elements>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Tổng đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(grandTotal)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <div className="text-sm text-gray-500">
                  * Vui lòng kiểm tra kỹ thông tin trước khi thanh toán
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;