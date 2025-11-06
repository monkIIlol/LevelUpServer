// En src/components/Header.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // 1. IMPORTAMOS EL CEREBRO DEL CARRITO
import UserMenu from './UserMenu';

const Header = () => {
  const { currentUser } = useAuth();
  
  const { cartItems } = useCart();


  const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <header className="site-header">
      <div className="header-left">
        <a className="brand" href="/">
          <img src="/assets/logo.svg" alt="Logo Level‑Up Gamer" className="logo" />
          <span>Level‑Up Gamer</span>
        </a>
        <nav className="main-nav" aria-label="Principal">
          <a href="/">Home</a>
          <a href="/products">Productos</a>
          <a href="/blog">Blogs</a>
          <a href="/about">Nosotros</a>
          <a href="/contact">Contacto</a>
        </nav>
      </div>

      <div className="header-right">
        <div className="user-actions">
          {currentUser ? (
            <UserMenu />
          ) : (
            <div id="logged-out-view">
              <a href="/login" className="header-login-link">Iniciar sesión</a>
              <a href="/register" className="header-register-btn">Registro</a>
            </div>
          )}
        </div>
        
        <a className="cart" href="/carrito" aria-label="Carrito">
          🛒 <span id="cart-count" aria-live="polite">{totalItems}</span>
        </a>

        <button className="menu-toggle" aria-label="Abrir menú">☰</button>
      </div>
    </header>
  );
}

export default Header;