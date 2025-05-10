import React from 'react';
import InfoPageLayout from '@/components/layout/InfoPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
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

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <InfoPageLayout title={t("contact-us")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Thông tin liên hệ</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Địa chỉ</h3>
                <p className="text-gray-600">74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, Thành phố Hồ Chí Minh</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Phone className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Hotline</h3>
                <p className="text-gray-600">0333.938.014</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Mail className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">cskh@yapee.vn</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Clock className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium">Thời gian làm việc</h3>
                <p className="text-gray-600">8h00 - 19h00, từ Thứ Hai đến Chủ Nhật</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Bản đồ</h2>
            <div className="bg-gray-200 w-full h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Bản đồ hiển thị vị trí của Yapee</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Gửi tin nhắn cho chúng tôi</h2>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Họ và tên
              </label>
              <Input
                type="text"
                id="fullName"
                placeholder="Nhập họ và tên của bạn"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Nhập địa chỉ email của bạn"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Số điện thoại
              </label>
              <Input
                type="tel"
                id="phone"
                placeholder="Nhập số điện thoại của bạn"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Chủ đề
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">Vấn đề về đơn hàng</SelectItem>
                  <SelectItem value="product">Thông tin sản phẩm</SelectItem>
                  <SelectItem value="shipping">Vận chuyển và giao hàng</SelectItem>
                  <SelectItem value="payment">Thanh toán</SelectItem>
                  <SelectItem value="return">Đổi trả và hoàn tiền</SelectItem>
                  <SelectItem value="account">Tài khoản</SelectItem>
                  <SelectItem value="other">Vấn đề khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Nội dung
              </label>
              <Textarea
                id="message"
                placeholder="Nhập nội dung tin nhắn của bạn"
                className="w-full min-h-[150px]"
              />
            </div>
            
            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <Send size={18} />
              Gửi tin nhắn
            </Button>
          </form>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Chúng tôi sẽ phản hồi tin nhắn của bạn trong thời gian sớm nhất, thường là trong vòng 24 giờ làm việc.</p>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default ContactPage;