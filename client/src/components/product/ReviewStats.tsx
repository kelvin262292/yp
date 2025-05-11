import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../ui/card";
import { Rating } from "./Rating";
import { Progress } from "../ui/progress";

interface ReviewStatsProps {
  stats: {
    averageRating: number;
    totalReviews: number;
    distribution: { rating: number; count: number }[];
  };
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
  const { t } = useTranslation();
  const { averageRating, totalReviews, distribution } = stats;

  // Tạo đầy đủ distribution cho mỗi rating từ 1-5
  const fullDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1;
    const found = distribution.find((d) => d.rating === rating);
    return {
      rating,
      count: found ? found.count : 0,
    };
  }).reverse(); // Để hiển thị 5 sao ở trên cùng

  // Tìm số lượng đánh giá lớn nhất trong distribution
  const maxCount = Math.max(...fullDistribution.map((d) => d.count), 1);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center justify-center space-y-2 md:w-1/3">
            <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
            <Rating value={averageRating} size="large" />
            <span className="text-sm text-muted-foreground">
              {t("based-on", { count: totalReviews })}
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {fullDistribution.map((d) => (
              <div key={d.rating} className="flex items-center gap-2">
                <div className="w-12 text-sm font-medium">
                  {d.rating} {t("star")}
                </div>
                <Progress
                  value={(d.count / maxCount) * 100}
                  className="h-2 flex-1"
                />
                <div className="w-12 text-sm text-right">
                  {((d.count / totalReviews) * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 