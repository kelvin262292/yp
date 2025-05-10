import { Helmet } from "react-helmet";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, 
  Search, 
  UserPlus, 
  Users as UsersIcon, 
  UserCog, 
  Mail,
  Phone,
  Calendar,
  MapPin
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UsersList() {
  const { t } = useLanguage();
  
  return (
    <AdminLayout>
      <Helmet>
        <title>{t('admin.users')} | Yapee Admin</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('admin.users')}</h1>
          <Button>
            <UserPlus size={16} className="mr-2" />
            Thêm người dùng mới
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Tìm kiếm người dùng..."
              className="pl-8"
            />
          </div>
          <Button variant="outline">Tìm kiếm</Button>
        </div>
        
        <Tabs defaultValue="all-users">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all-users">Tất cả người dùng</TabsTrigger>
            <TabsTrigger value="customers">Khách hàng</TabsTrigger>
            <TabsTrigger value="admins">Quản trị viên</TabsTrigger>
            <TabsTrigger value="vendors">Nhà cung cấp</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Quản lý người dùng</CardTitle>
                    <CardDescription>
                      Quản lý tất cả người dùng trên hệ thống Yapee
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <UsersIcon size={16} className="mr-2" />
                      Xuất danh sách
                    </Button>
                    <Button variant="outline" size="sm">
                      <UserCog size={16} className="mr-2" />
                      Phân quyền
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Người dùng</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                            <AvatarFallback>NT</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Nguyễn Thị Anh</div>
                            <div className="text-xs text-gray-500">Khách hàng</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>nguyenthianh@example.com</TableCell>
                      <TableCell>0987654321</TableCell>
                      <TableCell>15/03/2024</TableCell>
                      <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Hoạt động</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Chi tiết</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                            <AvatarFallback>TM</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Trần Minh Đức</div>
                            <div className="text-xs text-gray-500">Quản trị viên</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>tranminhduc@example.com</TableCell>
                      <TableCell>0912345678</TableCell>
                      <TableCell>10/01/2024</TableCell>
                      <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Hoạt động</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Chi tiết</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/150?img=58" />
                            <AvatarFallback>LH</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Lê Hoàng Nam</div>
                            <div className="text-xs text-gray-500">Nhà cung cấp</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>lehoangnam@example.com</TableCell>
                      <TableCell>0965432198</TableCell>
                      <TableCell>20/02/2024</TableCell>
                      <TableCell><Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Bị khóa</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Chi tiết</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Khách hàng</CardTitle>
                <CardDescription>
                  Quản lý tài khoản khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Tổng khách hàng</div>
                        <UsersIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-3xl font-bold mt-2">24,516</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Khách hàng mới (30 ngày)</div>
                        <UserPlus className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-3xl font-bold mt-2">845</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Khách hàng đang hoạt động</div>
                        <UsersIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-3xl font-bold mt-2">18,423</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Đơn hàng đầu tiên</div>
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-3xl font-bold mt-2">6,345</div>
                    </CardContent>
                  </Card>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Khách hàng</TableHead>
                      <TableHead>Liên hệ</TableHead>
                      <TableHead>Đơn hàng</TableHead>
                      <TableHead>Ngày tham gia</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/150?img=32" />
                            <AvatarFallback>NT</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Nguyễn Thị Anh</div>
                            <div className="text-xs text-gray-500">Premium</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center text-xs"><Mail className="h-3 w-3 mr-1" /> nguyenthianh@example.com</span>
                          <span className="flex items-center text-xs"><Phone className="h-3 w-3 mr-1" /> 0987654321</span>
                          <span className="flex items-center text-xs"><MapPin className="h-3 w-3 mr-1" /> Hà Nội</span>
                        </div>
                      </TableCell>
                      <TableCell>12 đơn hàng</TableCell>
                      <TableCell>15/03/2024</TableCell>
                      <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Hoạt động</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Chi tiết</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <CardTitle>Quản trị viên</CardTitle>
                <CardDescription>
                  Quản lý tài khoản quản trị viên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <UserCog className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Tính năng đang phát triển</p>
                  <p className="text-sm">Chức năng này sẽ có sẵn trong phiên bản tới.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Nhà cung cấp</CardTitle>
                <CardDescription>
                  Quản lý tài khoản nhà cung cấp trên sàn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <UserCog className="mx-auto h-12 w-12 text-gray-400" />
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