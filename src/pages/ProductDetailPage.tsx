import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../Types';
import { ProductService } from '../services/ProductService'; // Servicio real
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
    const { code } = useParams<{ code: string }>();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!code) return;

            try {
                // 1. Pedir el producto actual a Java
                const foundProduct = await ProductService.obtener(code);
                
                if (foundProduct) {
                    setProduct(foundProduct);

                    // 2. Pedir TODOS para filtrar relacionados 
                    // (Nota: En un futuro podrías hacer un endpoint específico para esto en Java)
                    const allProducts = await ProductService.listar();
                    
                    const related = allProducts
                        .filter(p => p.category === foundProduct.category && p.code !== foundProduct.code)
                        .slice(0, 4);
                    
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error("Error al cargar producto:", error);
            }
        };

        loadData();
        window.scrollTo(0, 0);
    }, [code]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product); 
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    if (!product) {
        return (
            <main id="main-content" style={{ textAlign: 'center', padding: '4rem' }}>
                <h1>Cargando...</h1>
                <Link to="/products" className="btn" style={{marginTop:'1rem', display:'inline-block'}}>← Volver</Link>
            </main>
        );
    }

    const descriptionText = product.description || product.desc || "Sin descripción disponible.";

    return (
        <main id="main-content">
            <article id="product-detail" style={{ maxWidth: '450px', width: '95%', margin: '3rem auto', padding: '2.5rem', backgroundColor: '#1a1a1a', borderRadius: '20px', border: '1px solid #333', textAlign: 'center' }}>
                <header><h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{product.name}</h1></header>
                <img src={`/${product.img}`} alt={product.name} style={{ maxWidth: '220px', height: 'auto', margin: '0 auto 1.5rem', display: 'block', objectFit: 'contain' }} />
                
                {/* Aquí usamos la variable que definimos arriba */}
                <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>{descriptionText}</p>
                
                <section style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '0.95rem', color: '#bbb' }}>
                    <h3 style={{ color: '#39FF14', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Detalles</h3>
                    <ul style={{ paddingLeft: '1.2rem' }}>
                        {product.details?.map((detail, index) => <li key={index}>{detail}</li>)}
                    </ul>
                </section>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
                    <h2 style={{ color: '#39FF14', marginBottom: '1rem', fontSize: '2rem' }}>${new Intl.NumberFormat('es-CL').format(product.price)}</h2>
                    
                    <button
                        className="btn"
                        onClick={handleAddToCart}
                        disabled={isAdded || product.stock === 0}
                        style={{ 
                            width: 'auto', minWidth: '200px', padding: '0.8rem 2rem', 
                            backgroundColor: isAdded ? '#111' : (product.stock===0?'#555':'#39FF14'), 
                            color: isAdded ? '#39FF14' : (product.stock===0?'#aaa':'#000'), 
                            border: '2px solid #39FF14', fontWeight: 'bold', borderRadius: '8px', cursor: product.stock===0?'not-allowed':'pointer'
                        }}
                    >
                        {product.stock === 0 ? 'Agotado' : (isAdded ? '¡Agregado! ✅' : 'Añadir al carrito 🛒')}
                    </button>
                </div>
            </article>
            
            {/* Relacionados */}
            {relatedProducts.length > 0 && (
                <section className="related-products" style={{ marginTop: '4rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>También te podría interesar</h2>
                    <div className="grid">
                        {relatedProducts.map(p => <ProductCard key={p.code} product={p} />)}
                    </div>
                </section>
            )}
        </main>
    );
}

export default ProductDetailPage;