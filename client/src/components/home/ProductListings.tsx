import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import ProductCard from "@/components/common/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type SortOption = "popularity" | "newest" | "price-low-high" | "price-high-low";

const ProductListings = () => {
  const { t } = useLanguage();
  const [sortOption, setSortOption] = useState<SortOption>("popularity");
  const [page, setPage] = useState(1);
  const productsPerPage = 10;
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products', { isFeatured: true }],
  });

  // Sort products based on selected option
  const getSortedProducts = () => {
    if (!products) return [];
    
    let sortedProducts = [...products];
    
    switch(sortOption) {
      case "newest":
        return sortedProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price-low-high":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "popularity":
      default:
        return sortedProducts.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  };

  const sortedProducts = getSortedProducts();
  const displayedProducts = sortedProducts.slice(0, page * productsPerPage);
  const hasMoreProducts = displayedProducts.length < sortedProducts.length;

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <section className="py-8 bg-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-primary text-2xl font-poppins font-semibold">
            {t("recommended-for-you")}
          </h2>
          <Link href="/products">
            <a className="text-secondary hover:underline">{t("see-more")}</a>
          </Link>
        </div>
        
        {/* Filter and Sort */}
        <div className="bg-white p-4 rounded-lg mb-6 flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap items-center space-x-2 mb-3 sm:mb-0">
            <span className="text-gray-600 text-sm">{t("sort-by")}</span>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${
                sortOption === "popularity" 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-600 border hover:border-primary hover:text-primary"
              }`}
              onClick={() => setSortOption("popularity")}
            >
              <span>{t("popularity")}</span>
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${
                sortOption === "newest" 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-600 border hover:border-primary hover:text-primary"
              }`}
              onClick={() => setSortOption("newest")}
            >
              <span>{t("newest")}</span>
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${
                sortOption === "price-low-high" 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-600 border hover:border-primary hover:text-primary"
              }`}
              onClick={() => setSortOption("price-low-high")}
            >
              <span>{t("price-low-high")}</span>
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${
                sortOption === "price-high-low" 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-600 border hover:border-primary hover:text-primary"
              }`}
              onClick={() => setSortOption("price-high-low")}
            >
              <span>{t("price-high-low")}</span>
            </button>
          </div>
          <div className="flex items-center">
            <button className="p-2 text-gray-600 hover:text-primary">
              <i className="fas fa-th-large"></i>
            </button>
            <button className="p-2 text-gray-600 hover:text-primary">
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoading ? (
            // Loading skeletons
            Array(10).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg hover:shadow-md transition">
                <div className="relative">
                  <Skeleton className="w-full h-48 object-contain p-4" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : sortedProducts.length > 0 ? (
            // Actual products
            displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-4">
              <p>No products available</p>
            </div>
          )}
        </div>
        
        {/* Load More Button */}
        {hasMoreProducts && (
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline"
              className="bg-white text-primary border border-primary rounded-lg px-6 py-2 hover:bg-primary hover:text-white transition"
              onClick={handleLoadMore}
            >
              {t("load-more")}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductListings;
