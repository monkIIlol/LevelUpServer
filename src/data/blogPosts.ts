
import type { BlogPost } from '../Types';

export const blogPosts: BlogPost[] = [
  {
    id: 'teclado-mecanico', 
    title: 'Cómo elegir tu primer teclado mecánico',
    summary: 'Guía rápida para no equivocarte al comprar.',
    imageUrl: '/img/teclados.jpg', 
    content: `
      <img src="/img/tecladomecanico.avif" alt="Teclado mecánico" />
      <p>Si estás buscando tu primer teclado mecánico, esta guía te ayudará a elegir el adecuado...</p>
      <h2>1. Tipos de switches</h2>
      <ul>
        <li><strong>Lineales:</strong> Suaves y sin clic audible...</li>
        <li><strong>Táctiles:</strong> Con respuesta física...</li>
        <li><strong>Clicky:</strong> Con sonido de clic...</li>
      </ul>
      <h2>2. Tamaño y diseño</h2>
      <ul>
        <li><strong>Full-size:</strong> Incluye todas las teclas...</li>
        <li><strong>Tenkeyless (TKL):</strong> Sin el teclado numérico...</li>
        <li><strong>60%:</strong> Muy compacto...</li>
      </ul>
      <h2>3. Ergonomía y confort</h2>
      <p>Considera la altura del teclado, la inclinación y la presencia de reposamuñecas...</p>
      <h2>4. Funciones adicionales</h2>
      <ul>
        <li>Retroiluminación RGB personalizable.</li>
        <li>Teclas macro programables...</li>
        <li>Software de personalización...</li>
      </ul>
      <h2>5. Presupuesto</h2>
      <p>Los precios varían según marca... Siguiendo estos consejos, podrás elegir un teclado mecánico...</p>
    `
  },
  {
    id: 'rtx-esports', 
    title: 'RTX: ¿vale la pena para e-sports?',
    summary: 'Analizamos si necesitas trazado de rayos para competir.',
    imageUrl: '/img/valelapena.jpg',
    content: `
      <img src="/img/RTXNVIDIA.jpg" alt="Tarjeta gráfica RTX" />
      <p>Las tarjetas gráficas RTX de NVIDIA han revolucionado la experiencia gaming...</p>
      <h2>1. Rendimiento en juegos competitivos</h2>
      <p>Los juegos de e‑sports suelen priorizar tasas de frames altas...</p>
      <h2>2. Trazado de rayos (Ray Tracing)</h2>
      <p>El ray tracing mejora la iluminación y los reflejos...</p>
      <h2>3. Tecnología DLSS</h2>
      <p>DLSS (Deep Learning Super Sampling) permite aumentar FPS...</p>
      <h2>4. Precio y relación costo-beneficio</h2>
      <p>Las tarjetas RTX suelen ser caras...</p>
      <h2>Conclusión</h2>
      <p>Si eres un gamer competitivo enfocado en e‑sports, una tarjeta RTX no es imprescindible...</p>
    `
  }
];