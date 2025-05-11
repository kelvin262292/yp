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
import {
  MegaphoneIcon,
  TagIcon,
  ZapIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ArrowUpDown,
  Edit,
  Trash2,
  FileBarChart,
  ClipboardList,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Spinner from "@/components/ui/spinner";
import { format, isAfter, isBefore } from "date-fns";
import { useLocation } from "wouter";

// Types
type Campaign = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  type: string;
  bannerUrl?: string;
  targetAudience?: string;
  discountType?: string;
  discountValue?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  discountCode?: string;
};

type DiscountCode = {
  id: number;
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  isOneTimeUse: boolean;
};

type FlashDeal = {
  id: number;
  productId: number;
  startDate: string;
  endDate: string;
  totalStock: number;
  soldCount: number;
  product?: {
    name: string;
    imageUrl: string;
    price: number;
    originalPrice?: number;
  };
};

// Campaign Components
const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    fetchCampaigns();
  }, [typeFilter, statusFilter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      
      const response = await axios.get('/api/admin/campaigns', { params });
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách chiến dịch. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCampaigns();
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/campaigns/${id}`);
      toast({
        title: "Thành công",
        description: "Chiến dịch đã được xóa thành công.",
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa chiến dịch. Vui lòng thử lại sau.",
      });
    }
  };

  const getCampaignStatus = (campaign: Campaign) => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    
    if (!campaign.isActive) return "inactive";
    if (isBefore(now, startDate)) return "scheduled";
    if (isAfter(now, endDate)) return "expired";
    return "active";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Đang chạy</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">Lên lịch</Badge>;
      case "expired":
        return <Badge className="bg-gray-500">Đã kết thúc</Badge>;
      case "inactive":
        return <Badge className="bg-red-500">Không hoạt động</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm chiến dịch..."
              className="pl-8 w-full md:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Loại chiến dịch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả loại</SelectItem>
              <SelectItem value="promotion">Khuyến mãi</SelectItem>
              <SelectItem value="seasonal">Theo mùa</SelectItem>
              <SelectItem value="holiday">Ngày lễ</SelectItem>
              <SelectItem value="flash_sale">Flash Sale</SelectItem>
              <SelectItem value="clearance">Xả hàng</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang chạy</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => navigate("/admin/marketing/campaigns/new")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Thêm chiến dịch
        </Button>
      </div>
      
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-xl">Danh sách chiến dịch</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MegaphoneIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Không có chiến dịch nào</h3>
              <p className="text-muted-foreground mt-2">
                Bạn chưa tạo chiến dịch nào. Hãy tạo chiến dịch đầu tiên của mình.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên chiến dịch</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      {campaign.type === "promotion" && "Khuyến mãi"}
                      {campaign.type === "seasonal" && "Theo mùa"}
                      {campaign.type === "holiday" && "Ngày lễ"}
                      {campaign.type === "flash_sale" && "Flash Sale"}
                      {campaign.type === "clearance" && "Xả hàng"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Bắt đầu: {format(new Date(campaign.startDate), "dd/MM/yyyy")}</span>
                        <span className="text-xs text-muted-foreground">Kết thúc: {format(new Date(campaign.endDate), "dd/MM/yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(getCampaignStatus(campaign))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/marketing/campaigns/${campaign.id}`)}>
                            <FileBarChart className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/marketing/campaigns/edit/${campaign.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// DiscountCodes Component
const DiscountCodesList = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mã giảm giá</h2>
        <Button onClick={() => {}}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Thêm mã giảm giá
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TagIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Tính năng đang phát triển</h3>
            <p className="text-muted-foreground mt-2">
              Tính năng quản lý mã giảm giá đang được phát triển và sẽ có sẵn trong phiên bản tới.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// FlashDeals Component
const FlashDealsList = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Flash Deals</h2>
        <Button onClick={() => {}}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Thêm Flash Deal
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ZapIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Tính năng đang phát triển</h3>
            <p className="text-muted-foreground mt-2">
              Tính năng quản lý Flash Deals đang được phát triển và sẽ có sẵn trong phiên bản tới.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Marketing Dashboard Main Component
const MarketingDashboard = () => {
  const [activeTab, setActiveTab] = useState("campaigns");
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <AdminLayout>
      <Helmet>
        <title>Marketing | Yapee Admin</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
            <p className="text-muted-foreground">Quản lý các chiến dịch marketing và khuyến mãi</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="campaigns">
              <MegaphoneIcon className="h-4 w-4 mr-2" />
              Chiến dịch
            </TabsTrigger>
            <TabsTrigger value="discount-codes">
              <TagIcon className="h-4 w-4 mr-2" />
              Mã giảm giá
            </TabsTrigger>
            <TabsTrigger value="flash-deals">
              <ZapIcon className="h-4 w-4 mr-2" />
              Flash Deals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="mt-0">
            <CampaignsList />
          </TabsContent>
          
          <TabsContent value="discount-codes" className="mt-0">
            <DiscountCodesList />
          </TabsContent>
          
          <TabsContent value="flash-deals" className="mt-0">
            <FlashDealsList />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default MarketingDashboard;