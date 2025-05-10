import React, { createContext, useState, useEffect } from "react";
import { Product, CartItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { nanoid } from "nanoid";

interface CartContextType {
  cartItems: (CartItem & { product: Product })[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItemQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [cartId, setCartId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize cart session
  useEffect(() => {
    const storedSessionId = localStorage.getItem("yapee_cart_session_id");
    const newSessionId = storedSessionId || nanoid();
    
    if (!storedSessionId) {
      localStorage.setItem("yapee_cart_session_id", newSessionId);
    }
    
    setSessionId(newSessionId);
    
    // Get cart by session ID
    fetchCart(newSessionId);
  }, []);

  // Fetch current cart
  const fetchCart = async (sid: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart/${sid}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      
      const data = await response.json();
      setCartId(data.id);
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product: Product, quantity: number): Promise<void> => {
    if (!cartId) {
      // Create a new cart first
      try {
        const response = await apiRequest("POST", "/api/cart", { sessionId });
        const newCart = await response.json();
        setCartId(newCart.id);
        
        // Now add the item
        return addItemToCart(newCart.id, product.id, quantity);
      } catch (error) {
        console.error("Error creating cart:", error);
        throw error;
      }
    } else {
      // Add to existing cart
      return addItemToCart(cartId, product.id, quantity);
    }
  };

  // Helper function to add item to cart
  const addItemToCart = async (cid: number, productId: number, quantity: number): Promise<void> => {
    try {
      const response = await apiRequest("POST", "/api/cart/items", {
        cartId: cid,
        productId,
        quantity
      });
      
      const data = await response.json();
      setCartItems(data.cart.items || []);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = async (itemId: number, quantity: number): Promise<void> => {
    try {
      await apiRequest("PUT", `/api/cart/items/${itemId}`, { quantity });
      
      // Update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      throw error;
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId: number): Promise<void> => {
    try {
      await apiRequest("DELETE", `/api/cart/items/${itemId}`);
      
      // Update local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  };

  // Clear cart (remove all items)
  const clearCart = async (): Promise<void> => {
    try {
      // Since the API doesn't have a "clear cart" endpoint,
      // we'll remove each item individually
      await Promise.all(cartItems.map(item => removeCartItem(item.id)));
      
      // Update local state
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
