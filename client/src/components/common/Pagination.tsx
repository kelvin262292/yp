import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  className = "",
}) => {
  const { t } = useTranslation();

  // No pagination needed for 1 page
  if (totalPages <= 1) {
    return null;
  }

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show max 5 page numbers at once

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end page numbers
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 2) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis before middle pages if necessary
      if (startPage > 2) {
        pageNumbers.push("ellipsis1");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis after middle pages if necessary
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis2");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <nav
      className={`flex items-center justify-center space-x-1 ${className}`}
      aria-label={t("pagination")}
    >
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label={t("previous-page")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {showPageNumbers &&
        getPageNumbers().map((pageNumber, index) => {
          if (pageNumber === "ellipsis1" || pageNumber === "ellipsis2") {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="ghost"
                size="icon"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }

          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(pageNumber as number)}
              aria-label={t("go-to-page", { page: pageNumber })}
              aria-current={currentPage === pageNumber ? "page" : undefined}
            >
              {pageNumber}
            </Button>
          );
        })}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={t("next-page")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}; 