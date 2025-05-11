import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/i18n";
import { Helmet } from "react-helmet";
import { Product } from "@shared/schema";
import ProductCard from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ReviewList } from "../components/product/ReviewList";
import { ProductRecommendations } from "../components/product/ProductRecommendations";

const ProductDetail = () => {
  const [match, params] = useRoute("/product/:slug");
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/slug/${params?.slug}`],
    enabled: !!params?.slug,
  });
  
  // Fetch category details
  const { data: category } = useQuery({
    queryKey: ['/api/categories', product?.categoryId],
    enabled: !!product?.categoryId,
  });
  
  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['/api/products', { categoryId: product?.categoryId, limit: 5 }],
    enabled: !!product?.categoryId,
    select: (data) => data.filter((p: Product) => p.id !== product.id).slice(0, 5),
  });

  // Reset quantity when changing products
  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product?.id]);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= (product?.stock || 100)) {
      setQuantity(value);
    }
  };

  // Increment/decrement quantity
  const incrementQuantity = () => {
    if (quantity < (product?.stock || 100)) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    addToCart(product, quantity)
      .then(() => {
        toast({
          title: t("added-to-cart"),
          description: `${product.name} x ${quantity}`,
        });
      })
      .catch(error => {
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsAddingToCart(false);
      });
  };

  // Buy now
  const handleBuyNow = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    addToCart(product, quantity)
      .then(() => {
        window.location.href = "/cart";
      })
      .catch(error => {
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsAddingToCart(false);
      });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Skeleton className="h-6 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div>
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-24 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-accent mb-2">{t("product-not-found")}</h2>
          <p className="mb-4">{t("product-not-found-message")}</p>
          <Link href="/">
            <Button>{t("back-to-home")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get localized content
  const productName = language === 'en' ? product.nameEn : 
                      language === 'zh' ? product.nameZh : 
                      product.name;
  
  const productDescription = language === 'en' ? product.descriptionEn || product.description : 
                           language === 'zh' ? product.descriptionZh || product.description : 
                           product.description;
  
  const categoryName = category ? (
    language === 'en' ? category.nameEn : 
    language === 'zh' ? category.nameZh : 
    category.name
  ) : '';

  return (
    <>
      <Helmet>
        <title>{productName} - Yapee</title>
        <meta name="description" content={productDescription?.substring(0, 160) || ""} />
        <meta property="og:title" content={`${productName} - Yapee`} />
        <meta property="og:description" content={productDescription?.substring(0, 160) || ""} />
        <meta property="og:image" content={product.imageUrl} />
      </Helmet>
      
      <div className="bg-light">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {category && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/category/${category.slug}`}>{categoryName}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbLink className="max-w-[200px] truncate">
                  {productName}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Product main content */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <div className="mb-4 border rounded-lg p-4 flex items-center justify-center h-72 md:h-96">
                  <img 
                    src={product.imageUrl} 
                    alt={productName} 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
                
                {/* Add thumbnail images here if available */}
                <div className="flex gap-2 overflow-x-auto py-2">
                  <div className="border rounded w-16 h-16 p-1 flex-shrink-0 cursor-pointer hover:border-primary">
                    <img 
                      src={product.imageUrl} 
                      alt={productName} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div>
                <h1 className="text-2xl font-bold mb-2">{productName}</h1>
                
                {/* Ratings */}
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(Math.floor(product.rating))].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400"></i>
                    ))}
                    {product.rating % 1 >= 0.5 && (
                      <i className="fas fa-star-half-alt text-yellow-400"></i>
                    )}
                    {[...Array(5 - Math.ceil(product.rating))].map((_, i) => (
                      <i key={i} className="fas fa-star text-gray-300"></i>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviewCount} {t("reviews")})
                  </span>
                </div>
                
                {/* Price */}
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-bold text-accent">
                    {formatPrice(product.price, language)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-500 text-lg line-through ml-3">
                      {formatPrice(product.originalPrice, language)}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="bg-accent text-white px-2 py-1 text-sm rounded ml-3">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>
                
                {/* Shipping */}
                {product.freeShipping && (
                  <div className="bg-light p-3 rounded mb-6 flex items-center">
                    <i className="fas fa-truck text-primary mr-2"></i>
                    <span className="text-sm">{t("free-shipping")}</span>
                  </div>
                )}
                
                {/* Stock */}
                <div className="mb-6">
                  <span className="text-sm text-gray-600">
                    {product.stock > 0 ? (
                      <span className="text-green-600">
                        <i className="fas fa-check-circle mr-1"></i>
                        {t("in-stock")} ({product.stock})
                      </span>
                    ) : (
                      <span className="text-red-600">
                        <i className="fas fa-times-circle mr-1"></i>
                        {t("out-of-stock")}
                      </span>
                    )}
                  </span>
                </div>
                
                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">{t("quantity")}</label>
                  <div className="flex w-1/3">
                    <Button 
                      type="button" 
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="rounded-r-none"
                    >
                      <i className="fas fa-minus"></i>
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={product.stock || 100}
                      className="rounded-none border-x-0 text-center w-16"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= (product.stock || 100)}
                      className="rounded-l-none"
                    >
                      <i className="fas fa-plus"></i>
                    </Button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="flex-1 bg-light text-primary hover:bg-light/80 border border-primary"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stock <= 0}
                  >
                    {isAddingToCart ? (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : (
                      <i className="fas fa-cart-plus mr-2"></i>
                    )}
                    {t("add-to-cart")}
                  </Button>
                  <Button 
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                    onClick={handleBuyNow}
                    disabled={isAddingToCart || product.stock <= 0}
                  >
                    <i className="fas fa-bolt mr-2"></i>
                    {t("buy-now")}
                  </Button>
                </div>
                
                {/* Wishlist button */}
                <Button 
                  variant="link" 
                  className="mt-4 text-gray-600 hover:text-primary"
                >
                  <i className="far fa-heart mr-2"></i>
                  {t("add-to-wishlist")}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm mt-6">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b mb-4 rounded-none bg-transparent h-auto">
                <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  {t("description")}
                </TabsTrigger>
                <TabsTrigger value="specifications" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  {t("specifications")}
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  {t("reviews")}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description">
                <div className="prose max-w-none">
                  {productDescription ? (
                    <p>{productDescription}</p>
                  ) : (
                    <p>{t("no-description-available")}</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="specifications">
                <div className="prose max-w-none">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium w-1/3">{t("brand")}</td>
                        <td className="py-2">Brand Name</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">{t("model")}</td>
                        <td className="py-2">{productName}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 font-medium">{t("warranty")}</td>
                        <td className="py-2">12 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="py-4">
                  <ReviewList productId={product.id} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">{t("related-products")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {relatedProducts.map((relatedProduct: Product) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}

          {/* Sản phẩm đề xuất */}
          <div className="mt-8">
            <ProductRecommendations productId={product.id} type="similar" limit={6} />
          </div>
          
          {/* Sản phẩm thường được mua cùng */}
          <div className="mt-8">
            <ProductRecommendations productId={product.id} type="frequently-bought" limit={4} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
