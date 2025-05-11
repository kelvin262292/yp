import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
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
  MapPin,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";

export default function UsersList() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeRole, setActiveRole] = useState("all-users");
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userStats, setUserStats] = useState({
    total: 0,
    customers: 0,
    admins: 0,
    vendors: 0
  });
  
  // Tải danh sách người dùng khi component mount hoặc khi các tham số thay đổi
  useEffect(() => {
    fetchUsers();
  }, [currentPage, activeRole]);
  
  // Hàm tải danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Tạo các tham số cho API
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: 10
      };
      
      // Thêm filter theo role nếu không phải "all-users"
      if (activeRole !== "all-users") {
        params.role = activeRole === "admins" ? "admin" : activeRole === "vendors" ? "vendor" : "user";
      }
      
      // Thêm tham số tìm kiếm nếu có
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Gọi API để lấy danh sách người dùng
      const response = await axios.get('/api/admin/users', { params });
      
      setUsers(response.data.users);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.totalPages);
      
      // Cập nhật thống kê
      setUserStats({
        total: response.data.pagination.total,
        customers: 0, // Sẽ cập nhật sau khi có API riêng
        admins: 0,
        vendors: 0
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng. Vui lòng thử lại sau."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm tìm kiếm người dùng
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers();
  };
  
  // Hàm xử lý khi tab thay đổi
  const handleTabChange = (value: string) => {
    setActiveRole(value);
    setCurrentPage(1);
  };
  
  // Hàm mở dialog xác nhận xóa người dùng
  const confirmDeleteUser = (userId: number) => {
    setDeleteUserId(userId);
    setShowDeleteDialog(true);
  };
  
  // Hàm xóa người dùng
  const deleteUser = async () => {
    if (!deleteUserId) return;
    
    try {
      await axios.delete(`/api/admin/users/${deleteUserId}`);
      
      toast({
        title: "Thành công",
        description: "Đã xóa người dùng thành công."
      });
      
      // Tải lại danh sách người dùng
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa người dùng. Vui lòng thử lại sau."
      });
    } finally {
      setShowDeleteDialog(false);
      setDeleteUserId(null);
    }
  };
  
  // Hiển thị trạng thái người dùng
  const renderUserStatus = (isActive: boolean) => {
    if (isActive === true) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
          <CheckCircle className="h-3 w-3 mr-1" />
          Hoạt động
        </Badge>
      );
    } else if (isActive === false) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
          <XCircle className="h-3 w-3 mr-1" />
          Bị khóa
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
        <AlertCircle className="h-3 w-3 mr-1" />
        Không xác định
      </Badge>
    );
  };
  
  // Hiển thị role người dùng
  const getUserRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'vendor':
        return 'Nhà cung cấp';
      case 'user':
        return 'Khách hàng';
      default:
        return role;
    }
  };
  
  // Render danh sách người dùng
  const renderUsersList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      );
    }
    
    if (users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Không tìm thấy người dùng</h3>
          <p className="text-muted-foreground mt-2">
            Không có người dùng nào phù hợp với tiêu chí tìm kiếm hoặc lọc.
          </p>
        </div>
      );
    }
    
    return (
      <>
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.fullName || user.username}</div>
                      <div className="text-xs text-gray-500">{getUserRoleDisplay(user.role)}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email || 'N/A'}</TableCell>
                <TableCell>{user.phone || 'N/A'}</TableCell>
                <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                <TableCell>{renderUserStatus(user.isActive)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/admin/users/edit/${user.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => confirmDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa người dùng
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
                  // Hiển thị 5 trang gần nhất và trang đầu/cuối
                  if (
                    i === 0 || 
                    i === totalPages - 1 || 
                    (i >= currentPage - 2 && i <= currentPage + 2)
                  ) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    (i === 1 && currentPage > 3) || 
                    (i === totalPages - 2 && currentPage < totalPages - 3)
                  ) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    );
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>{t('admin.users')} | Yapee Admin</title>
      </Helmet>
      
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('admin.users')}</h1>
          <Button onClick={() => navigate('/admin/users/add')}>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>Tìm kiếm</Button>
        </div>
        
        <Tabs defaultValue="all-users" value={activeRole} onValueChange={handleTabChange}>
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
                {renderUsersList()}
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
                      <div className="text-3xl font-bold mt-2">{userStats.customers}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Khách hàng mới (30 ngày)</div>
                        <UserPlus className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-3xl font-bold mt-2">-</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Khách hàng đang hoạt động</div>
                        <UsersIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-3xl font-bold mt-2">-</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Đơn hàng đầu tiên</div>
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-3xl font-bold mt-2">-</div>
                    </CardContent>
                  </Card>
                </div>
                {renderUsersList()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <CardTitle>Quản trị viên</CardTitle>
                <CardDescription>
                  Quản lý tài khoản quản trị viên
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderUsersList()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vendors">
            <Card>
              <CardHeader>
                <CardTitle>Nhà cung cấp</CardTitle>
                <CardDescription>
                  Quản lý tài khoản nhà cung cấp
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderUsersList()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog xác nhận xóa người dùng */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Người dùng này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}