import React from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';

const TermsPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <InfoPageLayout title={t("terms")}>
      <div className="prose prose-lg max-w-none">
        <p className="mb-6">Vui lòng đọc kỹ các Điều khoản sử dụng ("Điều khoản") dưới đây trước khi sử dụng website và dịch vụ của Yapee. Bằng việc sử dụng website và dịch vụ của chúng tôi, bạn đồng ý và chịu ràng buộc bởi các điều khoản này.</p>
        
        <h2>1. Chấp nhận điều khoản</h2>
        <p>Bằng việc truy cập và sử dụng website Yapee, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý chịu ràng buộc bởi các Điều khoản này. Nếu bạn không đồng ý với bất kỳ phần nào của các Điều khoản này, vui lòng không sử dụng website và dịch vụ của chúng tôi.</p>
        
        <h2>2. Tài khoản người dùng</h2>
        <p>Để sử dụng một số tính năng của website, bạn có thể cần phải tạo tài khoản người dùng. Khi tạo tài khoản, bạn đồng ý cung cấp thông tin chính xác, đầy đủ và cập nhật. Bạn chịu trách nhiệm bảo mật tài khoản của mình, bao gồm mật khẩu đăng nhập, và bạn đồng ý thông báo ngay cho chúng tôi nếu phát hiện bất kỳ hành vi sử dụng trái phép nào đối với tài khoản của bạn.</p>
        
        <h2>3. Quy định sử dụng hợp lệ</h2>
        <p>Bạn đồng ý sử dụng website và dịch vụ của chúng tôi chỉ cho các mục đích hợp pháp và theo cách thức không vi phạm quyền của bất kỳ bên thứ ba nào, không cản trở hoặc phá vỡ hoạt động của website và dịch vụ. Việc sử dụng website và dịch vụ của chúng tôi cho các hoạt động bất hợp pháp hoặc trái với các Điều khoản này là nghiêm cấm.</p>
        
        <h2>4. Quy trình đặt hàng và xác lập hợp đồng</h2>
        <p>Khi bạn đặt hàng trên website của chúng tôi, bạn đưa ra đề nghị mua hàng hóa theo giá và điều kiện được nêu tại thời điểm đặt hàng. Chúng tôi sẽ gửi email xác nhận đơn hàng để xác nhận rằng chúng tôi đã nhận được đề nghị mua hàng của bạn. Hợp đồng mua bán giữa bạn và chúng tôi chỉ được xác lập khi chúng tôi gửi email xác nhận việc chấp nhận đơn hàng và/hoặc xuất hóa đơn cho bạn.</p>
        
        <h2>5. Giá cả và thanh toán</h2>
        <p>Tất cả giá cả được hiển thị trên website của chúng tôi là bằng Việt Nam Đồng (VND) và đã bao gồm thuế giá trị gia tăng (VAT) theo quy định của pháp luật Việt Nam. Chúng tôi cố gắng đảm bảo rằng tất cả thông tin và giá cả hiển thị là chính xác, tuy nhiên, có thể có những sai sót xảy ra. Nếu chúng tôi phát hiện lỗi trong giá của sản phẩm bạn đã đặt, chúng tôi sẽ thông báo cho bạn và cho bạn lựa chọn xác nhận lại đơn hàng với giá đúng hoặc hủy đơn hàng.</p>
        
        <h2>6. Vận chuyển và giao nhận</h2>
        <p>Chúng tôi sẽ giao hàng đến địa chỉ được chỉ định trong đơn đặt hàng của bạn. Thời gian giao hàng ước tính được cung cấp trong quá trình đặt hàng, tuy nhiên, đây chỉ là thời gian dự kiến và có thể bị ảnh hưởng bởi các yếu tố ngoài tầm kiểm soát của chúng tôi. Chúng tôi không chịu trách nhiệm về bất kỳ sự chậm trễ nào do các yếu tố bên ngoài gây ra.</p>
        
        <h2>7. Chính sách đổi trả và hoàn tiền</h2>
        <p>Chúng tôi mong muốn bạn hoàn toàn hài lòng với giao dịch mua hàng của mình. Nếu bạn không hài lòng với sản phẩm vì bất kỳ lý do gì, bạn có thể trả lại sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên vẹn, chưa qua sử dụng và còn đầy đủ bao bì, nhãn mác ban đầu. Chi tiết về quy trình đổi trả và hoàn tiền có thể được tìm thấy trong Chính sách Đổi Trả và Hoàn Tiền trên website của chúng tôi.</p>
        
        <h2>8. Quyền sở hữu trí tuệ</h2>
        <p>Tất cả nội dung trên website của chúng tôi, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, đồ họa, logo, biểu tượng, âm thanh, video, phần mềm và các tài liệu khác, đều là tài sản của chúng tôi hoặc các nhà cung cấp nội dung của chúng tôi và được bảo vệ bởi luật pháp Việt Nam và quốc tế về quyền sở hữu trí tuệ. Bạn không được sao chép, sửa đổi, phân phối, xuất bản, truyền tải, hiển thị công khai, thực hiện, tái sản xuất, cấp phép, tạo ra các tác phẩm phái sinh, chuyển nhượng hoặc bán bất kỳ nội dung nào từ website của chúng tôi mà không có sự cho phép trước bằng văn bản của chúng tôi.</p>
        
        <h2>9. Miễn trừ và giới hạn trách nhiệm</h2>
        <p>Trong phạm vi tối đa được pháp luật cho phép, chúng tôi không chịu trách nhiệm đối với bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc mang tính trừng phạt nào phát sinh từ hoặc liên quan đến việc sử dụng hoặc không thể sử dụng website và dịch vụ của chúng tôi, ngay cả khi chúng tôi đã được thông báo về khả năng xảy ra những thiệt hại đó.</p>
        
        <h2>10. Giải quyết tranh chấp và luật điều chỉnh</h2>
        <p>Các Điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. Bất kỳ tranh chấp nào phát sinh từ hoặc liên quan đến các Điều khoản này sẽ được giải quyết thông qua thương lượng thiện chí giữa các bên. Nếu không thể giải quyết được thông qua thương lượng, tranh chấp sẽ được đưa ra giải quyết tại tòa án có thẩm quyền của Việt Nam.</p>
        
        <h2>11. Thay đổi điều khoản</h2>
        <p>Chúng tôi có quyền sửa đổi, cập nhật hoặc thay đổi các Điều khoản này vào bất kỳ thời điểm nào mà không cần thông báo trước. Việc bạn tiếp tục sử dụng website và dịch vụ của chúng tôi sau khi những thay đổi này được đăng tải sẽ được xem là sự chấp nhận của bạn đối với những thay đổi đó.</p>
        
        <h2>12. Liên hệ</h2>
        <p>Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi qua:</p>
        <p>Email: <a href="mailto:cskh@yapee.vn" className="text-primary hover:underline">cskh@yapee.vn</a></p>
        <p>Hotline: <strong>0333.938.014</strong></p>
        <p>Địa chỉ: 74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, Thành phố Hồ Chí Minh</p>
        
        <p className="mt-8 text-sm text-gray-500">Cập nhật lần cuối: Ngày 10 tháng 05 năm 2023</p>
      </div>
    </InfoPageLayout>
  );
};

export default TermsPage;