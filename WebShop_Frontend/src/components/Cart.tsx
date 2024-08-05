import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CartItem } from './models/props/cartItem';
import { CartContextType } from './models/props/cartContext';

interface CartProviderProps {
  children: ReactNode;
}

const initialCartContext: CartContextType = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
};

export const CartContext = createContext<CartContextType>(initialCartContext);

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        newCart = [...prevCart, item];
      }
      newCart.forEach((cartItem) => {
      });
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
