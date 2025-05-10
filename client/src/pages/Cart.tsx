import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { language, t } = useLanguage();
  const { cartItems, updateCartItemQuantity, removeCartItem, isLoading: cartLoading } = useCart();
  const { toast } = useToast();
  
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = cartItems.some(item => item.product.freeShipping) ? 0 : 30000;
  const total = subtotal + shippingFee;
  
  // Handle quantity change
  const handleQuantityChange = (cartItemId: number, productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(prev => ({ ...prev, [cartItemId]: true }));
    
    updateCartItemQuantity(cartItemId, newQuantity)
      .catch(error => {
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsUpdating(prev => ({ ...prev, [cartItemId]: false }));
      });
  };
  
  // Handle remove item
  const handleRemoveItem = () => {
    if (itemToRemove === null) return;
    
    setIsRemoving(true);
    
    removeCartItem(itemToRemove)
      .catch(error => {
        toast({
          title: t("error"),
          description: error.message,
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsRemoving(false);
        setItemToRemove(null);
      });
  };

  // Handle increment/decrement quantity
  const incrementQuantity = (cartItemId: number, productId: number, currentQuantity: number) => {
    handleQuantityChange(cartItemId, productId, currentQuantity + 1);
  };
  
  const decrementQuantity = (cartItemId: number, productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      handleQuantityChange(cartItemId, productId, currentQuantity - 1);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("your-cart")} - Yapee</title>
        <meta name="description" content={t("your-cart-description")} />
      </Helmet>
      
      <div className="bg-light py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/cart">{t("your-cart")}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-2xl font-bold mb-6">{t("your-cart")}</h1>
          
          {cartLoading ? (
            // Loading state
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="p-4 border-b last:border-b-0">
                      <div className="flex items-center">
                        <Skeleton className="w-16 h-16 rounded mr-4" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="w-32 text-right">
                          <Skeleton className="h-4 w-20 mb-2 ml-auto" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <Skeleton className="h-5 w-24 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-5 w-32 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            // Cart with items
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  {cartItems.map(item => {
                    const productName = language === 'en' ? item.product.nameEn : 
                                        language === 'zh' ? item.product.nameZh : 
                                        item.product.name;
                                        
                    return (
                      <div key={item.id} className="p-4 border-b last:border-b-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                          {/* Product Image */}
                          <Link href={`/product/${item.product.slug}`}>
                            <a className="w-16 h-16 mr-4 mb-2 sm:mb-0">
                              <img 
                                src={item.product.imageUrl} 
                                alt={productName} 
                                className="w-full h-full object-contain"
                              />
                            </a>
                          </Link>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${item.product.slug}`}>
                              <a className="text-sm font-medium hover:text-secondary line-clamp-2">
                                {productName}
                              </a>
                            </Link>
                            
                            {/* Mobile Price (visible on small screens) */}
                            <div className="mt-1 sm:hidden">
                              <span className="text-accent font-semibold">
                                {formatPrice(item.product.price, language)}
                              </span>
                              {item.product.originalPrice && (
                                <span className="text-gray-500 text-xs line-through ml-2">
                                  {formatPrice(item.product.originalPrice, language)}
                                </span>
                              )}
                            </div>
                            
                            {/* Quantity Control for mobile */}
                            <div className="flex mt-2 sm:hidden">
                              <div className="flex border rounded">
                                <button 
                                  className="px-2 text-gray-600 hover:text-primary"
                                  onClick={() => decrementQuantity(item.id, item.productId, item.quantity)}
                                  disabled={isUpdating[item.id]}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <span className="px-4 py-1">{item.quantity}</span>
                                <button 
                                  className="px-2 text-gray-600 hover:text-primary"
                                  onClick={() => incrementQuantity(item.id, item.productId, item.quantity)}
                                  disabled={isUpdating[item.id]}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                              <button 
                                className="ml-4 text-gray-500 hover:text-accent"
                                onClick={() => setItemToRemove(item.id)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </div>
                          
                          {/* Price and Quantity (hidden on mobile) */}
                          <div className="hidden sm:flex items-center ml-4">
                            {/* Price */}
                            <div className="w-32 text-right mr-4">
                              <span className="text-accent font-semibold block">
                                {formatPrice(item.product.price, language)}
                              </span>
                              {item.product.originalPrice && (
                                <span className="text-gray-500 text-xs line-through">
                                  {formatPrice(item.product.originalPrice, language)}
                                </span>
                              )}
                            </div>
                            
                            {/* Quantity Control */}
                            <div className="flex">
                              <div className="flex border rounded">
                                <button 
                                  className="px-2 text-gray-600 hover:text-primary"
                                  onClick={() => decrementQuantity(item.id, item.productId, item.quantity)}
                                  disabled={isUpdating[item.id]}
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <span className="px-4 py-1">{item.quantity}</span>
                                <button 
                                  className="px-2 text-gray-600 hover:text-primary"
                                  onClick={() => incrementQuantity(item.id, item.productId, item.quantity)}
                                  disabled={isUpdating[item.id]}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                              <button 
                                className="ml-4 text-gray-500 hover:text-accent"
                                onClick={() => setItemToRemove(item.id)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h2 className="text-lg font-semibold mb-4">{t("order-summary")}</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("subtotal")}</span>
                      <span>{formatPrice(subtotal, language)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("shipping")}</span>
                      <span>
                        {shippingFee > 0 
                          ? formatPrice(shippingFee, language) 
                          : t("free-shipping")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2 mb-4">
                    <div className="flex justify-between font-semibold">
                      <span>{t("total")}</span>
                      <span className="text-accent">{formatPrice(total, language)}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-secondary hover:bg-secondary/90">
                    {t("checkout")}
                  </Button>
                  
                  <div className="mt-4 text-center">
                    <Link href="/">
                      <a className="text-primary hover:underline text-sm">
                        <i className="fas fa-arrow-left mr-1"></i>
                        {t("continue-shopping")}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Empty Cart
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <i className="fas fa-shopping-cart text-6xl text-gray-300"></i>
              </div>
              <h2 className="text-2xl font-bold mb-2">{t("empty-cart")}</h2>
              <p className="text-gray-600 mb-6">{t("your-cart-is-empty")}</p>
              <Link href="/">
                <Button className="bg-secondary hover:bg-secondary/90">
                  {t("browse-products")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={itemToRemove !== null} onOpenChange={() => !isRemoving && setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("remove-item")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("remove-item-confirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveItem} 
              disabled={isRemoving}
              className="bg-accent hover:bg-accent/90"
            >
              {isRemoving ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fas fa-trash-alt mr-2"></i>
              )}
              {t("remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Cart;
