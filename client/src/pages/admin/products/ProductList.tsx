import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'wouter';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash, 
  ChevronDown, 
  Eye, 
  Package,
  X,
  Filter
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/common/Pagination';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
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
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  nameEn?: string;
  nameZh?: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  categoryId: number | null;
  brandId: number | null;
  category?: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface FiltersState {
  categoryId: string;
  brandId: string;
}

const ProductList = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FiltersState>({
    categoryId: '',
    brandId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy,
        sortOrder,
      });
      
      if (search) {
        queryParams.append('search', search);
      }
      
      if (filters.categoryId) {
        queryParams.append('categoryId', filters.categoryId);
      }
      
      if (filters.brandId) {
        queryParams.append('brandId', filters.brandId);
      }
      
      const response = await apiRequest('GET', `/api/admin/products?${queryParams.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        
        // Initialize filters if empty
        if (categories.length === 0) {
          setCategories(data.filters.categories);
        }
        
        if (brands.length === 0) {
          setBrands(data.filters.brands);
        }
    } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to fetch products',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    setSearch(searchValue);
    setPage(1);
  };
  
  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  // Handle filter change
  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      categoryId: '',
      brandId: '',
    });
    setSearch('');
    setSearchValue('');
    setPage(1);
  };
  
  // View product details
  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };
  
  // Delete product
  const confirmDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const response = await apiRequest('DELETE', `/api/admin/products/${selectedProduct.id}`);
      
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Product has been deleted',
        });
        
        // Refresh products list
        fetchProducts();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to delete product',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
    setDeleteDialogOpen(false);
    }
  };
  
  // Format currency
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };
  
  // Effects
  useEffect(() => {
    fetchProducts();
  }, [page, search, sortBy, sortOrder, filters]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.products.title')}</h1>
        <Button onClick={() => navigate('/admin/products/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('admin.products.addNew')}
          </Button>
      </div>

      <div className="bg-white rounded-md shadow">
        {/* Search and filters */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                type="text"
                placeholder={t('admin.products.searchPlaceholder')}
                className="pl-9"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              {t('admin.search')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="flex gap-1 items-center"
            >
              <Filter className="h-4 w-4" />
              {t('admin.filters')}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value) => handleSort(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('admin.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem value="name">{t('admin.products.name')}</SelectItem>
                <SelectItem value="price">{t('admin.products.price')}</SelectItem>
                <SelectItem value="stock">{t('admin.products.stock')}</SelectItem>
                <SelectItem value="createdAt">{t('admin.products.createdAt')}</SelectItem>
                  </SelectContent>
                </Select>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  sortOrder === 'asc' ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>
              </div>
              
        {/* Filters */}
        {filtersVisible && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium mb-1">
                  {t('admin.products.category')}
                </label>
                <Select
                  value={filters.categoryId}
                  onValueChange={(value) => handleFilterChange('categoryId', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('admin.all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('admin.all')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium mb-1">
                  {t('admin.products.brand')}
                </label>
                <Select
                  value={filters.brandId}
                  onValueChange={(value) => handleFilterChange('brandId', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('admin.all')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('admin.all')}</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={resetFilters} className="flex gap-1 items-center">
                <X className="h-4 w-4" />
                {t('admin.resetFilters')}
              </Button>
            </div>
            </div>
          )}
        
        {/* Products table */}
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead className="min-w-[250px]">{t('admin.products.name')}</TableHead>
                <TableHead>{t('admin.products.price')}</TableHead>
                <TableHead className="text-center">{t('admin.products.stock')}</TableHead>
                <TableHead>{t('admin.products.category')}</TableHead>
                <TableHead>{t('admin.products.brand')}</TableHead>
                <TableHead className="text-center">{t('admin.products.status')}</TableHead>
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
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-20"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-16 mx-auto"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-24"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-24"></div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-5 bg-gray-200 animate-pulse rounded-md w-20 mx-auto"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-9 bg-gray-200 animate-pulse rounded-md w-20 ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <Package className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      {search || filters.categoryId || filters.brandId
                        ? t('admin.products.noProductsFound')
                        : t('admin.products.noProducts')}
                    </p>
                    {search || filters.categoryId || filters.brandId ? (
                      <Button variant="link" onClick={resetFilters}>
                        {t('admin.resetFilters')}
                      </Button>
                    ) : (
                      <Button
                        variant="link"
                        onClick={() => navigate('/admin/products/new')}
                      >
                        {t('admin.products.addFirst')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium truncate max-w-[200px]">
                              {product.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate max-w-[200px]">
                            {product.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{formatCurrency(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={product.stock > 10 ? 'outline' : product.stock > 0 ? 'secondary' : 'destructive'}
                      >
                        {product.stock}
                          </Badge>
                    </TableCell>
                    <TableCell>
                      {product.category?.name || <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell>
                      {product.brand?.name || <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={product.isActive ? 'default' : 'secondary'}
                        className={product.isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      >
                        {product.isActive ? t('admin.active') : t('admin.inactive')}
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
                          <DropdownMenuItem onClick={() => viewProduct(product)}>
                            <Eye className="mr-2 h-4 w-4" />
                                {t('admin.view')}
                            </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('admin.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                            onClick={() => confirmDelete(product)}
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
          
          {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
      
      {/* View Product Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        {selectedProduct && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{t('admin.products.productDetails')}</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-500">{selectedProduct.slug}</p>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{t('admin.products.price')}:</span>
                    <span className="font-medium">{formatCurrency(selectedProduct.price)}</span>
                  </div>
                  
                  {selectedProduct.originalPrice && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{t('admin.products.originalPrice')}:</span>
                      <span className="line-through">{formatCurrency(selectedProduct.originalPrice)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{t('admin.products.stock')}:</span>
                    <span>{selectedProduct.stock}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{t('admin.products.category')}:</span>
                    <span>{selectedProduct.category?.name || '-'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{t('admin.products.brand')}:</span>
                    <span>{selectedProduct.brand?.name || '-'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{t('admin.products.rating')}:</span>
                    <span>
                      {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} {t('admin.products.reviews')})
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{t('admin.products.status')}:</span>
                    <Badge
                      variant={selectedProduct.isActive ? 'default' : 'secondary'}
                      className={selectedProduct.isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                    >
                      {selectedProduct.isActive ? t('admin.active') : t('admin.inactive')}
                    </Badge>
                  </div>
                </div>
                
                {selectedProduct.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">{t('admin.products.description')}:</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
              >
                {t('admin.close')}
              </Button>
              <Button
                onClick={() => {
                  setViewDialogOpen(false);
                  navigate(`/admin/products/${selectedProduct.id}/edit`);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                {t('admin.edit')}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.products.deleteProduct')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.products.deleteConfirmation')}
              <br />
              <span className="font-medium">{selectedProduct?.name}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteProduct}
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

export default ProductList;