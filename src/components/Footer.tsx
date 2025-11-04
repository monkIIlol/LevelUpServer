import React from 'react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="cols">
                <section>
                    <h4>Level‑Up Gamer</h4>
                    <p>Tu tienda gamer en todo Chile.</p>
                </section>
                <section>
                    <h4>Navegación</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Productos</a></li>
                        <li><a href="/about">Nosotros</a></li>
                        <li><a href="/contact">Contacto</a></li>
                    </ul>
                </section>
                <section>
                    <h4>Redes</h4>
                    <ul className="social">
                        <li>
                            <a href="https://www.instagram.com/level.uppgamer2025/" aria-label="Instagram">
                                <img src="/img/instagram.png" alt="Instagram" /> Instagram
                            </a>
                        </li>
                        <li>
                            <a href="https://x.com/leveluppgamer12" aria-label="Twitter">
                                <img src="/img/twitter.png" alt="Twitter" /> Twitter
                            </a>
                        </li>
                        <li>
                            <a href="#" aria-label="YouTube">
                                <img src="/img/youtube.png" alt="YouTube" /> YouTube
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
            <small>© Level-Up Gamer 2025 · Todos los derechos reservados</small>
        </footer>
    );
}

export default Footer;