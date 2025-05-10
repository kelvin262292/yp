import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/layout/AdminLayout';

// Form validation schema
const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameZh: z.string().min(1, 'Chinese name is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional(),
  parentId: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const CategoryForm = () => {
  const [location, navigate] = useLocation();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isEditMode = location.includes('/edit');
  const categoryId = isEditMode ? parseInt(location.split('/').pop() || '0') : 0;

  // Fetch categories for parent category selection
  const { data: categoriesData } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 60000, // 1 minute
  });

  // Initialize form with default values for new category or fetched data for edit
  const form = useForm<CategoryFormValues>({
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

  // Add category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (categoryData: any) => {
      return apiRequest('/api/admin/categories', {
        method: 'POST',
        data: categoryData,
      });
    },
    onSuccess: () => {
      // Invalidate categories cache
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Thành công",
        description: "Danh mục đã được tạo thành công",
      });
      navigate('/admin/categories');
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo danh mục. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: (data: { id: number; categoryData: any }) => {
      return apiRequest(`/api/admin/categories/${data.id}`, {
        method: 'PUT',
        data: data.categoryData,
      });
    },
    onSuccess: () => {
      // Invalidate categories cache
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Thành công",
        description: "Danh mục đã được cập nhật thành công",
      });
      navigate('/admin/categories');
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật danh mục. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (values: CategoryFormValues) => {
    const categoryData = {
      ...values,
      slug: values.slug || generateSlug(values.name),
      parentId: values.parentId && values.parentId !== "none" ? parseInt(values.parentId) : null,
    };
    
    if (isEditMode && categoryId) {
      // Update existing category
      updateCategoryMutation.mutate({ 
        id: categoryId,
        categoryData
      });
    } else {
      // Create new category
      createCategoryMutation.mutate(categoryData);
    }
  };

  // Update slug when name changes
  const watchedName = form.watch('name');
  React.useEffect(() => {
    if (!form.getValues('slug')) {
      form.setValue('slug', generateSlug(watchedName));
    }
  }, [watchedName, form]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên danh mục (Tiếng Việt) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên danh mục" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên danh mục (Tiếng Anh) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Category name in English" {...field} />
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
                      <FormLabel>Tên danh mục (Tiếng Trung) *</FormLabel>
                      <FormControl>
                        <Input placeholder="类别名称 (Chinese)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="category-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon URL</FormLabel>
                      <FormControl>
                        <Input placeholder="URL to category icon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục cha</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục cha (nếu có)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Không có danh mục cha</SelectItem>
                          {categoriesData && categoriesData.length > 0 ? (
                            categoriesData.map((category: any) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {language === 'vi' ? category.name : 
                                 language === 'en' ? category.nameEn : 
                                 category.nameZh}
                              </SelectItem>
                            ))
                          ) : null}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => navigate('/admin/categories')}
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit"
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {(createCategoryMutation.isPending || updateCategoryMutation.isPending) ? (
                  'Đang xử lý...'
                ) : isEditMode ? (
                  'Cập nhật danh mục'
                ) : (
                  'Tạo danh mục'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;