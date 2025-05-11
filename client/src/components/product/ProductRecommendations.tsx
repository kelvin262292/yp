import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useCart } from "../../hooks/useCart";
import { ProductCard } from "../common/ProductCard";
import { Skeleton } from "../ui/skeleton";
import { toast } from "react-hot-toast";

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
  freeShipping: boolean;
}

interface ProductRecommendationsProps {
  productId: number;
  type?: "similar" | "frequently-bought";
  limit?: number;
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  productId,
  type = "similar",
  limit = 6,
}) => {
  const { t, i18n } = useTranslation();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const endpoint = type === "similar"
          ? `/api/products/${productId}/recommendations`
          : `/api/products/${productId}/frequently-bought-together`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        
        const data = await response.json();
        setRecommendations(data.slice(0, limit));
      } catch (error) {
        console.error(`Error fetching ${type} products:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchRecommendations();
    }
  }, [productId, type, limit]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      nameEn: product.nameEn,
      nameZh: product.nameZh,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    toast.success(t("added-to-cart"));
  };

  // Handle localized product name
  const getLocalizedName = (product: Product) => {
    const language = i18n.language;
    return language === "en"
      ? product.nameEn
      : language === "zh"
      ? product.nameZh
      : product.name;
  };

  const title =
    type === "similar"
      ? t("similar-products")
      : t("frequently-bought-together");

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't show section if no recommendations
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recommendations.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}; 