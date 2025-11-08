
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../Types';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [topSalesProducts, setTopSalesProducts] = useState<Product[]>([]);

  useEffect(() => {
    const productsData: Product[] = JSON.parse(localStorage.getItem('productos') || '[]');
    setFeaturedProducts(productsData.slice(0, 3));
    setOfferProducts(productsData.slice(3, 6));
    setTopSalesProducts(productsData.slice(6, 9));
  }, []);

  return (
    <main id="main-content">
      {/* --- SECCIÓN HERO --- */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Sube de nivel tu setup</h1>
          <p>Consolas, accesorios, PC gamers y más. Envíos a todo Chile.</p>
          <a className="btn" href="/products">Ver productos</a>
        </div>
      </section>

      {/* --- SECCIÓN DESTACADOS --- */}
      <section className="featured">
        <h2> ¡Destacados! </h2>
        {/* --- CORRECCIÓN AQUÍ --- */}
        <div id="featured-grid" className="grid"> 
          {featuredProducts.map(product => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      </section>

      {/* --- SECCIÓN OFERTAS --- */}
      <div className="ofertas">
        <h2> ¡Ofertas del Mes! </h2>
        <div className="grid"> 
          {offerProducts.map(product => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      </div>

      {/* --- SECCIÓN TOP VENTAS  --- */}
      <section className="top-ventas">
        <h2> ¡Top Ventas! </h2>
        <div className="grid">
          {topSalesProducts.map(product => (
            <ProductCard key={product.code} product={product} />
          ))}
        </div>
      </section>

      {/* --- SECCIÓN TIENDA --- */}
      <section className="store-location">
        <h2>📍 Nuestra Tienda Level‑Up Gamer</h2>
        <p>Visítanos en Concepción, Chile. ¡Tenemos todo para gamers!</p>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2203.7761997001007!2d-73.0623553839439!3d-36.79385884515205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses-419!2scl!4v1757800244202!5m2!1ses-419!2scl"
            width="600" height="450" style={{ border: 0 }} 
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </section>

      {/* --- SECCIÓN MARCAS --- */}
      <section className="marcas">
        <h2> ¡Marcas Gamer!</h2>
        <div className="brands-grid">
          <img src="/img/PlayStation-Logo.wine.png" alt="PlayStation" />
          <img src="/img/xbox-icon-2.png" alt="Xbox" />
          <img src="/img/razer-logo-black-and-white.png" alt="Razer" />
          <img src="/img/hyperxlogo.png" alt="HyperX" />
          <img src="/img/asus-6630-logo-png-transparent.png" alt="ASUS ROG" />
        </div>
      </section>
    </main>
  );
}

export default HomePage;