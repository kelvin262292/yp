import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import {
  PlusCircle,
  Search,
  Edit,
  Trash,
  ChevronDown,
  Briefcase,
  CircleSlash,
  Check,
} from 'lucide-react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Brand {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  isFeatured: boolean;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

const BrandList = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // State
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  // Fetch brands
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', '/api/admin/brands');

      if (response.ok) {
        const data = await response.json();
        setBrands(data);
        setFilteredBrands(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch brands',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter brands based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (brand.website && brand.website.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBrands(filtered);
    }
  }, [searchTerm, brands]);

  // Load brands on mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Delete brand
  const confirmDelete = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const deleteBrand = async () => {
    if (!brandToDelete) return;

    try {
      const response = await apiRequest('DELETE', `/api/admin/brands/${brandToDelete.id}`);

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Brand has been deleted',
        });
        fetchBrands();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to delete brand',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  // Toggle brand featured status
  const toggleFeatured = async (brand: Brand) => {
    try {
      const response = await apiRequest('PUT', `/api/admin/brands/${brand.id}`, {
        isFeatured: !brand.isFeatured
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Brand is now ${!brand.isFeatured ? 'featured' : 'unfeatured'}`,
        });
        fetchBrands();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to update brand',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.brands.title')}</h1>
        <Button onClick={() => navigate('/admin/brands/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('admin.brands.addNew')}
        </Button>
      </div>

      <div className="bg-white rounded-md shadow">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder={t('admin.brands.search')}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Brands table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>{t('admin.brands.name')}</TableHead>
                <TableHead>{t('admin.brands.website')}</TableHead>
                <TableHead className="text-center">{t('admin.brands.products')}</TableHead>
                <TableHead className="text-center">{t('admin.brands.featured')}</TableHead>
                <TableHead className="text-center">{t('admin.brands.status')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-10"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-40"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-32"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-10 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-10 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-20 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-9 bg-gray-200 animate-pulse rounded-md w-20 ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <Briefcase className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      {searchTerm
                        ? t('admin.brands.noResults')
                        : t('admin.brands.noBrands')}
                    </p>
                    {!searchTerm && (
                      <Button
                        variant="link"
                        onClick={() => navigate('/admin/brands/new')}
                      >
                        {t('admin.brands.addFirst')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {brand.logoUrl ? (
                          <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={brand.logoUrl}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                              }}
                            />
                          </div>
                        ) : (
                          <Briefcase className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <div className="font-medium">{brand.name}</div>
                          {brand.description && (
                            <div className="text-xs text-gray-500 truncate max-w-[250px]">
                              {brand.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {brand.website ? (
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {brand.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {brand.productCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={brand.isFeatured ? 'text-yellow-600' : 'text-gray-400'}
                        onClick={() => toggleFeatured(brand)}
                      >
                        {brand.isFeatured ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <CircleSlash className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={brand.isActive ? 'default' : 'secondary'}
                        className={brand.isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      >
                        {brand.isActive ? t('admin.active') : t('admin.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {t('admin.actions')}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/brands/${brand.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('admin.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmDelete(brand)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            {t('admin.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.brands.deleteBrand')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.brands.deleteConfirmation')}
              <br />
              <span className="font-medium">{brandToDelete?.name}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteBrand}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('admin.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default BrandList;