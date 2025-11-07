
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../Types';

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const ProductDetailPage = () => {
    const { code } = useParams<{ code: string }>();
    const { addToCart } = useCart();

    const products: Product[] = JSON.parse(localStorage.getItem('productos') || '[]');

    const product = products.find(p => p.code === code);

    if (!product) {
        return (
            <main id="main-content">
                <header className="page-header">
                    <h1>Producto no encontrado</h1>
                    <Link to="/products" className="btn">← Volver a productos</Link>
                </header>
            </main>
        );
    }

    return (
        <main id="main-content">
            <article id="product-detail">
                <header>
                    <h1>{product.name}</h1>
                </header>
                <img src={`/${product.img}`} alt={product.name} />
                <p id="product-desc">{product.desc}</p>

                <section id="product-details">
                    <h3>Detalles</h3>
                    <ul>
                        {product.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                        ))}
                    </ul>
                </section>

                <button
                    className="btn"
                    data-add={product.code}
                    onClick={() => addToCart(product.code)}
                >
                    Añadir al carrito
                </button>
            </article>

            <Link to="/products" className="btn" style={{ margin: '1rem auto', display: 'block' }}>
                ← Volver a productos
            </Link>
        </main>
    );
}

export default ProductDetailPage;