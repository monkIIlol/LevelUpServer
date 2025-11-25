import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../Types';
import { useCart } from '../context/CartContext';

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const { addToCart } = useCart();
    // Estado para controlar el feedback visual
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); 
        addToCart(product.code);
        
        // Activamos el estado "Agregado"
        setIsAdded(true);

        // Después de 1.5 segundos, volvemos al estado normal
        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    }

    return (
        <Link to={`/product/${product.code}`} className="card-link">
            <article className="card">
                <img src={`/${product.img}`} alt={product.name} />
                <h3>{product.name}</h3>
                <p style={{ flex: 1 }}>{product.desc}</p> {/* flex:1 para alinear botones */}
                <p><strong>{money(product.price)}</strong></p>
                
                <div className="row">
                    <button
                        // Cambiamos la clase dinámicamente
                        className={`btn ${isAdded ? 'btn-success-anim' : ''}`}
                        data-add={product.code}
                        onClick={handleAddToCart}
                        // Deshabilitamos mientras muestra el mensaje de éxito
                        disabled={isAdded} 
                        style={{
                            transition: 'all 0.3s ease',
                            width: '100%',
                            // Si está agregado, usamos borde verde y fondo oscuro (o tu preferencia)
                            backgroundColor: isAdded ? '#1a1a1a' : 'var(--accent-2)',
                            color: isAdded ? '#39FF14' : '#000',
                            border: isAdded ? '1px solid #39FF14' : 'none'
                        }}
                    >
                        {/* Cambiamos el texto según el estado */}
                        {isAdded ? '¡Agregado al Carrito! ' : 'Añadir al Carrito'}
                    </button>
                </div>
            </article>
        </Link>
    );
}

export default ProductCard;