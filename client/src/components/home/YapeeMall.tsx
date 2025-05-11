import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { ProductCard } from "../common/ProductCard";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/use-toast";

interface Brand {
  id: number;
  name: string;
  logoUrl: string;
  isFeatured: boolean;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  nameEn: string;
  nameZh: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  discountPercentage: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  stock: number;
  freeShipping: boolean;
  brand: Brand;
}

export const YapeeMall: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedBrands = async () => {
      try {
        setIsLoadingBrands(true);
        const response = await fetch('/api/brands/featured');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured brands');
        }
        
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching featured brands:', error);
      } finally {
        setIsLoadingBrands(false);
      }
    };
    
    const fetchYapeeMallProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await fetch('/api/yapee-mall/products?limit=6');
        
        if (!response.ok) {
          throw new Error('Failed to fetch YapeeMall products');
        }
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching YapeeMall products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    fetchFeaturedBrands();
    fetchYapeeMallProducts();
  }, []);

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
      .then(() => {
        toast({
          title: t("added-to-cart"),
          description: product.name,
        });
      })
      .catch(error => {
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive",
        });
      });
  };

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-primary text-2xl font-bold">YapeeMall</h2>
            <Badge variant="outline" className="bg-primary text-white border-primary">
              {t("authentic-products")}
            </Badge>
          </div>
          <Link to="/yapee-mall" className="text-primary hover:underline flex items-center gap-1">
            {t("see-more")}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
        
        {/* Featured brands */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {isLoadingBrands ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition text-center">
                <Skeleton className="w-16 h-16 mx-auto rounded-full" />
                <Skeleton className="h-4 w-20 mx-auto mt-2" />
              </div>
            ))
          ) : brands && brands.length > 0 ? (
            // Actual brand data
            brands.map((brand) => (
              <Link 
                key={brand.id} 
                to={`/brands/${brand.id}`}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition text-center block"
              >
                <img 
                  src={brand.logoUrl} 
                  alt={brand.name} 
                  className="w-16 h-16 mx-auto object-contain" 
                />
                <p className="mt-2 text-sm font-medium">{brand.name}</p>
              </Link>
            ))
          ) : (
            // Fallback for no data
            <div className="col-span-full text-center py-4">
              <p className="text-gray-500">{t("no-featured-brands")}</p>
            </div>
          )}
        </div>
        
        {/* YapeeMall Products */}
        <h3 className="text-lg font-semibold mb-4">{t("featured-products")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoadingProducts ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <Skeleton className="w-full h-36 rounded" />
                <Skeleton className="h-4 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-2" />
                <Skeleton className="h-8 w-full mt-4" />
              </div>
            ))
          ) : products && products.length > 0 ? (
            // Actual product data
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => handleAddToCart(product)}
              />
            ))
          ) : (
            // Fallback for no data
            <div className="col-span-full text-center py-4">
              <p className="text-gray-500">{t("no-products-found")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
