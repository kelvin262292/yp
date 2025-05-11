import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import {
  PlusCircle,
  Search,
  Edit,
  Trash,
  Loader2,
  Tag,
  FolderTree,
  ChevronDown,
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

interface Category {
  id: number;
  name: string;
  nameEn?: string;
  nameZh?: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  parentId?: number | null;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

const CategoryList = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', '/api/admin/categories');

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch categories',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.nameEn && category.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (category.nameZh && category.nameZh.toLowerCase().includes(searchTerm.toLowerCase())) ||
          category.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const confirmDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await apiRequest('DELETE', `/api/admin/categories/${categoryToDelete.id}`);

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Category has been deleted',
        });
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to delete category',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.categories.title')}</h1>
        <Button onClick={() => navigate('/admin/categories/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('admin.categories.addNew')}
        </Button>
      </div>

      <div className="bg-white rounded-md shadow">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder={t('admin.categories.search')}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>{t('admin.categories.name')}</TableHead>
                <TableHead>{t('admin.categories.slug')}</TableHead>
                <TableHead className="text-center">{t('admin.categories.products')}</TableHead>
                <TableHead className="text-center">{t('admin.categories.status')}</TableHead>
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
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-20 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-9 bg-gray-200 animate-pulse rounded-md w-20 ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <FolderTree className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      {searchTerm
                        ? t('admin.categories.noResults')
                        : t('admin.categories.noCategories')}
                    </p>
                    {!searchTerm && (
                      <Button
                        variant="link"
                        onClick={() => navigate('/admin/categories/new')}
                      >
                        {t('admin.categories.addFirst')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {category.imageUrl ? (
                          <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                              }}
                            />
                          </div>
                        ) : (
                          <Tag className="h-4 w-4 text-gray-500" />
                        )}
                        <div>
                          <div className="font-medium">{category.name}</div>
                          {(category.nameEn || category.nameZh) && (
                            <div className="text-xs text-gray-500">
                              {category.nameEn && <span className="mr-2">{category.nameEn}</span>}
                              {category.nameZh && <span>{category.nameZh}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{category.slug}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {category.productCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={category.isActive ? 'default' : 'secondary'}
                        className={category.isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      >
                        {category.isActive ? t('admin.active') : t('admin.inactive')}
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
                          <DropdownMenuItem onClick={() => navigate(`/admin/categories/${category.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('admin.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmDelete(category)}
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
            <AlertDialogTitle>{t('admin.categories.deleteCategory')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.categories.deleteConfirmation')}
              <br />
              <span className="font-medium">{categoryToDelete?.name}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCategory}
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

export default CategoryList;