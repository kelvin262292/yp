import React from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { CheckCircle2, TrendingUp, Users, ShieldCheck, Clock, MoveRight } from 'lucide-react';

const SellerPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <InfoPageLayout title={t("seller-center")}>
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Bán hàng cùng Yapee</h2>
          <p>Mở rộng cơ hội kinh doanh và tiếp cận hàng triệu khách hàng tiềm năng trên khắp Việt Nam với nền tảng thương mại điện tử Yapee.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary/5 p-6 rounded-lg text-center">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tăng trưởng doanh số</h3>
            <p className="text-gray-600">Tiếp cận hàng triệu khách hàng tiềm năng trên toàn quốc</p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Phát triển thương hiệu</h3>
            <p className="text-gray-600">Xây dựng thương hiệu của bạn trên nền tảng thương mại điện tử hàng đầu</p>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg text-center">
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Hỗ trợ toàn diện</h3>
            <p className="text-gray-600">Nhận hỗ trợ về marketing, vận chuyển và quản lý đơn hàng</p>
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2>Tại sao chọn bán hàng trên Yapee?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mt-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tiếp cận khách hàng tiềm năng</h3>
                  <p className="text-gray-600">Yapee có hàng triệu người dùng hoạt động mỗi tháng, giúp bạn mở rộng phạm vi tiếp cận khách hàng toàn quốc.</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hỗ trợ marketing và quảng bá</h3>
                  <p className="text-gray-600">Chúng tôi hỗ trợ quảng bá sản phẩm của bạn thông qua các chiến dịch marketing, chương trình khuyến mãi và các tính năng nổi bật.</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quy trình đăng ký đơn giản</h3>
                  <p className="text-gray-600">Đăng ký trở thành người bán trên Yapee nhanh chóng và dễ dàng, chỉ trong vài bước đơn giản.</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hệ thống quản lý thông minh</h3>
                  <p className="text-gray-600">Công cụ quản lý gian hàng trực quan, dễ sử dụng giúp bạn theo dõi sản phẩm, đơn hàng và tồn kho một cách hiệu quả.</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Chính sách thanh toán minh bạch</h3>
                  <p className="text-gray-600">Hệ thống thanh toán an toàn, minh bạch với lịch thanh toán rõ ràng và báo cáo chi tiết.</p>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hỗ trợ vận chuyển và xử lý đơn hàng</h3>
                  <p className="text-gray-600">Yapee hợp tác với nhiều đơn vị vận chuyển uy tín, giúp bạn giao hàng nhanh chóng và tiết kiệm chi phí.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-primary text-white rounded-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Quy trình đăng ký trở thành người bán</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">1</div>
                <h3 className="font-semibold mb-2">Đăng ký tài khoản</h3>
                <p className="text-white/80">Điền thông tin cơ bản để tạo tài khoản người bán</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">2</div>
                <h3 className="font-semibold mb-2">Xác thực thông tin</h3>
                <p className="text-white/80">Cung cấp giấy tờ pháp lý và thông tin doanh nghiệp</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">3</div>
                <h3 className="font-semibold mb-2">Thiết lập gian hàng</h3>
                <p className="text-white/80">Tạo gian hàng và đăng sản phẩm đầu tiên</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-white text-primary rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">4</div>
                <h3 className="font-semibold mb-2">Bắt đầu bán hàng</h3>
                <p className="text-white/80">Nhận đơn hàng đầu tiên và phát triển kinh doanh</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-medium flex items-center gap-2">
                Đăng ký ngay
                <MoveRight size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <h2>Chính sách dành cho người bán</h2>
          <p>Yapee cam kết tạo môi trường kinh doanh công bằng, minh bạch và hiệu quả cho tất cả người bán. Chúng tôi áp dụng các chính sách sau để đảm bảo trải nghiệm tốt nhất cho cả người bán và người mua:</p>
          
          <ul>
            <li><strong>Chính sách hoa hồng:</strong> Mức phí hoa hồng cạnh tranh, dao động từ 3% đến 10% tùy theo danh mục sản phẩm.</li>
            <li><strong>Chính sách thanh toán:</strong> Thanh toán định kỳ 2 lần/tháng, đảm bảo dòng tiền ổn định cho người bán.</li>
            <li><strong>Chính sách đổi trả:</strong> Quy trình đổi trả rõ ràng, bảo vệ quyền lợi của cả người bán và người mua.</li>
            <li><strong>Chính sách bảo vệ người bán:</strong> Hỗ trợ giải quyết tranh chấp và bảo vệ người bán trước các hành vi gian lận.</li>
            <li><strong>Chính sách quảng bá:</strong> Cơ hội tham gia các chương trình khuyến mãi và sự kiện lớn trên Yapee.</li>
          </ul>
          
          <p>Để biết thêm chi tiết về các chính sách, vui lòng liên hệ với bộ phận Hỗ trợ Người bán của chúng tôi.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 not-prose">
          <div className="bg-gray-50 p-6 rounded-lg md:w-1/2">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="text-primary" />
              Thời gian xử lý
            </h2>
            <p className="text-gray-600 mb-4">Thời gian xét duyệt hồ sơ đăng ký người bán thường mất 3-5 ngày làm việc. Sau khi được phê duyệt, bạn có thể bắt đầu thiết lập gian hàng và đăng sản phẩm ngay lập tức.</p>
            <p className="text-gray-600">Chúng tôi sẽ thông báo kết quả xét duyệt qua email và tin nhắn SMS.</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg md:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Liên hệ hỗ trợ người bán</h2>
            <p className="text-gray-600 mb-4">Nếu bạn có bất kỳ câu hỏi nào về việc trở thành người bán trên Yapee, vui lòng liên hệ với chúng tôi qua:</p>
            <ul className="space-y-2 text-gray-600">
              <li>Email: <a href="mailto:hotronguoiban@yapee.vn" className="text-primary hover:underline">hotronguoiban@yapee.vn</a></li>
              <li>Hotline dành cho người bán: <strong>0333.938.014</strong> (Ext: 2)</li>
              <li>Giờ làm việc: 8h00 - 19h00, từ Thứ Hai đến Chủ Nhật</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Sẵn sàng tăng trưởng cùng Yapee?</h2>
          <p className="text-lg text-gray-600 mb-6">Đăng ký trở thành người bán ngay hôm nay và mở rộng kinh doanh của bạn!</p>
          <Button size="lg" className="font-medium">Đăng ký làm người bán</Button>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default SellerPage;