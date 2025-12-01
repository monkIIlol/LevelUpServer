
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, CartContextType } from '../Types';

export const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider = ({ children }: { children: React.ReactNode }) => {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const CART_STORAGE_KEY = 'mi_carrito';

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  }

  // --- LÓGICA DEL CARRITO ---
  // En src/context/CartContext.tsx

  // AHORA RECIBE EL OBJETO PRODUCTO COMPLETO
  const addToCart = (productToAdd: Product) => {
    
    // 1. Validar Stock (Usamos el stock que viene directo de la BD)
    if (productToAdd.stock === 0) {
        alert("Lo sentimos, este producto está agotado.");
        return;
    }

    const existingItem = cartItems.find(item => item.code === productToAdd.code);
    let newCart: CartItem[];

    if (existingItem) {
      // Validar stock máximo
      if (existingItem.qty + 1 > productToAdd.stock!) {
          alert(`No puedes agregar más. Solo quedan ${productToAdd.stock} unidades.`);
          return;
      }

      newCart = cartItems.map(item =>
        item.code === productToAdd.code ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      // Crear nuevo item usando los datos directos
      const newItem: CartItem = {
        code: productToAdd.code,
        name: productToAdd.name,
        price: productToAdd.price,
        qty: 1
      };
      newCart = [...cartItems, newItem];
    }
    
    updateCart(newCart);
  };

  
  const increaseQty = (code: string) => {
    const newCart = cartItems.map(item =>
      item.code === code ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(newCart);
  };
  const decreaseQty = (code: string) => {
    const newCart = cartItems.map(item =>
      item.code === code ? { ...item, qty: Math.max(1, item.qty - 1) } : item
    );
    updateCart(newCart);
  };
  const removeFromCart = (code: string) => {
    if (confirm('¿Seguro que quieres quitar este producto?')) {
      const newCart = cartItems.filter(item => item.code !== code);
      updateCart(newCart);
    }
  };
  const clearCart = () => {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
      updateCart([]);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      totalPrice,
      addToCart,
      increaseQty,
      decreaseQty,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}