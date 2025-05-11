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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Users, 
  UserPlus, 
  Download, 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  ChevronUp, 
  ChevronDown, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Eye,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import { useLocation } from "wouter";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Định dạng tiền tệ VND
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
};

const CustomersList = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tab, setTab] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [customerStats, setCustomerStats] = useState({
    total: 0,
    newLast30Days: 0,
    active: 0,
    firstTimeOrders: 0
  });

  // Tải danh sách khách hàng khi component mount hoặc khi các tham số thay đổi
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, tab, sortField, sortOrder]);
  
  // Tải thống kê khách hàng
  useEffect(() => {
    fetchCustomerStats();
  }, []);

  // Hàm tải danh sách khách hàng từ API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Tạo các tham số cho API
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: 10,
        sort: sortField,
        order: sortOrder
      };
      
      // Thêm filter theo tab
      if (tab !== "all") {
        params.filter = tab;
      }
      
      // Thêm tham số tìm kiếm nếu có
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Gọi API để lấy danh sách khách hàng
      const response = await axios.get('/api/admin/customers', { params });
      
      setCustomers(response.data.customers);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.totalPages);
      
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách khách hàng. Vui lòng thử lại sau."
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm tải thống kê khách hàng
  const fetchCustomerStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats/customers/metrics');
      
      setCustomerStats({
        total: response.data.total || 0,
        newLast30Days: response.data.newLast30Days || 0,
        active: response.data.active || 0,
        firstTimeOrders: response.data.firstTimeOrders || 0
      });
    } catch (error) {
      console.error('Error fetching customer stats:', error);
    }
  };
  
  // Hàm tìm kiếm khách hàng
  const handleSearch = () => {
    setCurrentPage(1);
    fetchCustomers();
  };
  
  // Hàm xử lý thay đổi sắp xếp
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  // Hàm mở dialog xác nhận xóa khách hàng
  const confirmDeleteCustomer = (customerId: number) => {
    setDeleteCustomerId(customerId);
    setShowDeleteDialog(true);
  };
  
  // Hàm xóa khách hàng
  const deleteCustomer = async () => {
    if (!deleteCustomerId) return;
    
    try {
      await axios.delete(`/api/admin/customers/${deleteCustomerId}`);
      
      toast({
        title: "Thành công",
        description: "Đã xóa khách hàng thành công."
      });
      
      // Tải lại danh sách khách hàng
      fetchCustomers();
      // Cập nhật thống kê
      fetchCustomerStats();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa khách hàng. Vui lòng thử lại sau."
      });
    } finally {
      setShowDeleteDialog(false);
      setDeleteCustomerId(null);
    }
  };
  
  // Hiển thị icon sắp xếp
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };
  
  // Render danh sách khách hàng
  const renderCustomersList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      );
    }
    
    if (customers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Không tìm thấy khách hàng</h3>
          <p className="text-muted-foreground mt-2">
            Không có khách hàng nào phù hợp với tiêu chí tìm kiếm hoặc lọc.
          </p>
        </div>
      );
    }
    
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Khách hàng</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('orderCount')}
              >
                <div className="flex items-center">
                  Đơn hàng
                  {renderSortIcon('orderCount')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('totalSpent')}
              >
                <div className="flex items-center">
                  Tổng chi tiêu
                  {renderSortIcon('totalSpent')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Ngày tham gia
                  {renderSortIcon('createdAt')}
                </div>
              </TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback>{customer.fullName?.charAt(0) || customer.username?.charAt(0) || 'C'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.fullName || customer.username}</div>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="flex items-center text-xs text-gray-500">
                          <Mail className="h-3 w-3 mr-1" /> {customer.email || 'N/A'}
                        </span>
                        <span className="flex items-center text-xs text-gray-500">
                          <Phone className="h-3 w-3 mr-1" /> {customer.phone || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{customer.orderCount || 0}</span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(customer.totalSpent || 0)}</TableCell>
                <TableCell>{customer.createdAt ? format(new Date(customer.createdAt), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={customer.isActive ? "success" : "destructive"}>
                    {customer.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/admin/customers/${customer.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/admin/customers/edit/${customer.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => confirmDeleteCustomer(customer.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa khách hàng
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
        <title>{t('admin.customers')} | Yapee Admin</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('admin.customers')}</h1>
            <p className="text-muted-foreground">Quản lý và phân tích khách hàng</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchCustomers()}>
              <Users className="h-4 w-4 mr-2" />
              Làm mới
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Xuất danh sách
            </Button>
            <Button onClick={() => navigate('/admin/customers/add')}>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">Tổng khách hàng</div>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="text-3xl font-bold mt-2">{customerStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">Khách hàng mới (30 ngày)</div>
                <UserPlus className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold mt-2">{customerStats.newLast30Days}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">Khách hàng đang hoạt động</div>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold mt-2">{customerStats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">Đơn hàng đầu tiên</div>
                <ShoppingBag className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-3xl font-bold mt-2">{customerStats.firstTimeOrders}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Tìm kiếm khách hàng theo tên, email, số điện thoại..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>Tìm kiếm</Button>
        </div>

        <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">Tất cả khách hàng</TabsTrigger>
            <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
            <TabsTrigger value="inactive">Không hoạt động</TabsTrigger>
            <TabsTrigger value="new">Mới đăng ký</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý khách hàng</CardTitle>
                <CardDescription>
                  Danh sách tất cả khách hàng của hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCustomersList()}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="active" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Khách hàng đang hoạt động</CardTitle>
                <CardDescription>
                  Danh sách khách hàng đang hoạt động trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Đang cập nhật</AlertTitle>
                  <AlertDescription>
                    Tính năng lọc khách hàng theo trạng thái đang được cập nhật.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inactive" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Khách hàng không hoạt động</CardTitle>
                <CardDescription>
                  Danh sách khách hàng không hoạt động trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Đang cập nhật</AlertTitle>
                  <AlertDescription>
                    Tính năng lọc khách hàng theo trạng thái đang được cập nhật.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="new" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {renderCustomersList()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog xác nhận xóa khách hàng */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Khách hàng này sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCustomer} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default CustomersList;