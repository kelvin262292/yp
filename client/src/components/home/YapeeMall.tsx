import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Skeleton } from "@/components/ui/skeleton";

const YapeeMall = () => {
  const { t } = useLanguage();
  
  const { data: brands, isLoading } = useQuery({
    queryKey: ['/api/brands', { isFeatured: true }],
  });

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-primary text-2xl font-poppins font-semibold">YapeeMall</h2>
            <span className="ml-3 text-xs bg-primary text-white px-2 py-1 rounded-md">
              {t("authentic-brands")}
            </span>
          </div>
          <Link href="/yapee-mall" className="text-secondary hover:underline">
            {t("see-more")}
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
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
              <div key={brand.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition text-center">
                <img 
                  src={brand.logoUrl} 
                  alt={brand.name} 
                  className="w-16 h-16 mx-auto object-contain" 
                />
                <p className="mt-2 text-sm font-medium">{brand.name}</p>
              </div>
            ))
          ) : (
            // Fallback for no data
            <div className="col-span-full text-center py-4">
              <p>No featured brands available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default YapeeMall;
