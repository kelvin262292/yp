import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Banner } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const HeroBanner = () => {
  const { language, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: banners, isLoading } = useQuery({
    queryKey: ['/api/banners'],
    select: data => data.filter((banner: Banner) => banner.isActive),
  });

  useEffect(() => {
    // Auto-rotate banners every 5 seconds
    if (!banners || banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners]);

  const handlePrev = () => {
    if (!banners || banners.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    if (!banners || banners.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <section className="bg-light py-4">
        <div className="container mx-auto px-4">
          <Skeleton className="w-full h-[200px] sm:h-[300px] md:h-[400px] rounded-lg" />
        </div>
      </section>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <section className="bg-light py-4">
        <div className="container mx-auto px-4">
          <div className="relative rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center h-[200px] sm:h-[300px] md:h-[400px]">
            <p className="text-primary font-semibold">No active banners</p>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentSlide];
  const title = language === 'en' ? currentBanner.titleEn || currentBanner.title :
               language === 'zh' ? currentBanner.titleZh || currentBanner.title :
               currentBanner.title;
  
  const description = language === 'en' ? currentBanner.descriptionEn || currentBanner.description :
                     language === 'zh' ? currentBanner.descriptionZh || currentBanner.description :
                     currentBanner.description;

  return (
    <section className="bg-light py-4">
      <div className="container mx-auto px-4">
        <div className="relative rounded-lg overflow-hidden">
          <div className="carousel-container relative">
            <div className="carousel-slide block">
              <img
                src={currentBanner.imageUrl}
                alt={title}
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent flex flex-col justify-center p-8">
                <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-poppins font-bold mb-2">
                  <span>{title}</span> <span className="text-secondary">2023</span>
                </h2>
                <p className="text-white text-sm sm:text-lg mb-4">{description}</p>
                <Link href={currentBanner.linkUrl || "#"}>
                  <button className="bg-secondary text-white py-2 px-4 rounded-lg hover:bg-secondary/90 transition w-fit text-sm sm:text-base">
                    {t("shop-now")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Carousel Navigation */}
          {banners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-primary p-2 rounded-full hover:bg-white transition"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-primary p-2 rounded-full hover:bg-white transition"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white"
                    }`}
                  ></button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
