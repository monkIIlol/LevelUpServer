import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../Types';
import ProductCard from '../components/ProductCard'; // Importamos la tarjeta para reutilizarla

const ProductDetailPage = () => {
    const { code } = useParams<{ code: string }>();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const allProducts: Product[] = JSON.parse(localStorage.getItem('productos') || '[]');

        const foundProduct = allProducts.find(p => p.code === code);

        if (foundProduct) {
            setProduct(foundProduct);


            const related = allProducts
                .filter(p => p.category === foundProduct.category && p.code !== foundProduct.code)
                .slice(0, 4); // Tomamos solo los primeros 4 para no llenar la pantalla
            
            setRelatedProducts(related);
        }
        
        window.scrollTo(0, 0);
    }, [code]);

    const handleAddToCart = () => {
        if (!product) return;
        
        addToCart(product.code); 
        
        setIsAdded(true); 
        
        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    };

    if (!product) {
        return (
            <main id="main-content" style={{ textAlign: 'center', padding: '4rem' }}>
                <h1>Producto no encontrado</h1>
                <Link to="/products" className="btn">← Volver a productos</Link>
            </main>
        );
    }

    return (
        <main id="main-content">
            {/* --- DETALLE DEL PRODUCTO --- */}
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

                {/* BOTÓN MEJORADO */}
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ color: '#39FF14', marginBottom: '1rem' }}>
                        ${new Intl.NumberFormat('es-CL').format(product.price)}
                    </h2>
                    
                    <button
                        className="btn"
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        style={{ 
                            fontSize: '1.1rem',
                            padding: '0.8rem 2rem',
                            transition: 'all 0.3s ease',
                            backgroundColor: isAdded ? '#111' : '#39FF14',
                            color: isAdded ? '#39FF14' : '#000',
                            border: isAdded ? '2px solid #39FF14' : '2px solid #39FF14',
                            cursor: isAdded ? 'default' : 'pointer',
                            marginTop: '1rem' 
                        }}
                    >
                        {isAdded ? '¡Agregado al Carrito! ' : 'Añadir al carrito 🛒'}
                    </button>
                </div>
            </article>

            {/* --- SECCIÓN DE RELACIONADOS (SOLO SI HAY) --- */}
            {relatedProducts.length > 0 && (
                <section className="related-products" style={{ marginTop: '4rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff' }}>
                        También te podría interesar
                    </h2>
                    
                    {/* Reutilizamos la clase grid de CSS que ya tienes */}
                    <div className="grid"> 
                        {relatedProducts.map(p => (
                            <ProductCard key={p.code} product={p} />
                        ))}
                    </div>
                </section>
            )}

            <div className="btn-volver-neon">
                <Link to="/products" style={{ color: '#000', textDecoration: 'none', display: 'block' }}>
                    ← Volver al catálogo
                </Link>
            </div>
        </main>
    );
}

export default ProductDetailPage;