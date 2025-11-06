// En src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, CartContextType } from '../Types';
import { products } from '../data/products';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const CART_STORAGE_KEY = 'mi_carrito';

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Función genérica para guardar cambios en el estado y en localStorage
  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  }

  // --- LÓGICA COMPLETA DEL CARRITO ---

  const addToCart = (code: string) => {
    const productToAdd = products.find(p => p.code === code);
    if (!productToAdd) return;
    
    const existingItem = cartItems.find(item => item.code === code);
    let newCart: CartItem[];

    if (existingItem) {

      newCart = cartItems.map(item =>
        item.code === code ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      const newItem: CartItem = {
        code: productToAdd.code,
        name: productToAdd.name,
        price: productToAdd.price,
        qty: 1
      };
      newCart = [...cartItems, newItem];
    }
    updateCart(newCart);
    alert(`Añadido: ${productToAdd.name}`);
  };

  // --- NUEVAS FUNCIONES ---

  // Aumentar la cantidad de un item
  const increaseQty = (code: string) => {
    const newCart = cartItems.map(item =>
      item.code === code ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(newCart);
  };

  // Disminuir la cantidad de un item
  const decreaseQty = (code: string) => {
    const newCart = cartItems.map(item =>
      item.code === code ? { ...item, qty: Math.max(1, item.qty - 1) } : item 
    );
    updateCart(newCart);
  };

  // Eliminar un item por completo
  const removeFromCart = (code: string) => {
    if (confirm('¿Seguro que quieres quitar este producto?')) {
      const newCart = cartItems.filter(item => item.code !== code);
      updateCart(newCart);
    }
  };

  // Vaciar todo el carrito
  const clearCart = () => {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
      updateCart([]); 
    }
  };

  // --- CÁLCULOS ---
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
  
  // Función para formatear el dinero (la necesitamos aquí)
  const money = (clp: number) => { 
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp); 
  }

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

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}