import React from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { CheckCircle2, XCircle, AlertTriangle, Clock, ArrowLeftRight, RefreshCcw } from 'lucide-react';

const ReturnPolicyPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <InfoPageLayout title={t("return-policy")}>
      <div className="prose prose-lg max-w-none">
        <p className="lead">Chính sách đổi trả và hoàn tiền của Yapee được quy định chi tiết dưới đây để đảm bảo quyền lợi tốt nhất cho khách hàng. Vui lòng đọc kỹ các điều khoản này trước khi thực hiện yêu cầu đổi trả.</p>
        
        <h2>1. Điều kiện đổi trả</h2>
        
        <div className="not-prose bg-green-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="text-green-600" />
            Các trường hợp được chấp nhận đổi trả
          </h3>
          <ul className="space-y-2 text-green-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Sản phẩm bị lỗi do nhà sản xuất (lỗi kỹ thuật, hỏng hóc không do người dùng gây ra).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Sản phẩm không đúng với mô tả hoặc hình ảnh trên website.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Sản phẩm không đúng với đơn đặt hàng của bạn (sai màu sắc, kích thước, mẫu mã).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Sản phẩm còn nguyên vẹn, chưa qua sử dụng, còn đầy đủ bao bì, nhãn mác ban đầu.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">•</span>
              <span>Sản phẩm bị hư hỏng trong quá trình vận chuyển.</span>
            </li>
          </ul>
        </div>
        
        <div className="not-prose bg-red-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
            <XCircle className="text-red-600" />
            Các trường hợp không được chấp nhận đổi trả
          </h3>
          <ul className="space-y-2 text-red-700">
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-1">•</span>
              <span>Sản phẩm đã qua sử dụng, có dấu hiệu hư hỏng do người dùng.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-1">•</span>
              <span>Sản phẩm không còn nguyên vẹn bao bì, tem nhãn, seal, phụ kiện đi kèm.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-1">•</span>
              <span>Đồ lót, đồ bơi, sản phẩm tiêu dùng cá nhân vì lý do vệ sinh.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-1">•</span>
              <span>Sản phẩm số như thẻ cào, mã kích hoạt, thẻ quà tặng đã được mở hoặc sử dụng.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-1">•</span>
              <span>Sản phẩm được đặt riêng theo yêu cầu của khách hàng (hàng đặt may theo số đo, khắc tên, v.v.).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-1">•</span>
              <span>Sản phẩm đã hết thời hạn đổi trả (quá 7 ngày kể từ ngày nhận hàng).</span>
            </li>
          </ul>
        </div>
        
        <div className="not-prose bg-yellow-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="text-yellow-600" />
            Lưu ý đặc biệt cho một số danh mục sản phẩm
          </h3>
          <ul className="space-y-2 text-yellow-700">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span><strong>Mỹ phẩm:</strong> Chỉ được đổi trả nếu sản phẩm còn nguyên seal, chưa mở nắp.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span><strong>Thực phẩm:</strong> Thực phẩm tươi sống hoặc có thời hạn sử dụng ngắn thường không được đổi trả, trừ trường hợp sản phẩm bị hỏng trước hạn sử dụng.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span><strong>Thiết bị điện tử:</strong> Cần giữ nguyên hộp, phụ kiện, tem bảo hành và không có dấu hiệu đã qua sử dụng.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span><strong>Quần áo, giày dép:</strong> Không có dấu hiệu đã mặc/đi, còn nguyên tag và nhãn mác.</span>
            </li>
          </ul>
        </div>
        
        <h2>2. Thời hạn đổi trả</h2>
        <div className="not-prose flex items-start gap-4 mb-6">
          <Clock className="text-primary flex-shrink-0 mt-1" size={24} />
          <div>
            <p className="text-lg font-medium">Trong vòng 7 ngày kể từ ngày nhận hàng</p>
            <p className="text-gray-600">Yapee chấp nhận yêu cầu đổi trả trong vòng 7 ngày kể từ ngày bạn nhận được sản phẩm. Đối với các sản phẩm có bảo hành của nhà sản xuất, thời hạn bảo hành sẽ theo quy định của nhà sản xuất.</p>
          </div>
        </div>
        
        <h2>3. Quy trình đổi trả</h2>
        <ol className="not-prose space-y-4 mb-6">
          <li className="flex items-start gap-3">
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</div>
            <div>
              <h3 className="font-medium">Tạo yêu cầu đổi trả</h3>
              <p className="text-gray-600">Đăng nhập vào tài khoản Yapee, đi đến mục "Đơn hàng của tôi", chọn đơn hàng có sản phẩm cần đổi trả và nhấp vào "Yêu cầu đổi trả". Điền đầy đủ thông tin vào biểu mẫu, nêu rõ lý do đổi trả và tải lên hình ảnh minh chứng (nếu có).</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</div>
            <div>
              <h3 className="font-medium">Chờ xác nhận từ Yapee</h3>
              <p className="text-gray-600">Bộ phận Chăm sóc Khách hàng sẽ xem xét yêu cầu của bạn và phản hồi trong vòng 24-48 giờ làm việc. Nếu yêu cầu được chấp thuận, chúng tôi sẽ gửi email xác nhận kèm theo hướng dẫn đóng gói và gửi trả sản phẩm.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</div>
            <div>
              <h3 className="font-medium">Đóng gói và gửi trả sản phẩm</h3>
              <p className="text-gray-600">Đóng gói sản phẩm cẩn thận cùng với hóa đơn mua hàng và phụ kiện đi kèm (nếu có). Gửi trả sản phẩm theo hướng dẫn trong email xác nhận. Bạn có thể chọn gửi qua đơn vị vận chuyển được chỉ định hoặc đợi nhân viên đến lấy hàng (tùy trường hợp).</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">4</div>
            <div>
              <h3 className="font-medium">Kiểm tra và xử lý</h3>
              <p className="text-gray-600">Sau khi nhận được sản phẩm trả lại, Yapee sẽ tiến hành kiểm tra. Quá trình này thường mất 1-3 ngày làm việc. Nếu sản phẩm đáp ứng các điều kiện đổi trả, chúng tôi sẽ tiến hành đổi sản phẩm mới hoặc hoàn tiền theo yêu cầu của bạn.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">5</div>
            <div>
              <h3 className="font-medium">Nhận sản phẩm thay thế hoặc hoàn tiền</h3>
              <p className="text-gray-600">Nếu bạn chọn đổi sản phẩm, chúng tôi sẽ gửi sản phẩm thay thế trong thời gian sớm nhất. Nếu bạn chọn hoàn tiền, số tiền sẽ được hoàn trả theo phương thức thanh toán ban đầu của bạn.</p>
            </div>
          </li>
        </ol>
        
        <h2>4. Chi phí đổi trả</h2>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <ArrowLeftRight className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Trường hợp lỗi từ Yapee hoặc nhà sản xuất</h3>
              </div>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Yapee sẽ chịu toàn bộ chi phí vận chuyển cho việc đổi trả.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Khách hàng sẽ được đổi sản phẩm mới hoặc hoàn tiền 100% giá trị sản phẩm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Áp dụng cho các trường hợp: sản phẩm bị lỗi do nhà sản xuất, sản phẩm không đúng mô tả, sản phẩm bị hư hỏng trong quá trình vận chuyển, sai sản phẩm.</span>
              </li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <RefreshCcw className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Trường hợp do yêu cầu của khách hàng</h3>
              </div>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Khách hàng sẽ chịu chi phí vận chuyển cho việc gửi trả sản phẩm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Yapee sẽ chịu chi phí vận chuyển sản phẩm mới đến khách hàng (nếu đổi sản phẩm).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Áp dụng cho các trường hợp: khách hàng đổi ý, chọn sai kích cỡ, không thích màu sắc, v.v.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <h2>5. Chính sách hoàn tiền</h2>
        <p>Thời gian hoàn tiền phụ thuộc vào phương thức thanh toán ban đầu của bạn:</p>
        <div className="not-prose space-y-4 mb-6">
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-medium">Thẻ tín dụng/ghi nợ</h3>
            <p className="text-gray-600">Thời gian hoàn tiền thường mất 7-14 ngày làm việc, tùy thuộc vào chính sách của ngân hàng phát hành thẻ.</p>
          </div>
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-medium">Ví điện tử (MoMo, ZaloPay, VNPay)</h3>
            <p className="text-gray-600">Thời gian hoàn tiền thường là 3-5 ngày làm việc.</p>
          </div>
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-medium">Chuyển khoản ngân hàng</h3>
            <p className="text-gray-600">Thời gian hoàn tiền thường là 5-10 ngày làm việc.</p>
          </div>
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-medium">Thanh toán khi nhận hàng (COD)</h3>
            <p className="text-gray-600">Hoàn tiền qua chuyển khoản ngân hàng, thường mất 5-7 ngày làm việc sau khi xác nhận thông tin tài khoản.</p>
          </div>
        </div>
        
        <h2>6. Liên hệ</h2>
        <p>Nếu bạn có bất kỳ câu hỏi nào về Chính sách Đổi trả và Hoàn tiền của chúng tôi, vui lòng liên hệ:</p>
        <ul>
          <li>Email: <a href="mailto:cskh@yapee.vn" className="text-primary hover:underline">cskh@yapee.vn</a></li>
          <li>Hotline: <strong>0333.938.014</strong> (8h00 - 19h00, từ Thứ Hai đến Chủ Nhật)</li>
          <li>Văn phòng: 74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, Thành phố Hồ Chí Minh</li>
        </ul>
        
        <p className="mt-8 text-sm text-gray-500">Cập nhật lần cuối: Ngày 10 tháng 05 năm 2023</p>
      </div>
    </InfoPageLayout>
  );
};

export default ReturnPolicyPage;