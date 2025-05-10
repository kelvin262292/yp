import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import CategoryItem from "@/components/common/CategoryItem";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@shared/schema";

const FeaturedCategories = () => {
  const { t, language } = useLanguage();
  
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-primary text-2xl font-poppins font-semibold mb-6">
          {t("popular-categories")}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition">
                <Skeleton className="w-16 h-16 rounded-full mb-3" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          ) : categories && categories.length > 0 ? (
            // Show only parent categories (null parentId)
            categories
              .filter((category: Category) => !category.parentId)
              .slice(0, 6)
              .map((category: Category) => (
                <CategoryItem 
                  key={category.id} 
                  category={category} 
                  language={language}
                />
              ))
          ) : (
            <div className="col-span-full text-center py-4">
              <p>No categories available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
