// En src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, CartContextType } from '../Types';
// (No importamos 'products' aquí, lo leemos de localStorage en 'addToCart')

// 1. Creamos y EXPORTAMOS el Context (UNA SOLA VEZ)
export const CartContext = createContext<CartContextType | undefined>(undefined);

// 2. Creamos el "Proveedor" (el componente con la lógica)
export const CartProvider = ({ children }: { children: React.ReactNode }) => {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const CART_STORAGE_KEY = 'mi_carrito';

  // Al cargar la app, revisa el localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Función genérica para guardar cambios
  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  }

  // --- LÓGICA DEL CARRITO (Corregida para leer de localStorage) ---
  const addToCart = (code: string) => {
    // Leemos la lista de productos COMPLETA desde la "bodega"
    const allProducts: Product[] = JSON.parse(localStorage.getItem('productos') || '[]');
    const productToAdd = allProducts.find(p => p.code === code);

    if (!productToAdd) {
      console.error("Error: Producto no encontrado. No se pudo añadir al carrito.");
      return;
    }

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

  // --- (El resto de tus funciones: increaseQty, decreaseQty, etc.) ---
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

// Hook para usar el carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}