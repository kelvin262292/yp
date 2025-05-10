import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  FolderPlus,
  FolderX,
  Folder
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Sample category data for demonstration
const categoryData = [
  {
    id: 1,
    name: 'Điện thoại',
    nameEn: 'Phones',
    nameZh: '手机',
    slug: 'dien-thoai',
    icon: '📱',
    parentId: null,
    children: [
      { 
        id: 6, 
        name: 'Điện thoại Android', 
        nameEn: 'Android Phones',
        nameZh: '安卓手机',
        slug: 'dien-thoai-android', 
        icon: '📱', 
        parentId: 1,
        productCount: 47
      },
      { 
        id: 7, 
        name: 'iPhone', 
        nameEn: 'iPhone',
        nameZh: 'iPhone',
        slug: 'iphone', 
        icon: '📱', 
        parentId: 1,
        productCount: 26
      }
    ],
    productCount: 73
  },
  {
    id: 2,
    name: 'Điện tử',
    nameEn: 'Electronics',
    nameZh: '电子产品',
    slug: 'dien-tu',
    icon: '💻',
    parentId: null,
    children: [
      { 
        id: 8, 
        name: 'Laptop', 
        nameEn: 'Laptops',
        nameZh: '笔记本电脑',
        slug: 'laptop', 
        icon: '💻', 
        parentId: 2,
        productCount: 51
      },
      { 
        id: 9, 
        name: 'Máy tính bảng', 
        nameEn: 'Tablets',
        nameZh: '平板电脑',
        slug: 'may-tinh-bang', 
        icon: '📱', 
        parentId: 2,
        productCount: 32
      },
      { 
        id: 10, 
        name: 'Thiết bị âm thanh', 
        nameEn: 'Audio Devices',
        nameZh: '音频设备',
        slug: 'thiet-bi-am-thanh', 
        icon: '🎧', 
        parentId: 2,
        productCount: 65
      }
    ],
    productCount: 148
  },
  {
    id: 3,
    name: 'Thời trang',
    nameEn: 'Fashion',
    nameZh: '时尚',
    slug: 'thoi-trang',
    icon: '👕',
    parentId: null,
    children: [],
    productCount: 92
  },
  {
    id: 4,
    name: 'Làm đẹp',
    nameEn: 'Beauty',
    nameZh: '美妆',
    slug: 'lam-dep',
    icon: '💄',
    parentId: null,
    children: [],
    productCount: 78
  },
  {
    id: 5,
    name: 'Đồ gia dụng',
    nameEn: 'Home',
    nameZh: '家居',
    slug: 'do-gia-dung',
    icon: '🏠',
    parentId: null,
    children: [],
    productCount: 56
  }
];

// Form schemas
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameZh: z.string().min(1, 'Chinese name is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional(),
  parentId: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryItemProps {
  category: any;
  level: number;
  onEdit: (category: any) => void;
  onDelete: (categoryId: number) => void;
  onAddSubcategory: (parentId: number) => void;
  expandedCategories: Set<number>;
  toggleExpand: (categoryId: number) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  category, 
  level, 
  onEdit, 
  onDelete, 
  onAddSubcategory,
  expandedCategories,
  toggleExpand
}) => {
  const isExpanded = expandedCategories.has(category.id);
  const hasChildren = category.children && category.children.length > 0;
  
  return (
    <div className="category-item">
      <div 
        className={`
          flex items-center justify-between py-2 px-3 my-1 rounded-md border
          ${level === 0 ? 'bg-gray-50' : ''}
          hover:bg-gray-100
        `}
        style={{ paddingLeft: `${level * 1 + 0.75}rem` }}
      >
        <div className="flex items-center">
          {hasChildren ? (
            <button 
              onClick={() => toggleExpand(category.id)}
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="w-6 h-6" />
          )}
          
          <div className="ml-1 flex items-center">
            <span className="mr-2">{category.icon}</span>
            <div>
              <span className="font-medium text-sm">{category.name}</span>
              <div className="flex text-xs text-gray-500">
                <span>{category.nameEn}</span>
                <span className="mx-1">•</span>
                <span>{category.nameZh}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="mr-2">{category.productCount} products</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onEdit(category)}>
                  <Edit size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddSubcategory(category.id)}>
                  <FolderPlus size={14} className="mr-2" />
                  Add Subcategory
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(category.id)}
                  className="text-red-600"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="pl-4">
          {category.children.map((child: any) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubcategory={onAddSubcategory}
              expandedCategories={expandedCategories}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryList = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([1, 2]));
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [parentIdForAdd, setParentIdForAdd] = useState<number | null>(null);
  
  const toggleExpand = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };
  
  // Define form for category editing
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      nameEn: '',
      nameZh: '',
      slug: '',
      icon: '',
      parentId: '',
    },
  });
  
  // Define form for category adding
  const addForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      nameEn: '',
      nameZh: '',
      slug: '',
      icon: '',
      parentId: '',
    },
  });
  
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    
    // Set form values
    editForm.reset({
      name: category.name,
      nameEn: category.nameEn,
      nameZh: category.nameZh,
      slug: category.slug,
      icon: category.icon,
      parentId: category.parentId ? category.parentId.toString() : '',
    });
    
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteCategory = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteCategory = () => {
    // Here we would call API to delete the category
    console.log(`Deleting category with ID: ${categoryToDelete}`);
    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };
  
  const handleAddSubcategory = (parentId: number) => {
    setParentIdForAdd(parentId);
    
    // Reset form values and set parent ID
    addForm.reset({
      name: '',
      nameEn: '',
      nameZh: '',
      slug: '',
      icon: '',
      parentId: parentId.toString(),
    });
    
    setIsAddDialogOpen(true);
  };
  
  const handleAddCategory = () => {
    setParentIdForAdd(null);
    
    // Reset form values
    addForm.reset({
      name: '',
      nameEn: '',
      nameZh: '',
      slug: '',
      icon: '',
      parentId: '',
    });
    
    setIsAddDialogOpen(true);
  };
  
  const onSubmitEdit = (values: CategoryFormValues) => {
    // Here we would call API to update the category
    console.log('Editing category:', values);
    setIsEditDialogOpen(false);
  };
  
  const onSubmitAdd = (values: CategoryFormValues) => {
    // Here we would call API to add the category
    console.log('Adding category:', values);
    setIsAddDialogOpen(false);
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.categories')}</h1>
          <p className="text-gray-500 mt-1">{t('admin.categoriesDescription')}</p>
        </div>
        <Button className="w-full md:w-auto" onClick={handleAddCategory}>
          <Plus size={16} className="mr-2" />
          {t('admin.addCategory')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t('admin.searchCategories')}
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="categories-tree">
            {categoryData.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                level={0}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onAddSubcategory={handleAddSubcategory}
                expandedCategories={expandedCategories}
                toggleExpand={toggleExpand}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{t('admin.editCategory')}</DialogTitle>
            <DialogDescription>
              {t('admin.editCategoryDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-5">
              <Tabs defaultValue="vi">
                <TabsList className="mb-4">
                  <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="zh">中文</TabsTrigger>
                </TabsList>
                
                <TabsContent value="vi" className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.categoryName')} (VI) *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Tên danh mục"
                            onChange={(e) => {
                              field.onChange(e);
                              // If slug is empty, generate from name
                              if (!editForm.getValues('slug')) {
                                editForm.setValue('slug', generateSlug(e.target.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="en" className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="nameEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.categoryName')} (EN) *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Category name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="zh" className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="nameZh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.categoryName')} (ZH) *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="类别名称" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <FormField
                control={editForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.slug')} *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="category-slug" />
                    </FormControl>
                    <FormDescription>
                      {t('admin.slugDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.icon')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="📱" />
                    </FormControl>
                    <FormDescription>
                      {t('admin.iconDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.parentCategory')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('admin.selectParentCategory')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None (Top-level category)</SelectItem>
                        {categoryData.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id.toString()}
                            disabled={category.id === selectedCategory?.id}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t('admin.parentCategoryDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{t('admin.saveChanges')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {parentIdForAdd !== null 
                ? t('admin.addSubcategory') 
                : t('admin.addCategory')}
            </DialogTitle>
            <DialogDescription>
              {parentIdForAdd !== null 
                ? t('admin.addSubcategoryDescription') 
                : t('admin.addCategoryDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onSubmitAdd)} className="space-y-5">
              <Tabs defaultValue="vi">
                <TabsList className="mb-4">
                  <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="zh">中文</TabsTrigger>
                </TabsList>
                
                <TabsContent value="vi" className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.categoryName')} (VI) *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Tên danh mục"
                            onChange={(e) => {
                              field.onChange(e);
                              // If slug is empty, generate from name
                              if (!addForm.getValues('slug')) {
                                addForm.setValue('slug', generateSlug(e.target.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="en" className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="nameEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.categoryName')} (EN) *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Category name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="zh" className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="nameZh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('admin.categoryName')} (ZH) *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="类别名称" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <FormField
                control={addForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.slug')} *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="category-slug" />
                    </FormControl>
                    <FormDescription>
                      {t('admin.slugDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.icon')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="📱" />
                    </FormControl>
                    <FormDescription>
                      {t('admin.iconDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {parentIdForAdd === null && (
                <FormField
                  control={addForm.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('admin.parentCategory')}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.selectParentCategory')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None (Top-level category)</SelectItem>
                          {categoryData.map((category) => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t('admin.parentCategoryDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter>
                <Button type="submit">{t('admin.addCategory')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.confirmDeleteCategory')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.deleteCategoryConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCategory}
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