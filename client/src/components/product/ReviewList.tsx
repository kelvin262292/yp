import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Rating } from "./Rating";
import { ReviewStats } from "./ReviewStats";
import { ReviewForm } from "./ReviewForm";
import { Badge } from "../ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: { rating: number; count: number }[];
}

interface ReviewListProps {
  productId: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewFormVisible, setReviewFormVisible] = useState(false);

  const fetchReviews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/products/${productId}/reviews?page=${pageNum}&limit=5`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews);
      setStats(data.stats);
      setPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(t("failed-to-load-reviews"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      fetchReviews(newPage);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const response = await fetch(
        `/api/products/${productId}/reviews/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      toast.success(t("review-deleted-successfully"));
      fetchReviews(page);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(t("failed-to-delete-review"));
    }
  };

  const toggleReviewForm = () => {
    setReviewFormVisible(!reviewFormVisible);
  };

  const handleReviewSubmitted = () => {
    setReviewFormVisible(false);
    fetchReviews(1); // Reload first page to show the new review
  };

  if (loading && !reviews.length) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  // Check if user has already reviewed the product
  const hasUserReviewed = reviews.some(
    (review) => user && review.userId === user.id
  );

  return (
    <div className="space-y-6">
      {stats && <ReviewStats stats={stats} />}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {reviews.length > 0
            ? t("customer-reviews", { count: stats?.totalReviews })
            : t("no-reviews-yet")}
        </h3>
        {!hasUserReviewed && !reviewFormVisible && (
          <Button onClick={toggleReviewForm}>{t("write-a-review")}</Button>
        )}
      </div>

      {reviewFormVisible && (
        <Card>
          <CardHeader>
            <CardTitle>{t("write-a-review")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ReviewForm
              productId={productId}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </CardContent>
        </Card>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{review.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Rating value={review.rating} size="small" />
                      <span className="text-sm text-muted-foreground">
                        {review.user.fullName || review.user.username}
                      </span>
                      {review.isVerifiedPurchase && (
                        <Badge variant="outline" className="text-xs">
                          {t("verified-purchase")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {user && user.id === review.userId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toast.error(t("edit-not-implemented"))}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t("edit-review")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-destructive cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("delete-review")}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("confirm-delete")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("confirm-delete-review-message")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                {t("delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-1">
                {review.comment && <p className="text-sm">{review.comment}</p>}
              </CardContent>
              <CardFooter className="pt-1 text-xs text-muted-foreground">
                {review.createdAt && (
                  <time dateTime={review.createdAt}>
                    {format(new Date(review.createdAt), "PPP")}
                  </time>
                )}
              </CardFooter>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                {t("previous")}
              </Button>
              <span className="flex items-center px-2">
                {t("page-x-of-y", { current: page, total: totalPages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                {t("next")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              {t("no-reviews-yet")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 