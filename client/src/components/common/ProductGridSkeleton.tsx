import React from "react";
import { Skeleton } from "../ui/skeleton";

interface ProductGridSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 12,
  columns = 4,
  className = "",
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case 5:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
      case 6:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  return (
    <div className={`grid ${getGridCols()} gap-4 ${className}`}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-white border rounded-lg p-3 h-full flex flex-col"
          >
            <Skeleton className="w-full h-40 rounded-md mb-3" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <div className="flex items-center mt-1 mb-2">
              <Skeleton className="h-3 w-3 rounded-full mr-1" />
              <Skeleton className="h-3 w-3 rounded-full mr-1" />
              <Skeleton className="h-3 w-3 rounded-full mr-1" />
              <Skeleton className="h-3 w-3 rounded-full mr-1" />
              <Skeleton className="h-3 w-3 rounded-full mr-1" />
              <Skeleton className="h-3 w-12 ml-1" />
            </div>
            <div className="mt-auto">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProductGridSkeleton; 