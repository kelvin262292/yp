import React from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  AlertTriangle,
  FileQuestion,
  Upload,
  Send
} from 'lucide-react';

const ReportPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <InfoPageLayout title={t("report-issue")}>
      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Báo cáo sự cố</h2>
          <p>Nếu bạn gặp bất kỳ vấn đề nào với sản phẩm, đơn hàng, thanh toán, vận chuyển hoặc trải nghiệm trên website của chúng tôi, vui lòng sử dụng biểu mẫu dưới đây để báo cáo. Chúng tôi sẽ tiếp nhận và xử lý phản hồi của bạn trong thời gian sớm nhất.</p>
        </div>
        
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-amber-800">Lưu ý quan trọng</h3>
              <p className="text-amber-700">Để chúng tôi có thể hỗ trợ bạn hiệu quả nhất, vui lòng cung cấp đầy đủ thông tin chi tiết về sự cố bạn đang gặp phải, bao gồm mã đơn hàng (nếu có), mô tả chi tiết vấn đề và hình ảnh/video minh chứng (nếu có).</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-700">Vấn đề về sản phẩm</h3>
            <p className="text-red-600">Sản phẩm bị lỗi, hư hỏng, không đúng mô tả, thiếu phụ kiện, v.v.</p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg text-center">
            <FileQuestion className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-yellow-700">Vấn đề về đơn hàng & thanh toán</h3>
            <p className="text-yellow-600">Đơn hàng bị hủy vô lý, thanh toán lỗi, trừ tiền sai, v.v.</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <AlertTriangle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-blue-700">Lỗi website & góp ý</h3>
            <p className="text-blue-600">Lỗi kỹ thuật, khó khăn khi sử dụng, góp ý cải thiện.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">Biểu mẫu báo cáo sự cố</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <Input
                  id="fullName"
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại của bạn"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="orderNumber" className="text-sm font-medium">
                  Mã đơn hàng (nếu có)
                </label>
                <Input
                  id="orderNumber"
                  placeholder="Nhập mã đơn hàng liên quan đến sự cố"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="issueType" className="text-sm font-medium">
                Loại sự cố <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại sự cố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Vấn đề về sản phẩm</SelectItem>
                  <SelectItem value="delivery">Vấn đề về giao hàng</SelectItem>
                  <SelectItem value="payment">Vấn đề về thanh toán</SelectItem>
                  <SelectItem value="refund">Vấn đề về hoàn tiền/đổi trả</SelectItem>
                  <SelectItem value="account">Vấn đề về tài khoản</SelectItem>
                  <SelectItem value="technical">Lỗi kỹ thuật trên website</SelectItem>
                  <SelectItem value="other">Vấn đề khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="issueSeverity" className="text-sm font-medium">
                Mức độ nghiêm trọng <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ nghiêm trọng của sự cố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Nghiêm trọng - Cần xử lý ngay</SelectItem>
                  <SelectItem value="high">Cao - Ảnh hưởng đáng kể</SelectItem>
                  <SelectItem value="medium">Trung bình - Có thể đợi</SelectItem>
                  <SelectItem value="low">Thấp - Góp ý cải thiện</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="issueDescription" className="text-sm font-medium">
                Mô tả chi tiết sự cố <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="issueDescription"
                placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải. Bao gồm: thời gian xảy ra sự cố, các bước dẫn đến sự cố, và bất kỳ thông tin liên quan nào khác."
                className="min-h-[150px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Đính kèm hình ảnh/video minh chứng (nếu có)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Kéo và thả file vào đây, hoặc click để chọn file</p>
                <p className="mt-1 text-xs text-gray-400">Hỗ trợ: JPG, PNG, GIF, PDF. Kích thước tối đa: 5MB</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Chọn file
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <Send size={18} />
              Gửi báo cáo
            </Button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quy trình xử lý báo cáo</h2>
          
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <div>
                <h3 className="font-medium">Tiếp nhận báo cáo</h3>
                <p className="text-gray-600">Chúng tôi sẽ xác nhận đã nhận được báo cáo của bạn qua email trong vòng 24 giờ.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <div>
                <h3 className="font-medium">Phân loại và đánh giá</h3>
                <p className="text-gray-600">Báo cáo của bạn sẽ được phân loại và gửi đến bộ phận phụ trách để đánh giá chi tiết.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <div>
                <h3 className="font-medium">Điều tra và xử lý</h3>
                <p className="text-gray-600">Chúng tôi sẽ điều tra vấn đề và thực hiện các biện pháp cần thiết để giải quyết.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">4</div>
              <div>
                <h3 className="font-medium">Phản hồi kết quả</h3>
                <p className="text-gray-600">Bạn sẽ nhận được phản hồi về kết quả xử lý và các bước tiếp theo (nếu có).</p>
              </div>
            </li>
          </ol>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">Bạn cần hỗ trợ khẩn cấp? Liên hệ với chúng tôi qua:</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="tel:0333938014" className="text-primary font-medium hover:underline">Hotline: 0333.938.014</a>
            <span className="hidden md:inline text-gray-400">|</span>
            <a href="mailto:cskh@yapee.vn" className="text-primary font-medium hover:underline">Email: cskh@yapee.vn</a>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default ReportPage;