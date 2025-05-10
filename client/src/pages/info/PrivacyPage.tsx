import React from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';

const PrivacyPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <InfoPageLayout title={t("privacy")}>
      <div className="prose prose-lg max-w-none">
        <p className="mb-6">Yapee cam kết tôn trọng và bảo vệ quyền riêng tư cũng như dữ liệu cá nhân của Quý khách hàng. Chính sách này mô tả cách thức thu thập, sử dụng, lưu trữ, chia sẻ và bảo vệ thông tin cá nhân, tuân thủ Nghị định số 13/2023/NĐ-CP và Nghị định số 52/2013/NĐ-CP.</p>
        
        <h2>1. Mục đích và phạm vi thu thập thông tin</h2>
        <h3>1.1. Thông tin chúng tôi thu thập</h3>
        <p>Chúng tôi có thể thu thập các loại thông tin sau đây:</p>
        <ul>
          <li><strong>Thông tin cá nhân:</strong> Họ tên, địa chỉ email, số điện thoại, địa chỉ giao hàng, ngày sinh (nếu cung cấp), giới tính (nếu cung cấp).</li>
          <li><strong>Thông tin thanh toán:</strong> Thông tin thẻ tín dụng/ghi nợ, thông tin tài khoản ngân hàng, thông tin ví điện tử, lịch sử thanh toán.</li>
          <li><strong>Thông tin giao dịch:</strong> Chi tiết về các sản phẩm và dịch vụ bạn đã mua hoặc xem xét, lịch sử đơn hàng.</li>
          <li><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại và phiên bản trình duyệt, thiết bị và hệ điều hành, dữ liệu vị trí địa lý, ID thiết bị.</li>
          <li><strong>Thông tin hành vi:</strong> Dữ liệu về cách bạn sử dụng website, sản phẩm và dịch vụ của chúng tôi.</li>
        </ul>
        
        <h3>1.2. Cách thức thu thập thông tin</h3>
        <p>Chúng tôi thu thập thông tin cá nhân của bạn thông qua các cách sau:</p>
        <ul>
          <li>Khi bạn đăng ký tài khoản trên website của chúng tôi.</li>
          <li>Khi bạn mua sản phẩm hoặc sử dụng dịch vụ của chúng tôi.</li>
          <li>Khi bạn liên hệ với dịch vụ khách hàng của chúng tôi.</li>
          <li>Khi bạn tham gia các cuộc khảo sát, chương trình khuyến mãi hoặc sự kiện do chúng tôi tổ chức.</li>
          <li>Thông qua cookie và các công nghệ theo dõi khác khi bạn truy cập và sử dụng website của chúng tôi.</li>
        </ul>
        
        <h2>2. Phạm vi sử dụng thông tin</h2>
        <p>Chúng tôi sử dụng thông tin cá nhân của bạn cho các mục đích sau:</p>
        <ul>
          <li>Cung cấp và quản lý sản phẩm và dịch vụ bạn yêu cầu.</li>
          <li>Xử lý đơn hàng và thanh toán của bạn.</li>
          <li>Giao tiếp với bạn về đơn hàng, tài khoản và các vấn đề khác.</li>
          <li>Cá nhân hóa trải nghiệm mua sắm của bạn và cung cấp các đề xuất sản phẩm phù hợp.</li>
          <li>Thông báo cho bạn về các thay đổi đối với sản phẩm, dịch vụ hoặc chính sách của chúng tôi.</li>
          <li>Nghiên cứu và phân tích để cải thiện sản phẩm, dịch vụ và trải nghiệm người dùng.</li>
          <li>Tiếp thị và quảng cáo phù hợp với sở thích của bạn (nếu bạn đã đồng ý).</li>
          <li>Phát hiện và ngăn chặn các hoạt động gian lận, lạm dụng và các hành vi bất hợp pháp khác.</li>
          <li>Tuân thủ các nghĩa vụ pháp lý và quy định.</li>
        </ul>
        
        <h2>3. Thời gian lưu trữ thông tin</h2>
        <p>Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để đáp ứng các mục đích được nêu trong Chính sách này, trừ khi pháp luật yêu cầu hoặc cho phép thời gian lưu trữ lâu hơn. Thông thường, chúng tôi sẽ lưu trữ:</p>
        <ul>
          <li>Thông tin tài khoản: Trong suốt thời gian tài khoản của bạn còn hoạt động và thêm một khoảng thời gian hợp lý sau khi tài khoản bị đóng hoặc không hoạt động.</li>
          <li>Thông tin giao dịch: Theo yêu cầu của pháp luật về kế toán, thuế và các quy định khác, thường là 10 năm.</li>
          <li>Thông tin tiếp thị: Cho đến khi bạn hủy đăng ký nhận thông tin tiếp thị hoặc sau một khoảng thời gian không tương tác.</li>
        </ul>
        
        <h2>4. Việc chia sẻ thông tin</h2>
        <p>Chúng tôi có thể chia sẻ thông tin cá nhân của bạn với:</p>
        <ul>
          <li><strong>Đối tác kinh doanh:</strong> Đơn vị vận chuyển, đơn vị thanh toán, nhà cung cấp dịch vụ CNTT để hỗ trợ cung cấp sản phẩm và dịch vụ cho bạn.</li>
          <li><strong>Công ty liên kết:</strong> Các công ty trong cùng tập đoàn với chúng tôi, nếu có.</li>
          <li><strong>Nhà cung cấp dịch vụ:</strong> Các bên thứ ba cung cấp dịch vụ cho chúng tôi, như lưu trữ dữ liệu, phân tích, tiếp thị, xử lý thanh toán.</li>
          <li><strong>Cơ quan pháp luật:</strong> Khi được yêu cầu bởi pháp luật, quy trình tố tụng, hoặc để bảo vệ quyền, tài sản hoặc an toàn của chúng tôi hoặc người khác.</li>
        </ul>
        <p>Chúng tôi yêu cầu tất cả các bên thứ ba tôn trọng tính bảo mật thông tin cá nhân của bạn và xử lý thông tin đó theo pháp luật về bảo vệ dữ liệu.</p>
        
        <h2>5. An toàn dữ liệu</h2>
        <p>Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin cá nhân của bạn khỏi việc truy cập, sử dụng hoặc tiết lộ trái phép. Các biện pháp này bao gồm:</p>
        <ul>
          <li>Mã hóa dữ liệu khi truyền tải và lưu trữ.</li>
          <li>Kiểm soát truy cập vật lý và kỹ thuật đối với hệ thống và dữ liệu.</li>
          <li>Đào tạo nhân viên về quy trình bảo mật và bảo vệ dữ liệu.</li>
          <li>Đánh giá thường xuyên về các rủi ro bảo mật và cập nhật biện pháp bảo vệ.</li>
        </ul>
        
        <h2>6. Quyền của chủ thể dữ liệu</h2>
        <p>Là chủ thể dữ liệu, bạn có các quyền sau đây liên quan đến thông tin cá nhân của bạn:</p>
        <ul>
          <li>Quyền truy cập và nhận bản sao thông tin cá nhân của bạn.</li>
          <li>Quyền yêu cầu sửa chữa thông tin không chính xác hoặc không đầy đủ.</li>
          <li>Quyền yêu cầu xóa thông tin cá nhân trong một số trường hợp nhất định.</li>
          <li>Quyền phản đối hoặc hạn chế việc xử lý thông tin cá nhân của bạn.</li>
          <li>Quyền rút lại sự đồng ý khi việc xử lý dựa trên sự đồng ý của bạn.</li>
          <li>Quyền khiếu nại với cơ quan bảo vệ dữ liệu có thẩm quyền.</li>
        </ul>
        <p>Để thực hiện bất kỳ quyền nào nêu trên, vui lòng liên hệ với chúng tôi theo thông tin liên hệ được cung cấp ở cuối Chính sách này.</p>
        
        <h2>7. Chính sách cookie</h2>
        <p>Chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm của bạn trên website của chúng tôi. Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập website. Chúng giúp website ghi nhớ thông tin về bạn và lựa chọn của bạn, giúp trải nghiệm trở nên dễ dàng và cá nhân hóa hơn.</p>
        <p>Chúng tôi sử dụng các loại cookie sau:</p>
        <ul>
          <li><strong>Cookie cần thiết:</strong> Cần thiết cho hoạt động của website và không thể tắt trong hệ thống của chúng tôi.</li>
          <li><strong>Cookie phân tích/hiệu suất:</strong> Cho phép chúng tôi đếm lượt truy cập và nguồn truy cập để đo lường và cải thiện hiệu suất của website.</li>
          <li><strong>Cookie chức năng:</strong> Giúp website cung cấp chức năng và cá nhân hóa nâng cao.</li>
          <li><strong>Cookie tiếp thị:</strong> Được sử dụng để theo dõi khách truy cập trên các website nhằm hiển thị quảng cáo phù hợp.</li>
        </ul>
        <p>Bạn có thể kiểm soát và xóa cookie thông qua cài đặt trình duyệt của mình. Tuy nhiên, việc xóa hoặc chặn cookie có thể ảnh hưởng đến trải nghiệm của bạn trên website của chúng tôi.</p>
        
        <h2>8. Quyền riêng tư của trẻ em</h2>
        <p>Website của chúng tôi không hướng đến trẻ em dưới 13 tuổi và chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi. Nếu bạn cho rằng chúng tôi đã vô tình thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi, vui lòng liên hệ với chúng tôi ngay lập tức để chúng tôi có thể xóa thông tin đó.</p>
        
        <h2>9. Liên kết đến trang web bên thứ ba</h2>
        <p>Website của chúng tôi có thể chứa các liên kết đến các trang web bên thứ ba. Chúng tôi không chịu trách nhiệm về các thực tiễn bảo mật hoặc nội dung của các trang web đó. Chúng tôi khuyến khích bạn đọc chính sách quyền riêng tư của mỗi trang web mà bạn truy cập.</p>
        
        <h2>10. Thay đổi chính sách</h2>
        <p>Chúng tôi có thể cập nhật Chính sách Quyền riêng tư này theo thời gian. Khi chúng tôi thực hiện các thay đổi quan trọng, chúng tôi sẽ thông báo cho bạn bằng cách đăng thông báo nổi bật trên website của chúng tôi hoặc gửi email trực tiếp cho bạn. Chúng tôi khuyến khích bạn xem xét Chính sách này thường xuyên để biết về cách chúng tôi bảo vệ thông tin cá nhân của bạn.</p>
        
        <h2>11. Liên hệ về quyền riêng tư</h2>
        <p>Nếu bạn có bất kỳ câu hỏi, nhận xét hoặc yêu cầu liên quan đến Chính sách Quyền riêng tư này hoặc cách chúng tôi xử lý thông tin cá nhân của bạn, vui lòng liên hệ với chúng tôi qua:</p>
        <p>Email: <a href="mailto:cskh@yapee.vn" className="text-primary hover:underline">cskh@yapee.vn</a></p>
        <p>Hotline: <strong>0333.938.014</strong></p>
        <p>Địa chỉ: 74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, Thành phố Hồ Chí Minh</p>
        
        <p className="mt-8 text-sm text-gray-500">Cập nhật lần cuối: Ngày 10 tháng 05 năm 2023</p>
      </div>
    </InfoPageLayout>
  );
};

export default PrivacyPage;