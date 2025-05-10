import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Filter,
  ExternalLink,
} from "lucide-react";
import { Banner } from "@shared/schema";

const BannerList = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);

  const { data: banners, isLoading } = useQuery({
    queryKey: ["/api/banners"],
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(
        "DELETE",
        `/api/admin/banners/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({
        title: t("admin.bannerDeleted"),
        description: t("admin.bannerDeletedDescription"),
      });
      setDeleteDialogOpen(false);
      setSelectedBannerId(null);
    },
    onError: (error) => {
      toast({
        title: t("error"),
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    setSelectedBannerId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBannerId) {
      deleteMutation.mutate(selectedBannerId);
    }
  };

  const getBannerPositionText = (position: string) => {
    switch (position) {
      case "hero":
        return "Hero Banner";
      case "featured":
        return "Featured";
      case "promo":
        return "Promotion";
      case "category":
        return "Category";
      case "footer":
        return "Footer";
      default:
        return position;
    }
  };

  const getBannerPositionStyle = (position: string) => {
    switch (position) {
      case "hero":
        return "bg-blue-100 text-blue-800";
      case "featured":
        return "bg-green-100 text-green-800";
      case "promo":
        return "bg-orange-100 text-orange-800";
      case "category":
        return "bg-purple-100 text-purple-800";
      case "footer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBanners = Array.isArray(banners)
    ? banners.filter((banner: Banner) =>
        banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner.position.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <AdminLayout>
      <Helmet>
        <title>{t("admin.bannerManagement")} | Yapee Admin</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("admin.bannerManagement")}</h1>
          <Button asChild>
            <Link href="/admin/banners/new">
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.addBanner")}
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.banners")}</CardTitle>
            <CardDescription>
              {t("admin.bannerManagement")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`${t("search")}...`}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {t("admin.filters")}
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
              </div>
            ) : filteredBanners.length === 0 ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
                <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No banners found</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  {searchQuery 
                    ? "No banners match your search criteria. Try a different search term."
                    : "You haven't created any banners yet. Add your first banner to get started."}
                </p>
                {searchQuery ? (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/admin/banners/new">
                      <Plus className="h-4 w-4 mr-2" />
                      {t("admin.addBanner")}
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: 50 }}>
                        <Checkbox id="select-all" />
                      </TableHead>
                      <TableHead>Banner</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead style={{ width: 100 }}></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.map((banner: Banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <Checkbox id={`select-${banner.id}`} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {banner.imageUrl && (
                              <div className="w-12 h-12 rounded overflow-hidden border flex-shrink-0 bg-gray-50">
                                <img 
                                  src={banner.imageUrl} 
                                  alt={banner.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{banner.title}</div>
                              {banner.subtitle && (
                                <div className="text-sm text-muted-foreground line-clamp-1">{banner.subtitle}</div>
                              )}
                              {banner.link && (
                                <div className="text-xs text-blue-500 flex items-center mt-1">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  <span className="truncate max-w-[200px]">{banner.link}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBannerPositionStyle(banner.position)}`}>
                            {getBannerPositionText(banner.position)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={banner.isActive ? "success" : "secondary"}>
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {banner.priority}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {banner.startDate && (
                              <div className="whitespace-nowrap">
                                From: {format(new Date(banner.startDate), 'MMM d, yyyy')}
                              </div>
                            )}
                            {banner.endDate && (
                              <div className="whitespace-nowrap text-muted-foreground">
                                To: {format(new Date(banner.endDate), 'MMM d, yyyy')}
                              </div>
                            )}
                            {!banner.startDate && !banner.endDate && (
                              <span className="text-muted-foreground">No date limit</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/admin/banners/edit/${banner.id}`)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`/banner-preview/${banner.id}`, '_blank')}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(banner.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the banner and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default BannerList;