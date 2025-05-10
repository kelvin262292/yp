import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import { insertBannerSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  Trash2,
  UploadCloud,
  Smartphone,
  Monitor,
  Save,
  Eye,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Form field name type
type BannerFormValue = z.infer<typeof insertBannerSchema> & {
  desktopImageUrl?: string;
  mobileImageUrl?: string;
};

const customBannerSchema = insertBannerSchema.extend({
  desktopImageUrl: z.string().optional(),
  mobileImageUrl: z.string().optional(),
});

const BannerForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string>("");
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string>("");
  
  // Get banner data if editing
  const { data: banner, isLoading: isBannerLoading } = useQuery({
    queryKey: [`/api/banners/${id}`],
    enabled: isEditing,
    refetchOnWindowFocus: false,
  });

  // Setup form with zod validation
  const form = useForm<BannerFormValue>({
    resolver: zodResolver(customBannerSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      imageUrl: "",
      desktopImageUrl: "",
      mobileImageUrl: "", 
      link: "",
      position: "hero",
      isActive: true,
      priority: 10,
    },
  });

  // Fill form with banner data when editing
  useEffect(() => {
    if (isEditing && banner) {
      const startDate = banner.startDate ? new Date(banner.startDate) : undefined;
      const endDate = banner.endDate ? new Date(banner.endDate) : undefined;
      
      // Check if banner.imageUrl contains desktop or mobile specific images
      let desktopUrl = "";
      let mobileUrl = "";
      
      if (banner.desktopImageUrl) {
        desktopUrl = banner.desktopImageUrl;
        setDesktopPreviewUrl(banner.desktopImageUrl);
      }
      
      if (banner.mobileImageUrl) {
        mobileUrl = banner.mobileImageUrl;
        setMobilePreviewUrl(banner.mobileImageUrl);
      }
      
      // If there are no separate images, use the main image for both
      if (!desktopUrl && !mobileUrl && banner.imageUrl) {
        desktopUrl = banner.imageUrl;
        mobileUrl = banner.imageUrl;
        setDesktopPreviewUrl(banner.imageUrl);
        setMobilePreviewUrl(banner.imageUrl);
      }
      
      form.reset({
        ...banner,
        desktopImageUrl: desktopUrl,
        mobileImageUrl: mobileUrl,
        startDate,
        endDate,
      });
    }
  }, [banner, isEditing, form]);

  // Mutation for creating a banner
  const createMutation = useMutation({
    mutationFn: async (data: BannerFormValue) => {
      const response = await apiRequest(
        "POST",
        "/api/admin/banners",
        data
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({
        title: "Banner created",
        description: "Banner has been created successfully",
      });
      navigate("/admin/banners");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating a banner
  const updateMutation = useMutation({
    mutationFn: async (data: BannerFormValue) => {
      const response = await apiRequest(
        "PUT",
        `/api/admin/banners/${id}`,
        data
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      queryClient.invalidateQueries({ queryKey: [`/api/banners/${id}`] });
      toast({
        title: "Banner updated",
        description: "Banner has been updated successfully",
      });
      navigate("/admin/banners");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: BannerFormValue) => {
    // Use the appropriate mutation based on whether we're editing or creating
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Handle desktop image change
  const handleDesktopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue("desktopImageUrl", url);
    setDesktopPreviewUrl(url);
  };
  
  // Handle mobile image change
  const handleMobileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue("mobileImageUrl", url);
    setMobilePreviewUrl(url);
  };

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "PPP");
  };

  // Check if form is submitting
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <Helmet>
        <title>{isEditing ? t("admin.editBanner") : t("admin.addBanner")} | Yapee Admin</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/banners")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? t("admin.editBanner") : t("admin.addBanner")}
            </h1>
            {isEditing && banner && (
              <Badge variant={banner.isActive ? "outline" : "secondary"} className="ml-2">
                {banner.isActive ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/banners")}>
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Banner"}
            </Button>
          </div>
        </div>

        {isBannerLoading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
                  <TabsTrigger value="general">General Info</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                </TabsList>
                
                {/* General Tab */}
                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>Banner Information</CardTitle>
                      <CardDescription>
                        Enter the basic information about this banner
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("admin.bannerTitle")}</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter banner title" {...field} />
                                </FormControl>
                                <FormDescription>
                                  The main heading displayed on the banner
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="subtitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("admin.bannerSubtitle")}</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter banner subtitle or description" 
                                    className="resize-none"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Secondary text displayed below the title
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("admin.bannerLink")}</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., /products/category/phones" 
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormDescription>
                                  URL where the banner will link to when clicked
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("admin.bannerPosition")}</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select banner position" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="hero">Hero Banner (Top of Homepage)</SelectItem>
                                    <SelectItem value="featured">Featured (Middle of Homepage)</SelectItem>
                                    <SelectItem value="promo">Promotion (Special Offers)</SelectItem>
                                    <SelectItem value="category">Category Page</SelectItem>
                                    <SelectItem value="footer">Footer</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Where the banner will be displayed on the site
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("admin.bannerPriority")}</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1"
                                    max="100"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Banners with higher priority (larger number) are displayed first
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    {t("admin.bannerActive")}
                                  </FormLabel>
                                  <FormDescription>
                                    Activate or deactivate this banner
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images">
                  <Card>
                    <CardHeader>
                      <CardTitle>Banner Images</CardTitle>
                      <CardDescription>
                        Upload or provide URLs for both desktop and mobile banner images
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Desktop Image */}
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Monitor className="h-5 w-5 mr-2" />
                            <h3 className="text-lg font-medium">{t("admin.bannerDesktopImage")}</h3>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="desktopImageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desktop Image URL</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="https://example.com/image.jpg" 
                                    {...field}
                                    onChange={(e) => handleDesktopImageChange(e)}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Recommended size: 1920x600px
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {desktopPreviewUrl && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Preview:</h4>
                              <div className="border rounded-md overflow-hidden bg-gray-50 aspect-[3/1] relative">
                                <img 
                                  src={desktopPreviewUrl} 
                                  alt="Desktop preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          
                          {!desktopPreviewUrl && (
                            <div className="border border-dashed rounded-md p-8 text-center bg-muted">
                              <UploadCloud className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Enter a URL above to see a preview
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Mobile Image */}
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Smartphone className="h-5 w-5 mr-2" />
                            <h3 className="text-lg font-medium">{t("admin.bannerMobileImage")}</h3>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="mobileImageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mobile Image URL</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="https://example.com/image-mobile.jpg" 
                                    {...field}
                                    onChange={(e) => handleMobileImageChange(e)}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Recommended size: 800x800px
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {mobilePreviewUrl && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Preview:</h4>
                              <div className="border rounded-md overflow-hidden bg-gray-50 aspect-[1/1] relative max-w-[240px] mx-auto">
                                <img 
                                  src={mobilePreviewUrl} 
                                  alt="Mobile preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          
                          {!mobilePreviewUrl && (
                            <div className="border border-dashed rounded-md p-8 text-center bg-muted max-w-[240px] mx-auto">
                              <UploadCloud className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Enter a URL above to see a preview
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <FormItem>
                        <FormLabel>Main Banner Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/banner.jpg" 
                            {...form.register("imageUrl")}
                          />
                        </FormControl>
                        <FormDescription>
                          This image will be used as a fallback if device-specific images are not provided
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Scheduling Tab */}
                <TabsContent value="scheduling">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scheduling</CardTitle>
                      <CardDescription>
                        Set when this banner should be displayed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>{t("admin.bannerStartDate")}</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        formatDate(field.value)
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                When the banner will start being displayed
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>{t("admin.bannerEndDate")}</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        formatDate(field.value)
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                When the banner will stop being displayed
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800">Scheduling Information</h4>
                            <p className="text-sm text-blue-600 mt-1">
                              If both dates are left empty, the banner will always be displayed when active.
                              You can set just one date to have the banner start or end on a specific date.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => navigate("/admin/banners")}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Banner"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </AdminLayout>
  );
};

export default BannerForm;