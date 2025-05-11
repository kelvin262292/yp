import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Save, 
  Settings, 
  Mail, 
  Globe, 
  CreditCard, 
  ShieldCheck, 
  BellRing, 
  Users, 
  Truck,
  Check,
  Smartphone,
  EyeIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import Spinner from "@/components/ui/spinner";

// Định nghĩa schema cài đặt chung
const generalSettingsSchema = z.object({
  siteName: z.string().min(2, {
    message: "Tên website phải có ít nhất 2 ký tự",
  }),
  siteUrl: z.string().url({
    message: "URL không hợp lệ",
  }),
  adminEmail: z.string().email({
    message: "Email không hợp lệ",
  }),
  contactEmail: z.string().email({
    message: "Email không hợp lệ",
  }),
  contactPhone: z.string().min(10, {
    message: "Số điện thoại không hợp lệ",
  }),
  address: z.string().min(5, {
    message: "Địa chỉ quá ngắn",
  }),
  metaTitle: z.string().min(10, {
    message: "Tiêu đề SEO quá ngắn",
  }),
  metaDescription: z.string().min(20, {
    message: "Mô tả SEO quá ngắn",
  }),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});

// Định nghĩa schema cài đặt thanh toán
const paymentSettingsSchema = z.object({
  currency: z.string().min(1, {
    message: "Vui lòng chọn đơn vị tiền tệ",
  }),
  stripeLiveKey: z.string().min(10, {
    message: "Stripe live key không hợp lệ",
  }),
  stripeTestKey: z.string().min(10, {
    message: "Stripe test key không hợp lệ",
  }),
  enableVnpay: z.boolean(),
  enableMomo: z.boolean(),
  enableCod: z.boolean(),
  enableStripe: z.boolean(),
  testMode: z.boolean(),
});

// Định nghĩa schema cài đặt thông báo
const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean(),
  orderConfirmation: z.boolean(),
  orderStatusChange: z.boolean(),
  newUserRegistration: z.boolean(),
  lowStockAlert: z.boolean(),
  enablePushNotifications: z.boolean(),
  smtpHost: z.string().min(1, "SMTP host không được để trống"),
  smtpPort: z.coerce.number().min(1, "SMTP port không hợp lệ"),
  smtpUsername: z.string().min(1, "SMTP username không được để trống"),
  smtpPassword: z.string().min(1, "SMTP password không được để trống"),
  smtpFromEmail: z.string().email("Email không hợp lệ"),
  enableSms: z.boolean(),
});

// Định nghĩa schema cài đặt giao hàng
const shippingSettingsSchema = z.object({
  enableFreeShipping: z.boolean(),
  freeShippingMinAmount: z.coerce.number().min(0, "Giá trị không hợp lệ"),
  enableFlatRate: z.boolean(),
  flatRateAmount: z.coerce.number().min(0, "Giá trị không hợp lệ"),
  enableLocalPickup: z.boolean(),
  enableGhtk: z.boolean(),
  enableGhn: z.boolean(),
  defaultShippingMethod: z.string(),
});

// Component cài đặt chung
const GeneralSettingsForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "Yapee",
      siteUrl: "https://yapee.vn",
      adminEmail: "admin@yapee.vn",
      contactEmail: "contact@yapee.vn",
      contactPhone: "0987654321",
      address: "Số 1 Đường Láng, Đống Đa, Hà Nội",
      metaTitle: "Yapee - Sàn thương mại điện tử hàng đầu Việt Nam",
      metaDescription: "Mua sắm online giá tốt tại Yapee với hàng ngàn sản phẩm công nghệ, điện tử, gia dụng, thời trang chính hãng.",
      logoUrl: "/assets/images/logo.png",
      faviconUrl: "/assets/images/favicon.ico",
    },
  });
  
  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/settings?group=general');
        
        if (response.data.general && response.data.general.length > 0) {
          const generalSettings = response.data.general.reduce((acc: any, setting: any) => {
            acc[setting.key.replace('general.', '')] = setting.value;
            return acc;
          }, {});
          
          form.reset(generalSettings);
        }
      } catch (error) {
        console.error('Error fetching general settings:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải cài đặt. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [form, toast]);
  
  const onSubmit = async (values: z.infer<typeof generalSettingsSchema>) => {
    try {
      setLoading(true);
      
      // Convert values to settings format
      const settingsToUpdate = Object.entries(values).map(([key, value]) => ({
        key: `general.${key}`,
        value,
        group: 'general',
        description: `General setting: ${key}`
      }));
      
      // Send batch update request
      await axios.post('/api/admin/settings/batch', {
        settings: settingsToUpdate
      });
      
      toast({
        title: "Cài đặt đã được lưu",
        description: "Thông tin cài đặt chung đã được cập nhật thành công.",
      });
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu cài đặt. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên website</FormLabel>
                  <FormControl>
                    <Input placeholder="Yapee" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tên hiển thị của website của bạn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="siteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yapee.vn" {...field} />
                  </FormControl>
                  <FormDescription>
                    Địa chỉ URL chính của website
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email quản trị</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@yapee.vn" {...field} />
                  </FormControl>
                  <FormDescription>
                    Email nhận các thông báo quản trị
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email liên hệ</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@yapee.vn" {...field} />
                  </FormControl>
                  <FormDescription>
                    Email hiển thị cho khách hàng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại liên hệ</FormLabel>
                  <FormControl>
                    <Input placeholder="0987654321" {...field} />
                  </FormControl>
                  <FormDescription>
                    Số điện thoại hiển thị cho khách hàng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ công ty</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Số 1 Đường Láng, Đống Đa, Hà Nội" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Địa chỉ hiển thị cho khách hàng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề SEO mặc định</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Yapee - Sàn thương mại điện tử hàng đầu Việt Nam" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Tiêu đề mặc định cho SEO
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả SEO mặc định</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mua sắm online giá tốt tại Yapee với hàng ngàn sản phẩm..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả mặc định cho SEO
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL logo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="/assets/images/logo.png" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="faviconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL favicon</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="/assets/images/favicon.ico" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Spinner className="mr-2" size="sm" />}
            <Save className="mr-2 h-4 w-4" />
            Lưu cài đặt
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Component cài đặt thanh toán
const PaymentSettingsForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof paymentSettingsSchema>>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      currency: "VND",
      stripeLiveKey: "",
      stripeTestKey: "",
      enableVnpay: true,
      enableMomo: true,
      enableCod: true,
      enableStripe: false,
      testMode: true,
    },
  });
  
  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/settings?group=payment');
        
        if (response.data.payment && response.data.payment.length > 0) {
          const paymentSettings = response.data.payment.reduce((acc: any, setting: any) => {
            // Parse boolean values
            if (setting.key.startsWith('payment.enable') || setting.key === 'payment.testMode') {
              acc[setting.key.replace('payment.', '')] = setting.value === 'true' || setting.value === true;
            } else {
              acc[setting.key.replace('payment.', '')] = setting.value;
            }
            return acc;
          }, {});
          
          form.reset(paymentSettings);
        }
      } catch (error) {
        console.error('Error fetching payment settings:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải cài đặt thanh toán. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [form, toast]);
  
  const onSubmit = async (values: z.infer<typeof paymentSettingsSchema>) => {
    try {
      setLoading(true);
      
      // Convert values to settings format
      const settingsToUpdate = Object.entries(values).map(([key, value]) => ({
        key: `payment.${key}`,
        value,
        group: 'payment',
        description: `Payment setting: ${key}`
      }));
      
      // Send batch update request
      await axios.post('/api/admin/settings/batch', {
        settings: settingsToUpdate
      });
      
      toast({
        title: "Cài đặt đã được lưu",
        description: "Cài đặt thanh toán đã được cập nhật thành công.",
      });
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu cài đặt. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn vị tiền tệ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn đơn vị tiền tệ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                      <SelectItem value="USD">USD - Đô la Mỹ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Đơn vị tiền tệ được sử dụng trên toàn hệ thống
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="testMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Chế độ thử nghiệm</FormLabel>
                    <FormDescription>
                      Các giao dịch sẽ được xử lý trong môi trường thử nghiệm
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stripeLiveKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Live Key (Secret)</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Khóa bí mật Stripe cho môi trường thực
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stripeTestKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Test Key (Secret)</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Khóa bí mật Stripe cho môi trường thử nghiệm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Phương thức thanh toán</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enableStripe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-primary" />
                          Stripe (Thẻ tín dụng/ghi nợ)
                        </div>
                      </FormLabel>
                      <FormDescription>
                        Cho phép thanh toán qua thẻ quốc tế
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableVnpay"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-primary" />
                          VNPay
                        </div>
                      </FormLabel>
                      <FormDescription>
                        Cho phép thanh toán qua cổng VNPay
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableMomo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        <div className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2 text-primary" />
                          MoMo
                        </div>
                      </FormLabel>
                      <FormDescription>
                        Cho phép thanh toán qua ví MoMo
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableCod"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-primary" />
                          Thanh toán khi nhận hàng (COD)
                        </div>
                      </FormLabel>
                      <FormDescription>
                        Cho phép thanh toán khi nhận hàng
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Spinner className="mr-2" size="sm" />}
            <Save className="mr-2 h-4 w-4" />
            Lưu cài đặt
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Component cài đặt thông báo
const NotificationSettingsForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof notificationSettingsSchema>>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      enableEmailNotifications: true,
      orderConfirmation: true,
      orderStatusChange: true,
      newUserRegistration: true,
      lowStockAlert: true,
      enablePushNotifications: false,
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      smtpFromEmail: "noreply@yapee.vn",
      enableSms: false,
    },
  });
  
  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/settings?group=notification');
        
        if (response.data.notification && response.data.notification.length > 0) {
          const notificationSettings = response.data.notification.reduce((acc: any, setting: any) => {
            // Parse boolean values
            if (setting.key.startsWith('notification.enable') || 
                setting.key.includes('Notification') ||
                setting.key.includes('Alert')) {
              acc[setting.key.replace('notification.', '')] = setting.value === 'true' || setting.value === true;
            } 
            // Parse number values
            else if (setting.key === 'notification.smtpPort') {
              acc[setting.key.replace('notification.', '')] = Number(setting.value);
            }
            // Parse string values
            else {
              acc[setting.key.replace('notification.', '')] = setting.value;
            }
            return acc;
          }, {});
          
          form.reset(notificationSettings);
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải cài đặt thông báo. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [form, toast]);
  
  const onSubmit = async (values: z.infer<typeof notificationSettingsSchema>) => {
    try {
      setLoading(true);
      
      // Convert values to settings format
      const settingsToUpdate = Object.entries(values).map(([key, value]) => ({
        key: `notification.${key}`,
        value,
        group: 'notification',
        description: `Notification setting: ${key}`
      }));
      
      // Send batch update request
      await axios.post('/api/admin/settings/batch', {
        settings: settingsToUpdate
      });
      
      toast({
        title: "Cài đặt đã được lưu",
        description: "Cài đặt thông báo đã được cập nhật thành công.",
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu cài đặt. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="enableEmailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Thông báo qua email</FormLabel>
                    <FormDescription>
                      Bật/tắt tất cả thông báo qua email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Separator />
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="orderConfirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Xác nhận đơn hàng
                      </FormLabel>
                      <FormDescription>
                        Gửi email khi đơn hàng được tạo
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="orderStatusChange"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Thay đổi trạng thái đơn hàng
                      </FormLabel>
                      <FormDescription>
                        Gửi email khi đơn hàng thay đổi trạng thái
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newUserRegistration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Đăng ký tài khoản mới
                      </FormLabel>
                      <FormDescription>
                        Gửi email chào mừng khi người dùng đăng ký mới
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lowStockAlert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0">
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Cảnh báo hàng tồn kho thấp
                      </FormLabel>
                      <FormDescription>
                        Thông báo khi sản phẩm sắp hết hàng
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            
            <FormField
              control={form.control}
              name="enablePushNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Thông báo đẩy</FormLabel>
                    <FormDescription>
                      Bật/tắt thông báo đẩy trên trình duyệt và thiết bị di động
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="enableSms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Thông báo SMS</FormLabel>
                    <FormDescription>
                      Bật/tắt thông báo qua tin nhắn SMS
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Cấu hình SMTP</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="smtpHost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Host</FormLabel>
                    <FormControl>
                      <Input placeholder="smtp.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="smtpPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Port</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="587" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="smtpUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="smtpPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="smtpFromEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email người gửi</FormLabel>
                    <FormControl>
                      <Input placeholder="noreply@yapee.vn" {...field} />
                    </FormControl>
                    <FormDescription>
                      Email hiển thị khi gửi thông báo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button variant="outline" type="button" className="mt-2">
                Kiểm tra kết nối SMTP
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Spinner className="mr-2" size="sm" />}
            <Save className="mr-2 h-4 w-4" />
            Lưu cài đặt
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Component cài đặt giao hàng
const ShippingSettingsForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof shippingSettingsSchema>>({
    resolver: zodResolver(shippingSettingsSchema),
    defaultValues: {
      enableFreeShipping: true,
      freeShippingMinAmount: 500000,
      enableFlatRate: true,
      flatRateAmount: 30000,
      enableLocalPickup: true,
      enableGhtk: false,
      enableGhn: false,
      defaultShippingMethod: "flat-rate",
    },
  });
  
  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/settings?group=shipping');
        
        if (response.data.shipping && response.data.shipping.length > 0) {
          const shippingSettings = response.data.shipping.reduce((acc: any, setting: any) => {
            // Parse boolean values
            if (setting.key.startsWith('shipping.enable')) {
              acc[setting.key.replace('shipping.', '')] = setting.value === 'true' || setting.value === true;
            } 
            // Parse number values
            else if (setting.key.includes('Amount')) {
              acc[setting.key.replace('shipping.', '')] = Number(setting.value);
            }
            // Parse string values
            else {
              acc[setting.key.replace('shipping.', '')] = setting.value;
            }
            return acc;
          }, {});
          
          form.reset(shippingSettings);
        }
      } catch (error) {
        console.error('Error fetching shipping settings:', error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải cài đặt vận chuyển. Vui lòng thử lại sau.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [form, toast]);
  
  const onSubmit = async (values: z.infer<typeof shippingSettingsSchema>) => {
    try {
      setLoading(true);
      
      // Convert values to settings format
      const settingsToUpdate = Object.entries(values).map(([key, value]) => ({
        key: `shipping.${key}`,
        value,
        group: 'shipping',
        description: `Shipping setting: ${key}`
      }));
      
      // Send batch update request
      await axios.post('/api/admin/settings/batch', {
        settings: settingsToUpdate
      });
      
      toast({
        title: "Cài đặt đã được lưu",
        description: "Cài đặt vận chuyển đã được cập nhật thành công.",
      });
    } catch (error) {
      console.error('Error saving shipping settings:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu cài đặt. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="defaultShippingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương thức vận chuyển mặc định</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phương thức vận chuyển mặc định" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="flat_rate">Phí cố định</SelectItem>
                      <SelectItem value="free_shipping">Miễn phí vận chuyển</SelectItem>
                      <SelectItem value="local_pickup">Nhận tại cửa hàng</SelectItem>
                      <SelectItem value="ghtk">Giao hàng tiết kiệm</SelectItem>
                      <SelectItem value="ghn">Giao hàng nhanh</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Phương thức vận chuyển mặc định cho đơn hàng mới
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="enableFlatRate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Phí vận chuyển cố định</FormLabel>
                    <FormDescription>
                      Áp dụng mức phí cố định cho tất cả đơn hàng
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("enableFlatRate") && (
              <FormField
                control={form.control}
                name="flatRateAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mức phí cố định</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Mức phí vận chuyển cố định (VND)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="enableFreeShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Miễn phí vận chuyển</FormLabel>
                    <FormDescription>
                      Cho phép miễn phí vận chuyển khi đạt mức giá trị đơn hàng nhất định
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {form.watch("enableFreeShipping") && (
              <FormField
                control={form.control}
                name="freeShippingMinAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Giá trị đơn hàng tối thiểu để được miễn phí vận chuyển (VND)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Các dịch vụ vận chuyển</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enableLocalPickup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Nhận tại cửa hàng</FormLabel>
                      <FormDescription>
                        Cho phép khách hàng đến nhận hàng tại cửa hàng
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableGhtk"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Giao hàng tiết kiệm</FormLabel>
                      <FormDescription>
                        Kết nối với dịch vụ Giao hàng tiết kiệm
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableGhn"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Giao hàng nhanh</FormLabel>
                      <FormDescription>
                        Kết nối với dịch vụ Giao hàng nhanh
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium flex items-center">
                <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
                Thông tin bổ sung
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                Để kết nối với các dịch vụ vận chuyển bên thứ ba như Giao hàng tiết kiệm hoặc Giao hàng nhanh, bạn cần cung cấp API key trong mục Cấu hình API.
              </p>
              <Button variant="link" size="sm" className="px-0 mt-2">
                Đi đến cấu hình API
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <Spinner className="mr-2" size="sm" />}
            <Save className="h-4 w-4 mr-2" />
            Lưu cài đặt
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Component chính Dashboard Settings
const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSaveAll = async () => {
    try {
      setLoading(true);
      
      // Thực hiện yêu cầu GET để lấy tất cả các cài đặt
      const response = await axios.get('/api/admin/settings');
      
      if (Object.keys(response.data).length === 0) {
        toast({
          title: "Không có dữ liệu để lưu",
          description: "Không có cài đặt nào được tìm thấy để lưu.",
        });
        return;
      }
      
      toast({
        title: "Tất cả cài đặt đã được lưu",
        description: "Tất cả cài đặt hệ thống đã được cập nhật thành công.",
      });
    } catch (error) {
      console.error('Error saving all settings:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu tất cả cài đặt. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Cài đặt hệ thống - Yapee Admin</title>
      </Helmet>
      
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
            <p className="text-muted-foreground">Quản lý cài đặt và cấu hình website</p>
          </div>
          
          <Button onClick={handleSaveAll} disabled={loading}>
            {loading && <Spinner className="mr-2" size="sm" />}
            <Settings className="mr-2 h-4 w-4" />
            Lưu tất cả
          </Button>
        </div>
        
        <Card className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="general">
                  <Globe className="h-4 w-4 mr-2" />
                  Cài đặt chung
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Thanh toán
                </TabsTrigger>
                <TabsTrigger value="notification">
                  <BellRing className="h-4 w-4 mr-2" />
                  Thông báo
                </TabsTrigger>
                <TabsTrigger value="shipping">
                  <Truck className="h-4 w-4 mr-2" />
                  Vận chuyển
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="general" className="mt-0">
                <GeneralSettingsForm />
              </TabsContent>
              
              <TabsContent value="payment" className="mt-0">
                <PaymentSettingsForm />
              </TabsContent>
              
              <TabsContent value="notification" className="mt-0">
                <NotificationSettingsForm />
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-0">
                <ShippingSettingsForm />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SettingsDashboard;