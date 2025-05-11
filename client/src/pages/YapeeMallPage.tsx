import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ProductCard } from "../components/common/ProductCard";
import ProductGridSkeleton from "../components/common/ProductGridSkeleton";
import { Pagination } from "../components/common/Pagination";
import { useCart } from "../hooks/useCart";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ShoppingBag, Search, Check } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  nameEn: string;
  nameZh: string;
  logoUrl: string;
  description?: string;
}

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
  brand: Brand;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const YapeeMallPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBrands = async () => {
      try {
        const response = await fetch("/api/brands/featured");
        if (!response.ok) {
          throw new Error("Failed to fetch featured brands");
        }
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching featured brands:", error);
      }
    };

    fetchFeaturedBrands();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: pagination.currentPage.toString(),
          limit: pagination.itemsPerPage.toString(),
          sort: sortOption,
        });

        if (selectedBrandId !== "all") {
          params.append("brandId", selectedBrandId);
        }

        const response = await fetch(`/api/yapee-mall/products?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(t("failed-to-load-products"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.currentPage, selectedBrandId, sortOption, t]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrandId(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

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

  return (
    <>
      <Helmet>
        <title>{t("yapee-mall")} | Yapee</title>
      </Helmet>

      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              YapeeMall
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("yapee-mall-description")}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge className="bg-primary text-white">
              <Check className="h-3.5 w-3.5 mr-1" />
              {t("authentic-guarantee")}
            </Badge>
          </div>
        </div>

        {/* Brand logos */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-6">
          <Button
            variant={selectedBrandId === "all" ? "default" : "outline"}
            className="h-16"
            onClick={() => handleBrandChange("all")}
          >
            {t("all-brands")}
          </Button>
          {brands.map((brand) => (
            <Button
              key={brand.id}
              variant={
                selectedBrandId === brand.id.toString() ? "default" : "outline"
              }
              className="h-16 p-2"
              onClick={() => handleBrandChange(brand.id.toString())}
            >
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-full w-full object-contain"
              />
            </Button>
          ))}
        </div>

        {/* Filters and sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-muted-foreground">
              {t("showing-results", {
                count: products.length,
                total: pagination.totalItems,
              })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("sort-by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("newest")}</SelectItem>
                <SelectItem value="price_asc">
                  {t("price-low-to-high")}
                </SelectItem>
                <SelectItem value="price_desc">
                  {t("price-high-to-low")}
                </SelectItem>
                <SelectItem value="rating_desc">
                  {t("highest-rated")}
                </SelectItem>
                <SelectItem value="popularity">
                  {t("most-popular")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <ProductGridSkeleton count={12} columns={4} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("no-products-found")}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default YapeeMallPage; 