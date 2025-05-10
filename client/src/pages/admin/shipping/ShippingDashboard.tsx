import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Truck, 
  Globe, 
  MapPin, 
  PackageOpen, 
  Settings2 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function ShippingDashboard() {
  const { t } = useLanguage();
  
  return (
    <AdminLayout>
      <Helmet>
        <title>{t('admin.shipping')} | Yapee Admin</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('admin.shipping')}</h1>
          <Button>
            <PlusCircle size={16} className="mr-2" />
            Thêm phương thức vận chuyển
          </Button>
        </div>
        
        <Tabs defaultValue="shipping-methods">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="shipping-methods">Phương thức vận chuyển</TabsTrigger>
            <TabsTrigger value="zones">Vùng vận chuyển</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shipping-methods">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức vận chuyển hiện tại</CardTitle>
                  <CardDescription>
                    Quản lý các phương thức vận chuyển có sẵn trên hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Tên phương thức</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead>Thời gian dự kiến</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Giao hàng tiêu chuẩn</TableCell>
                        <TableCell>Giao hàng thông thường đến tận nhà</TableCell>
                        <TableCell>30.000 VND</TableCell>
                        <TableCell>3-5 ngày</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Đang hoạt động</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Sửa</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Giao hàng nhanh</TableCell>
                        <TableCell>Giao hàng nhanh trong ngày</TableCell>
                        <TableCell>55.000 VND</TableCell>
                        <TableCell>1-2 ngày</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Đang hoạt động</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Sửa</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Giao hàng hỏa tốc</TableCell>
                        <TableCell>Giao hàng trong vòng 2 giờ</TableCell>
                        <TableCell>100.000 VND</TableCell>
                        <TableCell>2 giờ</TableCell>
                        <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Đang hoạt động</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Sửa</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Đối tác vận chuyển</CardTitle>
                      <Truck className="text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="pb-3">
                      Quản lý đối tác vận chuyển và dịch vụ giao hàng
                    </CardDescription>
                    <div className="pt-2">
                      <Button variant="outline" size="sm">Quản lý</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Vùng vận chuyển</CardTitle>
                      <Globe className="text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="pb-3">
                      Thiết lập các khu vực và vùng vận chuyển
                    </CardDescription>
                    <div className="pt-2">
                      <Button variant="outline" size="sm">Quản lý</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Theo dõi đơn hàng</CardTitle>
                      <PackageOpen className="text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="pb-3">
                      Thiết lập và quản lý hệ thống theo dõi đơn hàng
                    </CardDescription>
                    <div className="pt-2">
                      <Button variant="outline" size="sm">Quản lý</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="zones">
            <Card>
              <CardHeader>
                <CardTitle>Vùng vận chuyển</CardTitle>
                <CardDescription>
                  Quản lý các vùng vận chuyển và phí vận chuyển theo khu vực
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Tính năng đang phát triển</p>
                  <p className="text-sm">Chức năng này sẽ có sẵn trong phiên bản tới.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt vận chuyển</CardTitle>
                <CardDescription>
                  Quản lý các cài đặt chung cho vận chuyển
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