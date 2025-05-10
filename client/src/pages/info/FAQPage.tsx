import React, { useState } from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from '@/components/ui/input';

const FAQPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  const accountFAQs = [
    {
      question: "Làm thế nào để tạo tài khoản trên Yapee?",
      answer: "Để tạo tài khoản trên Yapee, bạn cần truy cập vào trang chủ Yapee và nhấp vào nút \"Đăng ký\" ở góc phải trên cùng. Sau đó, điền đầy đủ thông tin cá nhân như họ tên, email, số điện thoại và mật khẩu. Cuối cùng, nhấp vào nút \"Đăng ký\" để hoàn tất quá trình."
    },
    {
      question: "Tôi quên mật khẩu, làm sao để lấy lại?",
      answer: "Nếu bạn quên mật khẩu, vui lòng nhấp vào liên kết \"Quên mật khẩu?\" trên trang đăng nhập. Nhập địa chỉ email hoặc số điện thoại bạn đã đăng ký với tài khoản Yapee, sau đó chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu qua email hoặc tin nhắn SMS."
    },
    {
      question: "Làm cách nào để thay đổi thông tin cá nhân trong tài khoản?",
      answer: "Để thay đổi thông tin cá nhân, hãy đăng nhập vào tài khoản Yapee của bạn, sau đó nhấp vào tên người dùng ở góc phải trên cùng và chọn \"Tài khoản của tôi\". Tại đây, bạn có thể chỉnh sửa thông tin cá nhân, địa chỉ giao hàng, và các cài đặt khác. Sau khi thay đổi, nhớ nhấn \"Lưu\" để cập nhật thông tin."
    }
  ];
  
  const orderFAQs = [
    {
      question: "Hướng dẫn cách tìm kiếm sản phẩm?",
      answer: "Để tìm kiếm sản phẩm trên Yapee, bạn có thể sử dụng thanh tìm kiếm ở phía trên cùng của trang web. Nhập từ khóa liên quan đến sản phẩm bạn muốn tìm và nhấn Enter. Ngoài ra, bạn có thể duyệt qua các danh mục sản phẩm bằng cách nhấp vào menu danh mục trên thanh điều hướng."
    },
    {
      question: "Làm thế nào để đặt hàng?",
      answer: "Để đặt hàng trên Yapee, hãy làm theo các bước sau: 1) Tìm sản phẩm bạn muốn mua, 2) Nhấp vào nút \"Thêm vào giỏ hàng\", 3) Đi đến giỏ hàng bằng cách nhấp vào biểu tượng giỏ hàng ở góc phải trên cùng, 4) Kiểm tra lại đơn hàng và nhấp \"Thanh toán\", 5) Điền thông tin giao hàng và phương thức thanh toán, 6) Xác nhận đơn hàng."
    },
    {
      question: "Tôi có thể thay đổi hoặc hủy đơn hàng đã đặt không?",
      answer: "Bạn có thể thay đổi hoặc hủy đơn hàng trong khoảng thời gian ngắn sau khi đặt hàng, miễn là đơn hàng chưa được xử lý. Để làm điều này, hãy đăng nhập vào tài khoản, đi đến \"Đơn hàng của tôi\", chọn đơn hàng bạn muốn thay đổi hoặc hủy, và làm theo hướng dẫn. Nếu đơn hàng đã được xử lý, vui lòng liên hệ với bộ phận Chăm sóc Khách hàng của chúng tôi."
    }
  ];
  
  const paymentFAQs = [
    {
      question: "Yapee chấp nhận những phương thức thanh toán nào?",
      answer: "Yapee chấp nhận nhiều phương thức thanh toán khác nhau, bao gồm: thanh toán khi nhận hàng (COD), thẻ tín dụng/ghi nợ (Visa, Mastercard), chuyển khoản ngân hàng, và các ví điện tử như MoMo, ZaloPay, và VNPay."
    },
    {
      question: "Thanh toán trực tuyến trên Yapee có an toàn không?",
      answer: "Có, thanh toán trực tuyến trên Yapee rất an toàn. Chúng tôi sử dụng các biện pháp bảo mật tiên tiến, bao gồm mã hóa SSL/TLS để bảo vệ thông tin thanh toán của bạn. Chúng tôi cũng tuân thủ các tiêu chuẩn bảo mật thanh toán quốc tế để đảm bảo rằng thông tin cá nhân và tài chính của bạn luôn được bảo vệ."
    },
    {
      question: "Tôi phải làm gì nếu thanh toán không thành công?",
      answer: "Nếu thanh toán của bạn không thành công, hãy kiểm tra lại thông tin thẻ hoặc tài khoản của bạn, đảm bảo rằng bạn có đủ số dư và thẻ của bạn đang hoạt động. Nếu vấn đề vẫn tiếp diễn, vui lòng thử phương thức thanh toán khác hoặc liên hệ với ngân hàng của bạn để được hỗ trợ. Bạn cũng có thể liên hệ với bộ phận Chăm sóc Khách hàng của Yapee để được hướng dẫn thêm."
    }
  ];
  
  const shippingFAQs = [
    {
      question: "Phí vận chuyển được tính như thế nào?",
      answer: "Phí vận chuyển trên Yapee được tính dựa trên nhiều yếu tố, bao gồm khoảng cách từ kho hàng đến địa chỉ giao hàng, trọng lượng và kích thước của gói hàng, và phương thức vận chuyển bạn chọn. Bạn có thể xem phí vận chuyển chính xác trong quá trình thanh toán, trước khi xác nhận đơn hàng."
    },
    {
      question: "Thời gian giao hàng dự kiến là bao lâu?",
      answer: "Thời gian giao hàng thường từ 1-5 ngày làm việc, tùy thuộc vào vị trí của bạn và tình trạng kho hàng. Đối với các khu vực trung tâm thành phố lớn, thời gian giao hàng thường nhanh hơn (1-2 ngày), trong khi các vùng ngoại thành hoặc tỉnh thành xa hơn có thể mất 3-5 ngày. Bạn sẽ nhận được thông báo khi đơn hàng được gửi đi, bao gồm thông tin theo dõi."
    },
    {
      question: "Làm cách nào để theo dõi đơn hàng của tôi?",
      answer: "Để theo dõi đơn hàng, hãy đăng nhập vào tài khoản Yapee của bạn và đi đến mục \"Đơn hàng của tôi\". Tại đây, bạn có thể xem trạng thái hiện tại của tất cả đơn hàng. Khi đơn hàng được gửi đi, bạn sẽ nhận được email hoặc tin nhắn SMS với mã theo dõi và liên kết để theo dõi gói hàng theo thời gian thực."
    },
    {
      question: "Tôi phải làm gì nếu chưa nhận được hàng hoặc hàng giao chậm?",
      answer: "Nếu bạn chưa nhận được hàng hoặc giao hàng bị chậm so với thời gian dự kiến, vui lòng kiểm tra trạng thái đơn hàng trong tài khoản của bạn. Nếu đã quá thời gian giao hàng dự kiến, vui lòng liên hệ với bộ phận Chăm sóc Khách hàng của chúng tôi qua email cskh@yapee.vn hoặc hotline 0333.938.014 để được hỗ trợ."
    }
  ];
  
  const returnFAQs = [
    {
      question: "Chính sách đổi trả hàng của Yapee như thế nào?",
      answer: "Yapee có chính sách đổi trả trong vòng 7 ngày kể từ ngày nhận hàng. Để đủ điều kiện đổi trả, sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, còn đầy đủ bao bì, nhãn mác ban đầu, và đi kèm với hóa đơn mua hàng. Một số sản phẩm như đồ lót, mỹ phẩm đã mở seal, và hàng được đặt riêng theo yêu cầu có thể không được áp dụng chính sách đổi trả."
    },
    {
      question: "Sản phẩm nào được áp dụng đổi trả?",
      answer: "Hầu hết các sản phẩm được bán trên Yapee đều có thể được đổi trả trong vòng 7 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên vẹn. Tuy nhiên, một số sản phẩm không được áp dụng chính sách đổi trả, bao gồm: đồ lót, mỹ phẩm đã mở seal, sản phẩm số/mã kích hoạt, hàng được đặt riêng theo yêu cầu, và các mặt hàng khuyến mãi hoặc giảm giá đặc biệt (trừ khi có lỗi từ phía nhà sản xuất)."
    },
    {
      question: "Quy trình yêu cầu đổi trả/hoàn tiền ra sao?",
      answer: "Để yêu cầu đổi trả hoặc hoàn tiền, vui lòng làm theo các bước sau: 1) Đăng nhập vào tài khoản Yapee, 2) Đi đến \"Đơn hàng của tôi\" và chọn đơn hàng chứa sản phẩm bạn muốn đổi trả, 3) Nhấp vào \"Yêu cầu đổi trả\" và điền vào biểu mẫu với lý do đổi trả, 4) Đợi phản hồi từ bộ phận Chăm sóc Khách hàng, 5) Sau khi yêu cầu được chấp thuận, đóng gói sản phẩm cẩn thận và gửi lại theo hướng dẫn, 6) Sau khi chúng tôi nhận được và kiểm tra sản phẩm, quá trình đổi trả hoặc hoàn tiền sẽ được xử lý."
    },
    {
      question: "Sau bao lâu tôi sẽ nhận được tiền hoàn?",
      answer: "Thời gian hoàn tiền phụ thuộc vào phương thức thanh toán ban đầu của bạn. Đối với thanh toán bằng thẻ tín dụng/ghi nợ, quá trình hoàn tiền thường mất 7-14 ngày làm việc. Đối với thanh toán qua ví điện tử, thời gian hoàn tiền thường là 3-5 ngày làm việc. Đối với chuyển khoản ngân hàng, thời gian có thể dao động từ 5-10 ngày làm việc. Chúng tôi sẽ thông báo cho bạn khi tiền hoàn được xử lý."
    }
  ];
  
  const productFAQs = [
    {
      question: "Làm sao để biết thông tin chi tiết về sản phẩm?",
      answer: "Để biết thông tin chi tiết về sản phẩm, hãy truy cập trang sản phẩm cụ thể. Tại đây, bạn sẽ tìm thấy mô tả sản phẩm, thông số kỹ thuật, hình ảnh, giá cả, đánh giá từ khách hàng và thông tin về vận chuyển. Nếu bạn cần thêm thông tin, bạn có thể sử dụng tính năng Hỏi đáp trên trang sản phẩm hoặc liên hệ trực tiếp với bộ phận Chăm sóc Khách hàng."
    },
    {
      question: "Sản phẩm trên Yapee có đảm bảo chất lượng không?",
      answer: "Có, Yapee cam kết cung cấp các sản phẩm chất lượng cao. Chúng tôi làm việc trực tiếp với các nhà sản xuất và nhà cung cấp uy tín, và thực hiện quy trình kiểm tra chất lượng nghiêm ngặt. Tất cả sản phẩm đều được bảo hành theo chính sách của nhà sản xuất. Nếu bạn không hài lòng với chất lượng sản phẩm, bạn có thể yêu cầu đổi trả theo chính sách đổi trả của chúng tôi."
    },
    {
      question: "Cách sử dụng mã giảm giá/voucher?",
      answer: "Để sử dụng mã giảm giá hoặc voucher, hãy làm theo các bước sau: 1) Thêm sản phẩm vào giỏ hàng, 2) Đi đến trang Giỏ hàng, 3) Nhập mã giảm giá vào ô \"Mã khuyến mãi\" và nhấp \"Áp dụng\", 4) Nếu mã hợp lệ, giảm giá sẽ được áp dụng ngay lập tức và hiển thị trong tổng đơn hàng, 5) Tiếp tục quy trình thanh toán bình thường. Lưu ý rằng mỗi mã giảm giá có thể có điều kiện áp dụng riêng, như giá trị đơn hàng tối thiểu hoặc danh mục sản phẩm cụ thể."
    }
  ];
  
  const allFAQs = [
    ...accountFAQs.map(faq => ({ ...faq, category: "account" })),
    ...orderFAQs.map(faq => ({ ...faq, category: "order" })),
    ...paymentFAQs.map(faq => ({ ...faq, category: "payment" })),
    ...shippingFAQs.map(faq => ({ ...faq, category: "shipping" })),
    ...returnFAQs.map(faq => ({ ...faq, category: "return" })),
    ...productFAQs.map(faq => ({ ...faq, category: "product" }))
  ];
  
  const filteredFAQs = allFAQs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <InfoPageLayout title={t("faq")}>
      <div className="space-y-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm câu hỏi..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {searchTerm ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Kết quả tìm kiếm</h2>
            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-2">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg p-2">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-gray-500">Không tìm thấy câu hỏi phù hợp. Vui lòng thử với từ khóa khác hoặc liên hệ với chúng tôi.</p>
            )}
          </div>
        ) : (
          <Tabs defaultValue="account">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
              <TabsTrigger value="account">Tài khoản</TabsTrigger>
              <TabsTrigger value="order">Đặt hàng</TabsTrigger>
              <TabsTrigger value="payment">Thanh toán</TabsTrigger>
              <TabsTrigger value="shipping">Vận chuyển</TabsTrigger>
              <TabsTrigger value="return">Đổi trả</TabsTrigger>
              <TabsTrigger value="product">Sản phẩm</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-2">
                {accountFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`account-${index}`} className="border rounded-lg p-2">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            <TabsContent value="order" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-2">
                {orderFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`order-${index}`} className="border rounded-lg p-2">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-2">
                {paymentFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`payment-${index}`} className="border rounded-lg p-2">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            <TabsContent value="shipping" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-2">
                {shippingFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`shipping-${index}`} className="border rounded-lg p-2">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            <TabsContent value="return" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-2">
                {returnFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`return-${index}`} className="border rounded-lg p-2">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            <TabsContent value="product" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-2">
                {productFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`product-${index}`} className="border rounded-lg p-2">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        )}
        
        <div className="bg-primary/5 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Vẫn chưa tìm thấy câu trả lời?</h2>
          <p className="mb-4">Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, vui lòng liên hệ với bộ phận Chăm sóc Khách hàng của chúng tôi qua:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Email: <a href="mailto:cskh@yapee.vn" className="text-primary hover:underline">cskh@yapee.vn</a></li>
            <li>Hotline: <strong>0333.938.014</strong> (8h00 - 19h00, từ Thứ Hai đến Chủ Nhật)</li>
            <li>Trang <a href="/contact" className="text-primary hover:underline">Liên hệ</a> của chúng tôi</li>
          </ul>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default FAQPage;