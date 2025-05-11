import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tag, X } from "lucide-react";

interface DiscountCode {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
}

interface DiscountCodeFormProps {
  subtotal: number;
  onApplyDiscount: (discountCode: DiscountCode) => void;
  onRemoveDiscount: () => void;
  appliedDiscount: DiscountCode | null;
}

export const DiscountCodeForm: React.FC<DiscountCodeFormProps> = ({
  subtotal,
  onApplyDiscount,
  onRemoveDiscount,
  appliedDiscount,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error(t("please-login-to-apply-discount"));
      return;
    }
    
    if (!code.trim()) {
      setError(t("please-enter-discount-code"));
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/discount-codes/${code.trim()}/validate`);
      const data = await response.json();
      
      if (!response.ok || !data.valid) {
        setError(data.error || t("invalid-discount-code"));
        return;
      }
      
      // Check if min order value met
      if (subtotal < data.discountCode.minOrderValue) {
        setError(
          t("minimum-order-value-not-met", {
            value: data.discountCode.minOrderValue,
          })
        );
        return;
      }
      
      // Apply discount
      onApplyDiscount(data.discountCode);
      setCode("");
      toast.success(t("discount-applied-successfully"));
    } catch (error) {
      console.error("Error validating discount code:", error);
      setError(t("failed-to-validate-discount-code"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    onRemoveDiscount();
    toast.success(t("discount-removed"));
  };

  // Calculate discount amount for display
  const calculateDiscountAmount = (discount: DiscountCode): number => {
    if (discount.discountType === "percentage") {
      const amount = subtotal * (discount.discountValue / 100);
      return discount.maxDiscountAmount
        ? Math.min(amount, discount.maxDiscountAmount)
        : amount;
    } else {
      // fixed amount
      return Math.min(discount.discountValue, subtotal);
    }
  };

  // Format discount for display
  const formatDiscount = (discount: DiscountCode): string => {
    if (discount.discountType === "percentage") {
      return `${discount.discountValue}%`;
    } else {
      return t("currency", { value: discount.discountValue });
    }
  };

  return (
    <div className="space-y-4">
      {!appliedDiscount ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("enter-discount-code")}
              className="pr-10"
              disabled={isLoading}
            />
            <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("applying") : t("apply")}
          </Button>
        </form>
      ) : (
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{appliedDiscount.code}</span>
              <span className="text-xs bg-accent text-white px-2 py-0.5 rounded">
                {formatDiscount(appliedDiscount)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {t("discount")}: {t("currency", { value: calculateDiscountAmount(appliedDiscount) })}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveDiscount}
            title={t("remove-discount")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}; 