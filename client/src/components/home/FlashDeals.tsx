import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { formatPrice } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

const FlashDeals = () => {
  const { language, t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 45
  });
  
  const { data: flashDeals, isLoading } = useQuery({
    queryKey: ['/api/flash-deals'],
  });

  // Format countdown time
  const formattedTime = `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          // Reset timer to 5 hours when it reaches zero
          return { hours: 5, minutes: 0, seconds: 0 };
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

  return (
    <section className="py-8 bg-light">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-primary text-2xl font-poppins font-semibold">
                {t("flash-deals")}
              </h2>
              <div className="ml-4 flex items-center space-x-1 bg-secondary text-white px-2 py-1 rounded-md">
                <span className="text-xs">{t("ends-in")}</span>
                <span className="countdown-timer font-semibold">{formattedTime}</span>
              </div>
            </div>
            <Link href="/flash-deals">
              <a className="text-secondary hover:underline">{t("see-more")}</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {isLoading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border hover:shadow-md transition">
                  <div className="relative">
                    <Skeleton className="w-full h-40 object-contain p-2" />
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
                return (
                  <div key={deal.id} className="bg-white rounded-lg border hover:shadow-md transition">
                    <div className="relative">
                      <Link href={`/product/${deal.product.slug}`}>
                        <img 
                          src={deal.product.imageUrl} 
                          alt={deal.product.name} 
                          className="w-full h-40 object-contain p-2" 
                        />
                      </Link>
                      <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
                        {deal.product.discountPercentage ? `-${deal.product.discountPercentage}%` : "SALE"}
                      </span>
                    </div>
                    <div className="p-3">
                      <Link href={`/product/${deal.product.slug}`}>
                        <h3 className="text-sm font-medium truncate">
                          {language === 'en' ? deal.product.nameEn : 
                           language === 'zh' ? deal.product.nameZh : 
                           deal.product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center mt-1">
                        <span className="text-accent font-semibold">
                          {formatPrice(deal.product.price, language)}
                        </span>
                        {deal.product.originalPrice && (
                          <span className="text-gray-500 text-xs line-through ml-2">
                            {formatPrice(deal.product.originalPrice, language)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <div className="flex">
                          {[...Array(Math.floor(deal.product.rating))].map((_, i) => (
                            <i key={i} className="fas fa-star text-yellow-400"></i>
                          ))}
                          {deal.product.rating % 1 >= 0.5 && (
                            <i className="fas fa-star-half-alt text-yellow-400"></i>
                          )}
                          {[...Array(5 - Math.ceil(deal.product.rating))].map((_, i) => (
                            <i key={i} className="fas fa-star text-gray-300"></i>
                          ))}
                        </div>
                        <span className="ml-1">{deal.product.rating} ({deal.product.reviewCount})</span>
                      </div>
                      <div className="mt-2 text-xs">
                        {deal.product.freeShipping && (
                          <span className="text-primary">{t("free-shipping")}</span>
                        )}
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-accent h-1.5 rounded-full" 
                          style={{ width: `${soldPercentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t("sold")} {deal.soldCount}/{deal.totalStock}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback for no data
              <div className="col-span-full text-center py-4">
                <p>No flash deals available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
