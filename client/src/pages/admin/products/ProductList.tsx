import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// Sample product data for demonstration
const products = [
  {
    id: 1,
    name: 'Smartphone X Pro 128GB',
    nameEn: 'Smartphone X Pro 128GB',
    nameZh: 'Smartphone X Pro 128GB 智能手机',
    slug: 'smartphone-x-pro-128gb',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=240&h=240',
    price: 2990000,
    originalPrice: 4990000,
    discountPercentage: 40,
    stock: 24,
    category: 'Điện thoại',
    isFeatured: true,
    isHotDeal: true,
    isBestSeller: false,
    isNewArrival: false,
    isYapeeMall: true,
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    nameEn: 'Smart Watch Series 5',
    nameZh: 'Smart Watch Series 5 智能手表',
    slug: 'smart-watch-series-5',
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=240&h=240',
    price: 1490000,
    originalPrice: 2190000,
    discountPercentage: 30,
    stock: 56,
    category: 'Điện tử',
    isFeatured: true,
    isHotDeal: true,
    isBestSeller: false,
    isNewArrival: false,
    isYapeeMall: false,
  },
  {
    id: 3,
    name: 'Wireless Earbuds Pro',
    nameEn: 'Wireless Earbuds Pro',
    nameZh: 'Wireless Earbuds Pro 无线耳机',
    slug: 'wireless-earbuds-pro',
    imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=240&h=240',
    price: 790000,
    originalPrice: 1590000,
    discountPercentage: 50,
    stock: 89,
    category: 'Điện tử',
    isFeatured: true,
    isHotDeal: true,
    isBestSeller: true,
    isNewArrival: false,
    isYapeeMall: true,
  },
  {
    id: 4,
    name: 'Laptop UltraBook Slim',
    nameEn: 'Laptop UltraBook Slim',
    nameZh: 'Laptop UltraBook Slim 超薄笔记本电脑',
    slug: 'laptop-ultrabook-slim',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=240&h=240',
    price: 12990000,
    originalPrice: 19990000,
    discountPercentage: 35,
    stock: 12,
    category: 'Điện tử',
    isFeatured: true,
    isHotDeal: true,
    isBestSeller: false,
    isNewArrival: false,
    isYapeeMall: false,
  },
  {
    id: 5,
    name: 'Digital Camera Pro X',
    nameEn: 'Digital Camera Pro X',
    nameZh: 'Digital Camera Pro X 数码相机',
    slug: 'digital-camera-pro-x',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=240&h=240',
    price: 8990000,
    originalPrice: 11990000,
    discountPercentage: 25,
    stock: 7,
    category: 'Điện tử',
    isFeatured: true,
    isHotDeal: true,
    isBestSeller: false,
    isNewArrival: false,
    isYapeeMall: true,
  },
];

// Currency formatter
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductList = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
    }
    setAllSelected(!allSelected);
  };

  // Handle individual checkbox
  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
      setAllSelected(false);
    } else {
      setSelectedProducts([...selectedProducts, id]);
      if (selectedProducts.length + 1 === products.length) {
        setAllSelected(true);
      }
    }
  };

  // Handle delete dialog
  const openDeleteDialog = (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Here we would call API to delete the product
    console.log(`Deleting product with ID: ${productToDelete}`);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.products')}</h1>
          <p className="text-gray-500 mt-1">{t('admin.productsDescription')}</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="w-full md:w-auto">
            <Plus size={16} className="mr-2" />
            {t('admin.addProduct')}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t('admin.searchProducts')}
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-2" />
              {t('admin.filters')}
            </Button>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="phones">Điện thoại</SelectItem>
                    <SelectItem value="electronics">Điện tử</SelectItem>
                    <SelectItem value="fashion">Thời trang</SelectItem>
                    <SelectItem value="beauty">Làm đẹp</SelectItem>
                    <SelectItem value="home">Đồ gia dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="in-stock">In stock</SelectItem>
                    <SelectItem value="low-stock">Low stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.selectFlag')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All products</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="hot-deal">Hot deal</SelectItem>
                    <SelectItem value="best-seller">Best seller</SelectItem>
                    <SelectItem value="new-arrival">New arrival</SelectItem>
                    <SelectItem value="yapee-mall">YapeeMall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('admin.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                    <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                    <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
                    <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2 text-left">
                    <Checkbox 
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-2 text-left">{t('admin.productName')}</th>
                  <th className="py-3 px-2 text-left">{t('admin.category')}</th>
                  <th className="py-3 px-2 text-right">{t('admin.price')}</th>
                  <th className="py-3 px-2 text-right">{t('admin.stock')}</th>
                  <th className="py-3 px-2 text-center">{t('admin.status')}</th>
                  <th className="py-3 px-2 text-right">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">
                            <Link href={`/admin/products/${product.id}`} className="hover:text-primary">
                              {product.name}
                            </Link>
                          </p>
                          <p className="text-xs text-gray-500">SKU: PRD-{product.id.toString().padStart(5, '0')}</p>
                          {product.isYapeeMall && (
                            <Badge 
                              variant="outline" 
                              className="mt-1 border-primary text-primary text-[10px] py-0"
                            >
                              YapeeMall
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant="secondary" className="font-normal">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div>
                        <p className="font-medium">{formatPrice(product.price)}</p>
                        <p className="text-xs text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {product.stock > 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Out of Stock
                          </Badge>
                        )}
                        {product.isFeatured && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Featured
                          </Badge>
                        )}
                        {product.isHotDeal && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            Hot Deal
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}`} className="cursor-pointer">
                                <Edit size={14} className="mr-2" />
                                {t('admin.edit')}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/product/${product.slug}`} target="_blank" className="cursor-pointer">
                                <Eye size={14} className="mr-2" />
                                {t('admin.view')}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Copy size={14} className="mr-2" />
                              {t('admin.duplicate')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer" 
                              onClick={() => openDeleteDialog(product.id)}
                            >
                              <Trash2 size={14} className="mr-2" />
                              {t('admin.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              {t('admin.showing')} 1-{products.length} {t('admin.of')} {products.length} {t('admin.products')}
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                {t('admin.previous')}
              </Button>
              <Button variant="outline" size="sm" disabled>
                {t('admin.next')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.deleteProductConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
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

const Eye = ({ size, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

export default ProductList;