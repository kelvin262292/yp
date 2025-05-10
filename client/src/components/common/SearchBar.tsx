import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { Product } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showResults, setShowResults] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Only fetch search results if there's something to search for
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/products/search', debouncedSearchTerm],
    enabled: debouncedSearchTerm.length > 2,
    select: data => data.slice(0, 5), // Limit to 5 results in dropdown
  });

  // Handle clicking outside of search results to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show results dropdown when there's a search term
  useEffect(() => {
    if (debouncedSearchTerm.length > 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
    }
  };

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchResultsRef}>
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder={t("search-placeholder")}
          className="w-full py-2 px-4 border-2 border-secondary rounded-lg focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => debouncedSearchTerm.length > 2 && setShowResults(true)}
        />
        <Button
          type="submit"
          variant="ghost"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary"
        >
          <i className="fas fa-search"></i>
        </Button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              {t("searching")}...
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div>
              {searchResults.map((product: Product) => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-light cursor-pointer flex items-center border-b border-gray-100 last:border-0"
                  onClick={() => handleProductClick(product.slug)}
                >
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-12 h-12 object-contain mr-3" 
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {language === 'en' ? product.nameEn : 
                      language === 'zh' ? product.nameZh : 
                      product.name}
                    </p>
                    <p className="text-xs text-accent font-semibold">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                        .format(product.price)
                        .replace('₫', '')
                        .trim() + '₫'}
                    </p>
                  </div>
                </div>
              ))}
              <div className="p-2 text-center border-t border-gray-100">
                <Button 
                  variant="link" 
                  className="text-secondary text-sm" 
                  onClick={handleSearch}
                >
                  {t("see-all-results")}
                </Button>
              </div>
            </div>
          ) : debouncedSearchTerm.length > 2 ? (
            <div className="p-4 text-center text-gray-500">
              {t("no-results-found")}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
