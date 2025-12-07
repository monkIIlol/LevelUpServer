
import React from 'react';
import { Link } from 'react-router-dom'; 

const AboutPage = () => {
  return (
    <main id="main-content" className="gamer-bg">
      <header className="page-header">
        <h1>Nosotros</h1>
      </header>

      <section className="history">
        <h2>Nuestra Historia</h2>
        <p>
          Nacimos en 2022 con la misión de acercar lo mejor del gaming a todo Chile. Desde entonces, hemos crecido
          hasta convertirnos en una comunidad con más de 500 clientes satisfechos, ofreciendo productos innovadores
          y un servicio excepcional.
        </p>
      </section>

      <section className="mission-vision">
        <div className="card">
          <h2> Misión</h2>
          <p>Proporcionar productos de alta calidad para gamers en todo Chile, con una experiencia de compra única.</p>
        </div>
        <div className="card">
          <h2> Visión</h2>
          <p>Ser la tienda online líder en productos para gamers en Chile, con innovación y servicio excepcional.</p>
        </div>
      </section>

      <section className="values">
        <h2>Valores</h2>
        <ul>
          <li>Innovación </li>
          <li>Calidad </li>
          <li>Comunidad </li>
          <li>Pasión por el gaming </li>
        </ul>
      </section>

      <section className="testimonials">
        <h2>Lo que dicen nuestros clientes</h2>
        <blockquote>
          “Excelente servicio, recibí mi teclado en 2 días. 100% recomendado.” — <cite>Camila G.</cite>
        </blockquote>
        <blockquote>
          “Muy buena atención y productos de calidad. Volveré a comprar seguro.” — <cite>Juan P.</cite>
        </blockquote>
      </section>

      <section className="cta">
        <Link to="/products" className="btn-primary">Explora nuestros productos 🎮</Link>
      </section>
    </main>
  );
}

export default AboutPage;