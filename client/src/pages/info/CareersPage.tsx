import React from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';

const CareersPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <InfoPageLayout title={t("careers")}>
      <div className="prose prose-lg max-w-none">
        <h2>Cơ hội nghề nghiệp tại Yapee</h2>
        <p>Gia nhập đội ngũ Yapee, bạn sẽ được làm việc trong một môi trường năng động, sáng tạo và không ngừng phát triển. Chúng tôi luôn tìm kiếm những tài năng có cùng đam mê mang đến những sản phẩm chất lượng và trải nghiệm mua sắm tuyệt vời cho khách hàng.</p>
        
        <h2>Văn hóa làm việc</h2>
        <p>Tại Yapee, chúng tôi đề cao sự hợp tác, tôn trọng lẫn nhau và khuyến khích mỗi cá nhân phát huy tối đa tiềm năng của mình. Chúng tôi tin rằng thành công của Yapee đến từ sự cống hiến và sáng tạo của mỗi thành viên trong đội ngũ.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-primary font-semibold text-xl mb-4">Môi trường làm việc</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Văn phòng hiện đại, thoáng mát</li>
              <li>Trang thiết bị làm việc tiên tiến</li>
              <li>Không gian làm việc sáng tạo</li>
              <li>Hoạt động team building thường xuyên</li>
              <li>Lịch làm việc linh hoạt</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-primary font-semibold text-xl mb-4">Quyền lợi</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>Mức lương cạnh tranh</li>
              <li>Chế độ BHXH, BHYT, BHTN đầy đủ</li>
              <li>Thưởng dự án, thưởng thành tích</li>
              <li>Cơ hội đào tạo và phát triển</li>
              <li>Chăm sóc sức khỏe định kỳ</li>
              <li>Chính sách nghỉ phép linh hoạt</li>
            </ul>
          </div>
        </div>
        
        <h2 className="mt-8">Các vị trí đang tuyển dụng</h2>
        
        <div className="space-y-6 mt-4">
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-primary">Nhân viên Vận hành Sàn Thương mại Điện tử</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Toàn thời gian</span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">TP. Hồ Chí Minh</span>
            </div>
            <p className="mt-4">Quản lý và đảm bảo hoạt động hiệu quả của sàn thương mại điện tử Yapee, bao gồm quản lý sản phẩm, danh mục, giá cả và khuyến mãi. Phối hợp với các bộ phận khác để tối ưu hóa trải nghiệm mua sắm của khách hàng.</p>
            <button className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">Xem chi tiết</button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-primary">Chuyên viên Marketing Online</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Toàn thời gian</span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">TP. Hồ Chí Minh</span>
            </div>
            <p className="mt-4">Lập kế hoạch và triển khai các chiến dịch marketing online để tăng lượng truy cập và chuyển đổi trên website. Quản lý các kênh marketing như Google Ads, Facebook Ads, Email Marketing, và Content Marketing.</p>
            <button className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">Xem chi tiết</button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-primary">Nhân viên Chăm sóc Khách hàng</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Toàn thời gian</span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">TP. Hồ Chí Minh</span>
            </div>
            <p className="mt-4">Hỗ trợ và giải đáp thắc mắc của khách hàng qua các kênh như điện thoại, email, chat trực tuyến và mạng xã hội. Xử lý các khiếu nại và đảm bảo mức độ hài lòng cao của khách hàng.</p>
            <button className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors">Xem chi tiết</button>
          </div>
        </div>
        
        <h2 className="mt-8">Cách thức ứng tuyển</h2>
        <p>Ứng viên quan tâm vui lòng gửi CV về địa chỉ email: <a href="mailto:tuyendung@yapee.vn" className="text-primary hover:underline">tuyendung@yapee.vn</a></p>
        <p>Hoặc liên hệ với chúng tôi qua số điện thoại: <strong>0333.938.014</strong></p>
        
        <div className="bg-primary/5 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold text-primary mb-4">Thông tin cần có trong CV</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Thông tin cá nhân và thông tin liên hệ</li>
            <li>Kinh nghiệm làm việc (nếu có)</li>
            <li>Học vấn và bằng cấp</li>
            <li>Kỹ năng chuyên môn và kỹ năng mềm</li>
            <li>Thành tích và dự án đã thực hiện (nếu có)</li>
          </ul>
        </div>
        
        <p className="mt-8 italic">Yapee là một môi trường làm việc năng động, công bằng và tôn trọng sự đa dạng. Chúng tôi khuyến khích mọi ứng viên đủ điều kiện nộp đơn ứng tuyển.</p>
      </div>
    </InfoPageLayout>
  );
};

export default CareersPage;