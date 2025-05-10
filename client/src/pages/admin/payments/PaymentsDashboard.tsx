import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, CreditCard, Wallet, Building2, Settings2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PaymentsDashboard() {
  const { t } = useLanguage();
  
  return (
    <AdminLayout>
      <Helmet>
        <title>{t('admin.payments')} | Yapee Admin</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('admin.payments')}</h1>
          <Button>
            <PlusCircle size={16} className="mr-2" />
            Thêm phương thức thanh toán
          </Button>
        </div>
        
        <Alert className="bg-amber-50 border-amber-200">
          <CreditCard className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Chú ý</AlertTitle>
          <AlertDescription className="text-amber-700">
            Để hoàn tất cấu hình thanh toán, bạn cần thêm các khóa API của Stripe vào hệ thống. Vui lòng liên hệ quản trị viên.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="settings">Cài đặt thanh toán</TabsTrigger>
            <TabsTrigger value="methods">Phương thức thanh toán</TabsTrigger>
            <TabsTrigger value="transactions">Lịch sử giao dịch</TabsTrigger>
            <TabsTrigger value="invoices">Hóa đơn</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt thanh toán</CardTitle>
                <CardDescription>
                  Quản lý cấu hình thanh toán cho hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Thanh toán Stripe</CardTitle>
                        <CreditCard className="text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="pb-3">
                        Cài đặt tích hợp cổng thanh toán Stripe
                      </CardDescription>
                      <div className="pt-2">
                        <Button variant="outline" size="sm">Cấu hình</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Ví điện tử</CardTitle>
                        <Wallet className="text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="pb-3">
                        Quản lý thanh toán qua ví điện tử
                      </CardDescription>
                      <div className="pt-2">
                        <Button variant="outline" size="sm">Cấu hình</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Chuyển khoản ngân hàng</CardTitle>
                        <Building2 className="text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="pb-3">
                        Cài đặt thông tin tài khoản ngân hàng
                      </CardDescription>
                      <div className="pt-2">
                        <Button variant="outline" size="sm">Cấu hình</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="methods">
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>
                  Quản lý các phương thức thanh toán có sẵn trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <Settings2 className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Tính năng đang phát triển</p>
                  <p className="text-sm">Chức năng này sẽ có sẵn trong phiên bản tới.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
                <CardDescription>
                  Xem lịch sử thanh toán trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <Settings2 className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Tính năng đang phát triển</p>
                  <p className="text-sm">Chức năng này sẽ có sẵn trong phiên bản tới.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Hóa đơn</CardTitle>
                <CardDescription>
                  Quản lý hóa đơn và báo cáo tài chính
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <Settings2 className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Tính năng đang phát triển</p>
                  <p className="text-sm">Chức năng này sẽ có sẵn trong phiên bản tới.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}