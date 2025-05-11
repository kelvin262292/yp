import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

type FormData = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
  paymentMethod: string;
};

const CheckoutForm = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: '',
      province: '',
      postalCode: '',
      notes: '',
      paymentMethod: 'cod'
    }
  });

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) {
      toast({
        title: t("cart-empty"),
        description: t("add-items-to-cart"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format cart items for order
      const cartItemsForOrder = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      // Create order
      const response = await apiRequest("POST", "/api/orders", {
        totalAmount: total,
        shippingName: data.fullName,
        shippingPhone: data.phone,
        shippingAddress: data.address,
        shippingCity: data.city,
        shippingProvince: data.province,
        shippingPostalCode: data.postalCode,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        cartItems: cartItemsForOrder
      });

      if (response.ok) {
        const orderData = await response.json();
        
        // Clear cart after successful order
        clearCart();
        
        // Check if payment method requires redirect
        if (data.paymentMethod === 'stripe') {
          // Handle Stripe payment (would redirect to payment page)
          // For now, simulate redirect
          setLocation(`/checkout/payment/${orderData.id}`);
        } else {
          // For COD, redirect to success page
          setLocation(`/checkout/success/${orderData.id}`);
        }

        toast({
          title: t("order-placed-successfully"),
          description: t("order-placed-successfully-desc"),
        });
      } else {
        const errorData = await response.json();
        toast({
          title: t("order-placement-failed"),
          description: errorData.message || t("please-try-again"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: t("network-error"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("checkout")}</CardTitle>
        <CardDescription>{t("shipping-payment-details")}</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("shipping-information")}</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("full-name")} <span className="text-red-500">*</span></Label>
                <Input 
                  id="fullName"
                  {...register("fullName", { required: true })}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && <p className="text-red-500 text-sm">{t("full-name-required")}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")} <span className="text-red-500">*</span></Label>
                <Input 
                  id="phone"
                  {...register("phone", { required: true })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm">{t("phone-required")}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">{t("address")} <span className="text-red-500">*</span></Label>
              <Input 
                id="address"
                {...register("address", { required: true })}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-sm">{t("address-required")}</p>}
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">{t("city")}</Label>
                <Input 
                  id="city"
                  {...register("city")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">{t("province")}</Label>
                <Input 
                  id="province"
                  {...register("province")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">{t("postal-code")}</Label>
                <Input 
                  id="postalCode"
                  {...register("postalCode")}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("payment-method")}</h3>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">{t("select-payment-method")}</Label>
              <Select
                onValueChange={(value) => setValue("paymentMethod", value)}
                defaultValue="cod"
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select-payment-method")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">{t("cash-on-delivery")}</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t("order-notes")}</Label>
            <Textarea 
              id="notes"
              placeholder={t("order-notes-placeholder")}
              {...register("notes")}
            />
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>{t("subtotal")}</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>{t("shipping")}</span>
              <span>{t("free")}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>{t("total")}</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocation("/cart")}
          >
            {t("back-to-cart")}
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 animate-spin">⟳</span>
                {t("processing")}
              </>
            ) : (
              t("place-order")
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CheckoutForm; 