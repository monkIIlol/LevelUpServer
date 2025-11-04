import React from 'react';

const Header = () => {
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
                    {/* Vista para cuando NO hay sesión */}
                    <div id="logged-out-view">
                        <a href="/login" className="header-login-link">Iniciar sesión</a>
                        <a href="/register" className="header-register-btn">Registro</a>
                    </div>
                    {/* Vista para cuando SÍ hay sesión */}
                    <div id="logged-in-view" style={{ display: 'none' }}>
                        <div className="user-menu">
                            <button id="user-menu-button" className="user-menu-trigger"></button>
                            <div id="user-dropdown" className="dropdown-content">
                                <a href="#" id="logout-button">Cerrar Sesión</a>
                            </div>
                        </div>
                    </div>
                </div>
                <a className="cart" href="/carrito" aria-label="Carrito">
                    🛒 <span id="cart-count" aria-live="polite">0</span>
                </a>
                <button className="menu-toggle" aria-label="Abrir menú">☰</button>
            </div>
        </header>
    );
}

export default Header;