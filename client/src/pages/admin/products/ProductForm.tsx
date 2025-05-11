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
  Loader2,
  Check,
  AlertTriangle
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
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  imageUrl: z.string().url('Please enter a valid image URL'),
  isActive: z.boolean().default(true),
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
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const { match, params } = useRoute('/admin/products/:id/edit');
  const isEditing = match && params?.id !== 'new';
  
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=240&h=240',
  ]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [showVariants, setShowVariants] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeTab, setActiveTab] = useState('general');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Sample attribute options
  const attributeOptions = {
    color: ['Black', 'White', 'Blue', 'Red', 'Green'],
    size: ['S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42'],
  };
  
  // Initialize form with default values for new product or fetched data for edit
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: isEditing ? 'Smartphone X Pro 128GB' : '',
      nameEn: isEditing ? 'Smartphone X Pro 128GB' : '',
      nameZh: isEditing ? 'Smartphone X Pro 128GB 智能手机' : '',
      slug: isEditing ? 'smartphone-x-pro-128gb' : '',
      description: isEditing ? 'Điện thoại thông minh cao cấp với hiệu năng mạnh mẽ' : '',
      descriptionEn: isEditing ? 'Premium smartphone with powerful performance' : '',
      descriptionZh: isEditing ? '高性能高端智能手机' : '',
      price: isEditing ? 2990000 : 0,
      originalPrice: isEditing ? 4990000 : null,
      stock: isEditing ? 24 : 0,
      categoryId: isEditing ? '1' : null,
      brandId: isEditing ? '1' : null,
      isFeatured: isEditing ? true : false,
      isHotDeal: isEditing ? true : false,
      isBestSeller: isEditing ? false : false,
      isNewArrival: isEditing ? false : false,
      isYapeeMall: isEditing ? true : false,
      freeShipping: isEditing ? true : false,
      imageUrl: isEditing ? 'https://example.com/image.jpg' : '',
      isActive: isEditing ? true : false,
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
  
  const onSubmit = async (values: ProductFormValues) => {
    try {
      setSavingStatus('saving');
      
      // Prepare product data
      const productData = {
        ...values,
        slug: generateSlug(values.name),
        imageUrl: images.length > 0 ? images[mainImageIndex] : '',
        categoryId: values.categoryId ? parseInt(values.categoryId) : null,
        brandId: values.brandId ? parseInt(values.brandId) : null,
      };
      
      if (isEditing && params.id) {
        // Update existing product
        updateProductMutation.mutate({ 
          id: parseInt(params.id),
          productData
        });
      } else {
        // Create new product
        createProductMutation.mutate(productData);
      }
      
      setSavingStatus('success');
      toast({
        title: isEditing ? 'Product updated' : 'Product created',
        description: `${values.name} has been ${isEditing ? 'updated' : 'created'} successfully`,
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      setSavingStatus('error');
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
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
  
  // Fetch product data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories and brands
        const categoriesResponse = await apiRequest('GET', '/api/categories');
        const brandsResponse = await apiRequest('GET', '/api/brands');
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
        
        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setBrands(brandsData);
        }
        
        // If editing, fetch product data
        if (isEditing) {
          const productResponse = await apiRequest('GET', `/api/admin/products/${params.id}`);
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            
            // Reset form with product data
            form.reset({
              ...productData,
              categoryId: productData.categoryId || null,
              brandId: productData.brandId || null,
              originalPrice: productData.originalPrice || null
            });
            
            // Set image preview
            setImagePreview(productData.imageUrl);
          } else {
            toast({
              title: 'Error',
              description: 'Failed to fetch product data',
              variant: 'destructive',
            });
            navigate('/admin/products');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isEditing, params?.id, navigate, toast, form]);
  
  // Auto-generate slug from name
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name' && value.name && !form.getValues('slug')) {
        const slug = value.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        form.setValue('slug', slug);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Handle image URL change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'imageUrl' && value.imageUrl) {
        setImagePreview(value.imageUrl);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Format currency
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p>{t('admin.products.loading')}</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin/products')} 
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('admin.back')}
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? t('admin.products.editProduct') : t('admin.products.addProduct')}
          </h1>
        </div>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={savingStatus === 'saving' || savingStatus === 'success'}
          className="gap-2"
        >
          {savingStatus === 'saving' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : savingStatus === 'success' ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {savingStatus === 'saving' 
            ? t('admin.saving') 
            : savingStatus === 'success' 
              ? t('admin.saved') 
              : t('admin.save')}
        </Button>
      </div>
      
      {savingStatus === 'error' && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('admin.error')}</AlertTitle>
          <AlertDescription>
            {t('admin.products.errorSaving')}
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.products.basicInfo')}</CardTitle>
                  <CardDescription>
                    {t('admin.products.basicInfoDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="general">{t('admin.products.general')}</TabsTrigger>
                      <TabsTrigger value="localization">{t('admin.products.localization')}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="general" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.products.name')} *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={t('admin.products.namePlaceholder')} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.products.slug')}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={t('admin.products.slugPlaceholder')} 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              {t('admin.products.slugDescription')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.products.description')}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={t('admin.products.descriptionPlaceholder')} 
                                rows={5}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="localization" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nameEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.products.nameEn')}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={t('admin.products.nameEnPlaceholder')} 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="nameZh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('admin.products.nameZh')}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={t('admin.products.nameZhPlaceholder')} 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.products.pricing')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.products.price')} *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field} 
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
                          <FormLabel>{t('admin.products.originalPrice')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field} 
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : null;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            {t('admin.products.originalPriceDescription')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Discount Display */}
                  {form.watch('price') > 0 && form.watch('originalPrice') && form.watch('originalPrice') > form.watch('price') && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t('admin.products.discount')}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {Math.round(((Number(form.watch('originalPrice')) - Number(form.watch('price'))) / Number(form.watch('originalPrice')) * 100))}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">{t('admin.products.savings')}</span>
                        <span className="text-green-600 font-medium">
                          {formatCurrency(Number(form.watch('originalPrice')) - Number(form.watch('price')))}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.products.organization')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.products.category')}</FormLabel>
                          <Select
                            value={field.value?.toString() || ''}
                            onValueChange={(value) => {
                              field.onChange(value ? Number(value) : null);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('admin.products.selectCategory')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">{t('admin.products.noCategory')}</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
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
                          <FormLabel>{t('admin.products.brand')}</FormLabel>
                          <Select
                            value={field.value?.toString() || ''}
                            onValueChange={(value) => {
                              field.onChange(value ? Number(value) : null);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('admin.products.selectBrand')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">{t('admin.products.noBrand')}</SelectItem>
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
            </div>
            
            {/* Side column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.products.status')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>{t('admin.products.active')}</FormLabel>
                            <FormDescription>
                              {t('admin.products.activeDescription')}
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
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('admin.products.stock')} *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.products.image')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.products.imageUrl')} *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <div className="aspect-square rounded-md overflow-hidden border bg-gray-50">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                          onError={() => {
                            setImagePreview('/placeholder-image.jpg');
                          }}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => {
                          form.setValue('imageUrl', '');
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <FormDescription>
                    {t('admin.products.imageUrlDescription')}
                  </FormDescription>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.products.flags')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>{t('admin.products.featured')}</FormLabel>
                          <FormDescription>
                            {t('admin.products.featuredDescription')}
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
                          <FormLabel>{t('admin.products.hotDeal')}</FormLabel>
                          <FormDescription>
                            {t('admin.products.hotDealDescription')}
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
                          <FormLabel>{t('admin.products.bestSeller')}</FormLabel>
                          <FormDescription>
                            {t('admin.products.bestSellerDescription')}
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
                          <FormLabel>{t('admin.products.newArrival')}</FormLabel>
                          <FormDescription>
                            {t('admin.products.newArrivalDescription')}
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
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={savingStatus === 'saving' || savingStatus === 'success'}
              className="gap-2"
            >
              {savingStatus === 'saving' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : savingStatus === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {savingStatus === 'saving' 
                ? t('admin.saving') 
                : savingStatus === 'success' 
                  ? t('admin.saved') 
                  : t('admin.save')}
            </Button>
          </div>
        </form>
      </Form>
    </AdminLayout>
  );
};

export default ProductForm;