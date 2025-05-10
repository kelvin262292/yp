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
import { Switch } from '@/components/ui/switch';
import AdminLayout from '@/components/admin/layout/AdminLayout';

// Form validation schema
const brandFormSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  logoUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

const BrandForm = () => {
  const [location, navigate] = useLocation();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const isEditMode = location.includes('/edit');
  const brandId = isEditMode ? parseInt(location.split('/').pop() || '0') : 0;

  // Initialize form with default values for new brand or fetched data for edit
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      isFeatured: false,
    },
  });

  // Add brand mutation
  const createBrandMutation = useMutation({
    mutationFn: (brandData: any) => {
      return apiRequest('/api/admin/brands', {
        method: 'POST',
        data: brandData,
      });
    },
    onSuccess: () => {
      // Invalidate brands cache
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      toast({
        title: "Thành công",
        description: "Thương hiệu đã được tạo thành công",
      });
      navigate('/admin/brands');
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo thương hiệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });

  // Update brand mutation
  const updateBrandMutation = useMutation({
    mutationFn: (data: { id: number; brandData: any }) => {
      return apiRequest(`/api/admin/brands/${data.id}`, {
        method: 'PUT',
        data: data.brandData,
      });
    },
    onSuccess: () => {
      // Invalidate brands cache
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      toast({
        title: "Thành công",
        description: "Thương hiệu đã được cập nhật thành công",
      });
      navigate('/admin/brands');
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật thương hiệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (values: BrandFormValues) => {
    const brandData = {
      ...values,
    };
    
    if (isEditMode && brandId) {
      // Update existing brand
      updateBrandMutation.mutate({ 
        id: brandId,
        brandData
      });
    } else {
      // Create new brand
      createBrandMutation.mutate(brandData);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thương hiệu *</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên thương hiệu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Logo</FormLabel>
                    <FormControl>
                      <Input placeholder="URL to brand logo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Thương hiệu nổi bật
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Hiển thị trong phần Thương hiệu nổi bật trên trang chủ
                      </div>
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
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => navigate('/admin/brands')}
              >
                Hủy bỏ
              </Button>
              <Button 
                type="submit"
                disabled={createBrandMutation.isPending || updateBrandMutation.isPending}
              >
                {(createBrandMutation.isPending || updateBrandMutation.isPending) ? (
                  'Đang xử lý...'
                ) : isEditMode ? (
                  'Cập nhật thương hiệu'
                ) : (
                  'Tạo thương hiệu'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default BrandForm;