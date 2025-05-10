import React from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';

const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  
  return (
    <InfoPageLayout title={t("about-us")}>
      <div className="prose prose-lg max-w-none">
        <p className="text-xl font-medium mb-6">Chào mừng Quý khách đến với Yapee!</p>
        
        <p>Tại Yapee, chúng tôi tin rằng mọi người đều xứng đáng được tiếp cận những sản phẩm chất lượng cao mà không cần phải đắn đo về giá cả. Chính vì vậy, sứ mệnh của chúng tôi là:</p>
        
        <blockquote className="bg-primary/5 p-4 border-l-4 border-primary my-6">
          <p className="italic font-medium">
            "Yapee cung cấp các sản phẩm chất lượng cao với giá cả phải chăng. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng."
          </p>
        </blockquote>
        
        <p>Chúng tôi hiểu rằng "chất lượng cao" không chỉ nằm ở bản thân sản phẩm mà còn ở quy trình lựa chọn, kiểm định nghiêm ngặt để đảm bảo mỗi mặt hàng đến tay Quý khách đều đạt tiêu chuẩn tốt nhất. Đồng thời, "giá cả phải chăng" là nỗ lực không ngừng của Yapee trong việc tối ưu hóa vận hành và hợp tác với các nhà cung cấp uy tín, nhằm mang lại giá trị tối đa cho khách hàng.</p>
        
        <h2>Giá trị cốt lõi</h2>
        <ul>
          <li><strong>Chất lượng:</strong> Chúng tôi cam kết cung cấp sản phẩm chất lượng cao từ các nhà cung cấp đáng tin cậy.</li>
          <li><strong>Giá cả Hợp lý:</strong> Yapee nỗ lực tối ưu hóa quy trình để đảm bảo giá cả cạnh tranh cho mọi sản phẩm.</li>
          <li><strong>Khách hàng là Trọng tâm:</strong> Mọi quyết định tại Yapee đều hướng đến lợi ích tốt nhất cho khách hàng.</li>
          <li><strong>Đáng tin cậy:</strong> Yapee luôn giữ chữ tín và minh bạch trong mọi hoạt động kinh doanh.</li>
        </ul>
        
        <h2>Tầm nhìn</h2>
        <p>Tầm nhìn của Yapee là trở thành thương hiệu mua sắm trực tuyến được yêu thích và tin cậy hàng đầu tại Việt Nam.</p>
        
        <h2>Lịch sử phát triển</h2>
        <p>Yapee được thành lập với mong muốn tạo ra một nền tảng thương mại điện tử thuần Việt, nơi người tiêu dùng Việt Nam có thể tiếp cận sản phẩm chất lượng cao với giá cả phải chăng. Qua nhiều năm phát triển, Yapee đã xây dựng được niềm tin vững chắc từ khách hàng và đối tác, trở thành điểm đến mua sắm tin cậy của hàng triệu người Việt.</p>
        
        <h2>Đội ngũ lãnh đạo</h2>
        <p>Đội ngũ lãnh đạo của Yapee bao gồm những chuyên gia có kinh nghiệm và tầm nhìn trong lĩnh vực thương mại điện tử, công nghệ và dịch vụ khách hàng. Chúng tôi luôn tìm kiếm những cách thức sáng tạo để nâng cao trải nghiệm mua sắm trực tuyến cho khách hàng.</p>
        
        <h2>Cam kết của chúng tôi</h2>
        <p>Yapee cam kết mang đến trải nghiệm mua sắm trực tuyến an toàn, thuận tiện và đáng tin cậy. Chúng tôi không ngừng nỗ lực cải thiện dịch vụ, mở rộng danh mục sản phẩm và nâng cao chất lượng phục vụ để đáp ứng nhu cầu ngày càng cao của khách hàng.</p>
        
        <p className="mt-8">Cảm ơn Quý khách đã tin tưởng và đồng hành cùng Yapee!</p>
      </div>
    </InfoPageLayout>
  );
};

export default AboutPage;