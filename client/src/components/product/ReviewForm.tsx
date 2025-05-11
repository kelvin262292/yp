import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useAuth } from "../../hooks/useAuth";
import { Rating } from "./Rating";

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewSubmitted,
}) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error(t("please-login-to-review"));
      return;
    }

    if (rating < 1) {
      toast.error(t("please-select-rating"));
      return;
    }

    if (!title.trim()) {
      toast.error(t("please-enter-review-title"));
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          comment,
          rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      toast.success(t("review-submitted-successfully"));
      setTitle("");
      setComment("");
      setRating(5);
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error ? error.message : t("failed-to-submit-review")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 border rounded-md bg-muted/50">
        <p>{t("login-to-write-review")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="rating" className="font-medium">
          {t("your-rating")}
        </label>
        <Rating
          value={rating}
          onChange={setRating}
          size="large"
          editable
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="title" className="font-medium">
          {t("review-title")}
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("review-title-placeholder")}
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="comment" className="font-medium">
          {t("your-review")}
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("review-comment-placeholder")}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("submitting") : t("submit-review")}
      </Button>
    </form>
  );
}; 