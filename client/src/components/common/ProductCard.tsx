import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/i18n";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get correct name based on language
  const productName = language === 'en' ? product.nameEn : 
                      language === 'zh' ? product.nameZh : 
                      product.name;

  // Quick add to cart without going to product detail
  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    
    addToCart(product, 1)
      .then(() => {
        toast({
          title: t("added-to-cart"),
          description: productName,
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

  return (
    <div className="bg-white rounded-lg hover:shadow-md transition group">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          <div className="cursor-pointer">
            <img 
              src={product.imageUrl} 
              alt={productName} 
              className="w-full h-48 object-contain p-4" 
            />
          </div>
        </Link>
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-secondary transition-colors"
          aria-label="Add to wishlist"
        >
          <i className="far fa-heart"></i>
        </button>
        
        {/* Product badges */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
          {product.isHotDeal && (
            <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
              {t("hot-deal")}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
              {t("best-seller")}
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {t("new-arrival")}
            </span>
          )}
        </div>
        
        {/* Quick add to cart - appears on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="secondary"
                  size="sm"
                  className="translate-y-4 group-hover:translate-y-0 transition-transform"
                  onClick={handleQuickAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-cart-plus mr-2"></i>
                  )}
                  {t("add-to-cart")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("add-to-cart")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <div className="cursor-pointer">
            <h3 className="text-sm font-medium line-clamp-2 hover:text-secondary">
              {productName}
            </h3>
          </div>
        </Link>
        <div className="flex items-center mt-2">
          <span className="text-accent font-semibold">
            {formatPrice(product.price, language)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-gray-500 text-xs line-through ml-2">
                {formatPrice(product.originalPrice, language)}
              </span>
              <span className="text-accent text-xs ml-auto">
                -{product.discountPercentage}%
              </span>
            </>
          )}
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-500">
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
          <span className="ml-1">{product.rating} ({product.reviewCount})</span>
        </div>
        {product.freeShipping && (
          <div className="mt-2 text-xs">
            <span className="text-primary">{t("free-shipping")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
