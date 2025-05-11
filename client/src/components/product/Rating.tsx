import React from "react";
import { cn } from "../../lib/utils";
import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "small" | "medium" | "large";
  editable?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  size = "medium",
  editable = false,
  className,
}) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  
  const sizeClasses = {
    small: "h-3 w-3",
    medium: "h-4 w-4",
    large: "h-6 w-6",
  };
  
  const starSize = sizeClasses[size];
  
  const handleClick = (starIndex: number) => {
    if (editable && onChange) {
      onChange(starIndex + 1);
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          onClick={() => handleClick(i)}
          className={cn(
            "cursor-default",
            editable && "cursor-pointer hover:scale-110 transition-transform"
          )}
        >
          {i < fullStars ? (
            <Star
              className={cn("fill-yellow-400 text-yellow-400", starSize)}
            />
          ) : i === fullStars && hasHalfStar ? (
            <StarHalf
              className={cn("fill-yellow-400 text-yellow-400", starSize)}
            />
          ) : (
            <Star
              className={cn("text-gray-300", starSize)}
            />
          )}
        </div>
      ))}
    </div>
  );
}; 