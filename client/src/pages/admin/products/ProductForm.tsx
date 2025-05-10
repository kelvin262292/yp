import React, { useState, useEffect } from 'react';
import { Link, useLocation, useRoute, useParams } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ChevronLeft, 
  Save, 
  Trash2,
  Upload,
  X,
  Plus,
  Info,
  Loader2
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Categories and brands will be fetched from the API

// Form validation schema
const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameZh: z.string().min(1, 'Chinese name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionZh: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  originalPrice: z.coerce.number().min(0, 'Original price must be a positive number'),
  stock: z.coerce.number().min(0, 'Stock must be a positive number'),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
  isFeatured: z.boolean().default(false),
  isHotDeal: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isYapeeMall: z.boolean().default(false),
  freeShipping: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ImageUploadProps {
  onImageAdd: (files: FileList) => void;
  images: string[];
  onRemove: (index: number) => void;
  mainImage: number;
  setMainImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageAdd, 
  images, 
  onRemove, 
  mainImage, 
  setMainImage 
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageAdd(e.target.files);
      e.target.value = ''; // Reset the input
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">Product Images</h3>
        <Badge variant="outline" className="text-xs">
          {images.length}/10
        </Badge>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`relative border rounded-md overflow-hidden group ${mainImage === index ? 'ring-2 ring-primary' : ''}`}
          >
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-1">
                {mainImage !== index && (
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-7 w-7"
                    onClick={() => setMainImage(index)}
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </Button>
                )}
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="h-7 w-7"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            {mainImage === index && (
              <Badge className="absolute top-1 left-1 text-[10px]">Main</Badge>
            )}
          </div>
        ))}
        
        {images.length < 10 && (
          <button
            type="button"
            className="border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 hover:border-primary transition-colors text-gray-500 hover:text-primary"
            onClick={handleAddClick}
          >
            <Upload size={20} />
            <span className="text-xs mt-1">Upload</span>
          </button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      
      <p className="text-xs text-gray-500">
        Upload up to 10 images. First image will be the main product image.
      </p>
    </div>
  );
};

interface VariantRowProps {
  index: number;
  variant: ProductVariant;
  onUpdate: (index: number, variant: ProductVariant) => void;
  onRemove: (index: number) => void;
  attributeOptions: { color: string[], size: string[] };
}

interface ProductVariant {
  id?: number;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
}

const VariantRow: React.FC<VariantRowProps> = ({ 
  index, 
  variant, 
  onUpdate, 
  onRemove,
  attributeOptions
}) => {
  const handleChange = (field: keyof ProductVariant, value: string | number) => {
    onUpdate(index, { ...variant, [field]: value });
  };
  
  return (
    <tr className="border-b">
      <td className="py-2.5 px-2">
        <Select 
          value={variant.color} 
          onValueChange={(value) => handleChange('color', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            {attributeOptions.color.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="py-2.5 px-2">
        <Select 
          value={variant.size} 
          onValueChange={(value) => handleChange('size', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {attributeOptions.size.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="py-2.5 px-2">
        <Input 
          value={variant.sku} 
          onChange={(e) => handleChange('sku', e.target.value)}
          placeholder="SKU"
        />
      </td>
      <td className="py-2.5 px-2">
        <Input 
          type="number" 
          value={variant.price === 0 ? '' : variant.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          placeholder="Price"
        />
      </td>
      <td className="py-2.5 px-2">
        <Input 
          type="number" 
          value={variant.stock === 0 ? '' : variant.stock}
          onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
          placeholder="Stock"
        />
      </td>
      <td className="py-2.5 px-2 text-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onRemove(index)}
        >
          <Trash2 size={16} />
        </Button>
      </td>
    </tr>
  );
};

const ProductForm = () => {
  const [location, navigate] = useLocation();
  const { t } = useLanguage();
  const isEditMode = location.includes('/edit');
  const productId = isEditMode ? parseInt(location.split('/').pop() || '0') : 0;
  
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=240&h=240',
  ]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [showVariants, setShowVariants] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  
  // Sample attribute options
  const attributeOptions = {
    color: ['Black', 'White', 'Blue', 'Red', 'Green'],
    size: ['S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42'],
  };
  
  // Initialize form with default values for new product or fetched data for edit
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: isEditMode ? 'Smartphone X Pro 128GB' : '',
      nameEn: isEditMode ? 'Smartphone X Pro 128GB' : '',
      nameZh: isEditMode ? 'Smartphone X Pro 128GB 智能手机' : '',
      slug: isEditMode ? 'smartphone-x-pro-128gb' : '',
      description: isEditMode ? 'Điện thoại thông minh cao cấp với hiệu năng mạnh mẽ' : '',
      descriptionEn: isEditMode ? 'Premium smartphone with powerful performance' : '',
      descriptionZh: isEditMode ? '高性能高端智能手机' : '',
      price: isEditMode ? 2990000 : 0,
      originalPrice: isEditMode ? 4990000 : 0,
      stock: isEditMode ? 24 : 0,
      categoryId: isEditMode ? '1' : '',
      brandId: isEditMode ? '1' : '',
      isFeatured: isEditMode ? true : false,
      isHotDeal: isEditMode ? true : false,
      isBestSeller: isEditMode ? false : false,
      isNewArrival: isEditMode ? false : false,
      isYapeeMall: isEditMode ? true : false,
      freeShipping: isEditMode ? true : false,
    },
  });
  
  const handleImageAdd = (files: FileList) => {
    // In a real application, we would upload these to a server and receive URLs
    // For this example, we'll create local object URLs
    const newImages: string[] = [];
    
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      newImages.push(url);
    });
    
    setImages([...images, ...newImages].slice(0, 10));
  };
  
  const handleImageRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    // Update main image index if needed
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };
  
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  // Get query client for cache invalidation
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get categories data for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 60000, // 1 minute
  });
  
  // Get brands data for dropdown
  const { data: brandsData } = useQuery({
    queryKey: ['/api/brands'],
    staleTime: 60000, // 1 minute
  });
  
  // Add product mutation
  const createProductMutation = useMutation({
    mutationFn: (productData: any) => {
      return apiRequest('/api/admin/products', {
        method: 'POST',
        data: productData,
      });
    },
    onSuccess: () => {
      // Invalidate products cache
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được tạo thành công",
      });
      navigate('/admin/products');
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });
  
  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: (data: { id: number; productData: any }) => {
      return apiRequest(`/api/admin/products/${data.id}`, {
        method: 'PUT',
        data: data.productData,
      });
    },
    onSuccess: () => {
      // Invalidate products cache
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được cập nhật thành công",
      });
      navigate('/admin/products');
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (values: ProductFormValues) => {
    // Prepare product data
    const productData = {
      ...values,
      slug: generateSlug(values.name),
      imageUrl: images.length > 0 ? images[mainImageIndex] : '',
      categoryId: values.categoryId ? parseInt(values.categoryId) : null,
      brandId: values.brandId ? parseInt(values.brandId) : null,
    };
    
    if (isEditMode && productId) {
      // Update existing product
      updateProductMutation.mutate({ 
        id: parseInt(productId),
        productData
      });
    } else {
      // Create new product
      createProductMutation.mutate(productData);
    }
  };
  
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        color: '',
        size: '',
        sku: '',
        price: form.getValues('price'),
        stock: 0,
      },
    ]);
  };
  
  const handleUpdateVariant = (index: number, updatedVariant: ProductVariant) => {
    const newVariants = [...variants];
    newVariants[index] = updatedVariant;
    setVariants(newVariants);
  };
  
  const handleRemoveVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };
  
  const handleLeave = () => {
    setLeaveConfirmOpen(false);
    navigate('/admin/products');
  };
  
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setLeaveConfirmOpen(true)}
          >
            <ChevronLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? t('admin.editProduct') : t('admin.addProduct')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setLeaveConfirmOpen(true)}
          >
            {t('admin.cancel')}
          </Button>
          <Button
            variant="default"
            onClick={form.handleSubmit(onSubmit)}
          >
            <Save size={16} className="mr-2" />
            {t('admin.saveProduct')}
          </Button>
        </div>
      </div>
      
      <Form {...form}>
        <form className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.basicInformation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="vi">
                    <TabsList className="mb-4">
                      <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="zh">中文</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="vi" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.productName')} (VI) *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Tên sản phẩm"
                                onChange={(e) => {
                                  field.onChange(e);
                                  // If slug is empty, generate from name
                                  if (!form.getValues('slug')) {
                                    form.setValue('slug', generateSlug(e.target.value));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.description')} (VI)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Mô tả sản phẩm" 
                                rows={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="en" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nameEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.productName')} (EN) *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Product name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="descriptionEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.description')} (EN)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Product description" 
                                rows={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="zh" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nameZh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.productName')} (ZH) *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="产品名称" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="descriptionZh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.description')} (ZH)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="产品描述" 
                                rows={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.slug')} *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="product-slug" />
                        </FormControl>
                        <FormDescription>
                          This will be used for the product URL. Use lowercase letters, numbers, and hyphens only.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.category')} *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoriesData && categoriesData.length > 0 ? (
                                categoriesData.map((category: any) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {language === 'vi' ? category.name : 
                                     language === 'en' ? category.nameEn : 
                                     category.nameZh}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="" disabled>
                                  {t('admin.noCategories')}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.brand')} *</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.images')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload 
                    onImageAdd={handleImageAdd}
                    images={images}
                    onRemove={handleImageRemove}
                    mainImage={mainImageIndex}
                    setMainImage={setMainImageIndex}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.pricingInventory')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.price')} *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="0"
                              disabled={variants.length > 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.originalPrice')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="0"
                              disabled={variants.length > 0}
                            />
                          </FormControl>
                          <FormDescription>
                            {t('admin.originalPriceDescription')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.stock')} *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="0"
                              disabled={variants.length > 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">{t('admin.productVariants')}</h3>
                      <p className="text-sm text-gray-500">
                        {t('admin.productVariantsDescription')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{t('admin.enableVariants')}</span>
                      <Switch
                        checked={showVariants}
                        onCheckedChange={setShowVariants}
                      />
                    </div>
                  </div>
                  
                  {showVariants && (
                    <div className="border rounded-md mt-4">
                      <div className="p-3 border-b bg-gray-50">
                        <h3 className="font-medium">{t('admin.variants')}</h3>
                      </div>
                      <div className="p-3 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2.5 px-2 font-medium">Color</th>
                              <th className="text-left py-2.5 px-2 font-medium">Size</th>
                              <th className="text-left py-2.5 px-2 font-medium">SKU</th>
                              <th className="text-left py-2.5 px-2 font-medium">Price</th>
                              <th className="text-left py-2.5 px-2 font-medium">Stock</th>
                              <th className="text-center py-2.5 px-2 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variants.map((variant, index) => (
                              <VariantRow
                                key={index}
                                index={index}
                                variant={variant}
                                onUpdate={handleUpdateVariant}
                                onRemove={handleRemoveVariant}
                                attributeOptions={attributeOptions}
                              />
                            ))}
                            {variants.length === 0 && (
                              <tr>
                                <td colSpan={6} className="py-4 text-center text-gray-500">
                                  No variants added yet. Add your first variant below.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        <div className="mt-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddVariant}
                          >
                            <Plus size={14} className="mr-1" />
                            Add Variant
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.status')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="freeShipping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>{t('admin.freeShipping')}</FormLabel>
                          <FormDescription>
                            {t('admin.freeShippingDescription')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.productFlags')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isYapeeMall"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <FormLabel>{t('admin.yapeeMall')}</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info size={14} className="text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>100% Authentic Brands / 100% Thương hiệu chính hãng / 100%正品品牌</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormDescription>
                            {t('admin.yapeeMallDescription')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>{t('admin.featured')}</FormLabel>
                          <FormDescription>
                            {t('admin.featuredDescription')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isHotDeal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>{t('admin.hotDeal')}</FormLabel>
                          <FormDescription>
                            {t('admin.hotDealDescription')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isBestSeller"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>{t('admin.bestSeller')}</FormLabel>
                          <FormDescription>
                            {t('admin.bestSellerDescription')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isNewArrival"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>{t('admin.newArrival')}</FormLabel>
                          <FormDescription>
                            {t('admin.newArrivalDescription')}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
      
      {/* Leave confirmation dialog */}
      <AlertDialog open={leaveConfirmOpen} onOpenChange={setLeaveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.unsavedChanges')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.unsavedChangesDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave}>
              {t('admin.leave')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ProductForm;