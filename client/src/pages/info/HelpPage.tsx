import React from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'wouter';
import { 
  HelpCircle, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  UserCircle,
  Search,
  Package
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HelpPage: React.FC = () => {
  const { t } = useLanguage();
  
  const helpTopics = [
    {
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      title: "Đặt hàng",
      description: "Hướng dẫn tìm kiếm sản phẩm, thêm vào giỏ hàng và hoàn tất đơn hàng",
      link: "/faq#order"
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Thanh toán",
      description: "Thông tin về các phương thức thanh toán và quy trình thanh toán",
      link: "/faq#payment"
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Vận chuyển",
      description: "Thông tin về phí vận chuyển, thời gian giao hàng và theo dõi đơn hàng",
      link: "/faq#shipping"
    },
    {
      icon: <RotateCcw className="h-10 w-10 text-primary" />,
      title: "Đổi trả & Hoàn tiền",
      description: "Chính sách đổi trả và quy trình yêu cầu hoàn tiền",
      link: "/faq#return"
    },
    {
      icon: <UserCircle className="h-10 w-10 text-primary" />,
      title: "Tài khoản",
      description: "Hướng dẫn đăng ký, đăng nhập và quản lý tài khoản",
      link: "/faq#account"
    },
    {
      icon: <Package className="h-10 w-10 text-primary" />,
      title: "Sản phẩm & Khuyến mãi",
      description: "Thông tin về sản phẩm, chất lượng và cách sử dụng mã giảm giá",
      link: "/faq#product"
    }
  ];
  
  const popularQuestions = [
    {
      question: "Làm thế nào để đặt hàng trên Yapee?",
      link: "/faq"
    },
    {
      question: "Yapee chấp nhận những phương thức thanh toán nào?",
      link: "/faq"
    },
    {
      question: "Thời gian giao hàng dự kiến là bao lâu?",
      link: "/faq"
    },
    {
      question: "Làm cách nào để theo dõi đơn hàng?",
      link: "/faq"
    },
    {
      question: "Chính sách đổi trả hàng của Yapee như thế nào?",
      link: "/faq"
    }
  ];
  
  return (
    <InfoPageLayout title={t("help-center")}>
      <div className="space-y-8">
        <div className="relative">
          <div className="flex flex-col gap-4 items-center text-center max-w-3xl mx-auto mb-8">
            <HelpCircle className="h-16 w-16 text-primary" />
            <h2 className="text-2xl font-semibold">Chào mừng đến với Trung tâm Hỗ trợ Yapee</h2>
            <p className="text-gray-600">Chúng tôi luôn sẵn sàng hỗ trợ bạn với mọi thắc mắc về sản phẩm, đơn hàng, thanh toán và các vấn đề khác.</p>
          </div>
          
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm câu hỏi hoặc chủ đề..."
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-6">Chủ đề hỗ trợ phổ biến</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpTopics.map((topic, index) => (
              <Link key={index} href={topic.link}>
                <a className="flex flex-col border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow h-full">
                  <div className="mb-4">{topic.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                  <p className="text-gray-600 text-sm flex-grow">{topic.description}</p>
                  <div className="text-primary text-sm font-medium mt-4">Xem hướng dẫn</div>
                </a>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Câu hỏi thường gặp</h2>
          <ul className="space-y-2">
            {popularQuestions.map((item, index) => (
              <li key={index}>
                <Link href={item.link}>
                  <a className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors">
                    <span className="text-primary">•</span>
                    <span>{item.question}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-center">
            <Link href="/faq">
              <a className="text-primary font-medium hover:underline">Xem tất cả câu hỏi thường gặp</a>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Liên hệ hỗ trợ</h2>
            <p className="text-gray-600 mb-4">Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, hãy liên hệ với chúng tôi.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Hotline</p>
                  <p className="text-gray-600">0333.938.014 (8h00 - 19h00)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">cskh@yapee.vn</p>
                </div>
              </div>
            </div>
            
            <Link href="/contact">
              <a>
                <Button className="w-full mt-6">Liên hệ chúng tôi</Button>
              </a>
            </Link>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Báo cáo vấn đề</h2>
            <p className="text-gray-600 mb-4">Gặp sự cố với đơn hàng, sản phẩm hoặc website? Báo cáo với chúng tôi để được hỗ trợ ngay.</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <p className="text-gray-600">Vấn đề về sản phẩm (sai mô tả, hư hỏng, kém chất lượng)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <p className="text-gray-600">Sự cố thanh toán (giao dịch không thành công, trừ tiền sai)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <p className="text-gray-600">Vấn đề về giao nhận (giao hàng chậm, thất lạc, hư hỏng trong quá trình vận chuyển)</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <p className="text-gray-600">Lỗi kỹ thuật trên website/ứng dụng</p>
              </div>
            </div>
            
            <Link href="/report">
              <a>
                <Button variant="outline" className="w-full mt-6">Báo cáo sự cố</Button>
              </a>
            </Link>
          </div>
        </div>
        
        <div className="bg-primary/5 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=150&h=150" alt="Customer Support" className="rounded-full h-32 w-32 object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Hỗ trợ khách hàng là ưu tiên hàng đầu của chúng tôi</h2>
              <p className="text-gray-600 mb-4">Tại Yapee, chúng tôi cam kết mang đến trải nghiệm mua sắm trực tuyến tốt nhất cho khách hàng. Đội ngũ Chăm sóc Khách hàng chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ trợ bạn giải quyết mọi vấn đề một cách nhanh chóng và hiệu quả.</p>
              <p className="text-gray-600">Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ mỗi ngày. Chúng tôi rất trân trọng mọi góp ý và đánh giá từ bạn.</p>
            </div>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default HelpPage;