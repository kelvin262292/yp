import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { Product } from "@shared/schema";

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  const { 
    cartItems, 
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    isLoading 
  } = context;
  
  return {
    cartItems,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    isLoading
  };
};
