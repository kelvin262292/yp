import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import { useCart } from "../../hooks/useCart";
import { Button } from "../ui/button";
import { Star, ShoppingCart, Plus } from "lucide-react";

interface FlashDeal {
  id: number;
  productId: number;
  startDate: string;
  endDate: string;
  totalStock: number;
  soldCount: number;
  product: {
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
  };
}

export const FlashDeals = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 0,
    seconds: 0
  });
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format price according to language
  const formatPrice = (price: number) => {
    if (language === 'en') {
      return `$${price.toFixed(2)}`;
    } else if (language === 'zh') {
      return `¥${(price * 7).toFixed(2)}`;
    } else {
      return `${price.toLocaleString('vi-VN')}₫`;
    }
  };

  // Format countdown time
  const formattedTime = `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  // Fetch flash deals
  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        setIsLoading(true);
        // Sử dụng URL tuyệt đối để đảm bảo kết nối đúng tới API endpoint
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/flash-deals/active`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Không có flash deals active
            console.log('No active flash deals found');
            setFlashDeals([]);
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setFlashDeals(data);
        
        // If deals exist, set countdown to the nearest ending deal
        if (data.length > 0) {
          const nearestEndDate = new Date(data[0].endDate);
          const now = new Date();
          const diff = Math.max(0, Math.floor((nearestEndDate.getTime() - now.getTime()) / 1000));
          
          setTimeLeft({
            hours: Math.floor(diff / 3600),
            minutes: Math.floor((diff % 3600) / 60),
            seconds: diff % 60
          });
        }
      } catch (error) {
        console.error('Error fetching flash deals:', error);
        toast.error(t("failed-to-load-flash-deals"));
        setFlashDeals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashDeals();
  }, [t]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          // Refetch deals when timer reaches zero
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          fetch(`${API_URL}/api/flash-deals/active`)
            .then(res => {
              if (!res.ok) {
                if (res.status === 404) {
                  return []; // Không có flash deals active
                }
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
              return res.json();
            })
            .then(data => {
              setFlashDeals(data);
              
              // Reset timer to nearest ending deal
              if (data.length > 0) {
                const nearestEndDate = new Date(data[0].endDate);
                const now = new Date();
                const diff = Math.max(0, Math.floor((nearestEndDate.getTime() - now.getTime()) / 1000));
                
                return {
                  hours: Math.floor(diff / 3600),
                  minutes: Math.floor((diff % 3600) / 60),
                  seconds: diff % 60
                };
              }
              
              // Default timer if no deals found
              return { hours: 5, minutes: 0, seconds: 0 };
            })
            .catch(err => {
              console.error('Error refreshing flash deals:', err);
              return { hours: 5, minutes: 0, seconds: 0 };
            });
        }
        
        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds - 1;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        
        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      nameEn: product.nameEn,
      nameZh: product.nameZh,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    });
    toast.success(t("added-to-cart"));
  };

  return (
    <section className="py-8">
      <div className="container">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-primary text-2xl font-bold">
                {t("flash-deals")}
              </h2>
              <div className="ml-4 flex items-center space-x-1 bg-accent text-white px-3 py-1 rounded-md">
                <span className="text-xs">{t("ends-in")}</span>
                <span className="font-mono font-semibold ml-1">{formattedTime}</span>
              </div>
            </div>
            <Link to="/flash-deals" className="text-primary hover:underline">
              {t("see-more")}
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {isLoading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border hover:shadow-md transition">
                  <div className="relative">
                    <Skeleton className="w-full h-40 rounded-t-lg" />
                  </div>
                  <div className="p-3">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-2/3 mb-2" />
                    <Skeleton className="h-1.5 w-full rounded-full mb-1" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))
            ) : flashDeals && flashDeals.length > 0 ? (
              // Actual flash deals
              flashDeals.map((deal) => {
                const soldPercentage = (deal.soldCount / deal.totalStock) * 100;
                const product = deal.product;
                const displayName = language === 'en' ? product.nameEn : 
                                   language === 'zh' ? product.nameZh : 
                                   product.name;
                return (
                  <div key={deal.id} className="bg-white rounded-lg border hover:shadow-md transition">
                    <div className="relative">
                      <Link to={`/product/${product.slug}`} className="block">
                        <img 
                          src={product.imageUrl} 
                          alt={displayName} 
                          className="w-full h-40 object-contain p-2 rounded-t-lg" 
                        />
                      </Link>
                      <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
                        {product.discountPercentage ? `-${product.discountPercentage}%` : "SALE"}
                      </span>
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
                          {Array(5).fill(0).map((_, i) => (
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
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                      <div className="mt-2 text-xs">
                        {product.freeShipping && (
                          <span className="text-primary">{t("free-shipping")}</span>
                        )}
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-accent h-1.5 rounded-full" 
                          style={{ width: `${soldPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-gray-500">
                          {t("sold")} {deal.soldCount}/{deal.totalStock}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback for no data
              <div className="col-span-full text-center py-4">
                <p className="text-gray-500">{t("no-flash-deals-available")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
