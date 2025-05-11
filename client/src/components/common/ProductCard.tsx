import React from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

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
  freeShipping?: boolean;
  isHotDeal?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  // Format price according to language
  const formatPrice = (price: number) => {
    if (language === "en") {
      return `$${price.toFixed(2)}`;
    } else if (language === "zh") {
      return `¥${(price * 7).toFixed(2)}`;
    } else {
      return `${price.toLocaleString("vi-VN")}₫`;
    }
  };

  // Get localized product name
  const displayName =
    language === "en"
      ? product.nameEn
      : language === "zh"
      ? product.nameZh
      : product.name;

  return (
    <div
      className={`group bg-white border rounded-lg hover:shadow-md transition ${className}`}
    >
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block">
          <img
            src={product.imageUrl}
            alt={displayName}
            className="w-full h-40 object-contain p-2 rounded-t-lg"
          />
        </Link>
        {(product.discountPercentage || product.isHotDeal) && (
          <Badge
            variant="destructive"
            className="absolute top-2 left-2 px-2 py-1 text-xs"
          >
            {product.discountPercentage
              ? `-${product.discountPercentage}%`
              : t("hot-deal")}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 bg-white/80 hover:bg-white"
          title={t("wishlist")}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3">
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-medium line-clamp-2 h-10">
            {displayName}
          </h3>
        </Link>

        <div className="flex items-center mt-1">
          <span className="text-accent font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-500 text-xs line-through ml-2">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center mt-1 text-xs text-gray-500">
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
          </div>
          <span className="ml-1">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        {product.freeShipping && (
          <div className="mt-1 text-xs text-primary">
            {t("free-shipping")}
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            {t("add-to-cart")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
