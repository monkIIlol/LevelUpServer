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
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); 
        addToCart(product); 
        
        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
        }, 1500);
    }

    return (
        <Link to={`/product/${product.code}`} className="card-link">
            <article className="card">
                <img src={`/${product.img}`} alt={product.name} />
                <h3>{product.name}</h3>
                <p style={{ flex: 1 }}>{product.desc}</p> 
                <p><strong>{money(product.price)}</strong></p>
                
                <div className="row">
                    <button
                        className={`btn ${isAdded ? 'btn-success-anim' : ''}`}
                        data-add={product.code}
                        onClick={handleAddToCart}
                        disabled={isAdded} 
                        style={{
                            transition: 'all 0.3s ease',
                            width: '100%',
                            backgroundColor: isAdded ? '#1a1a1a' : 'var(--accent-2)',
                            color: isAdded ? '#39FF14' : '#000',
                            border: isAdded ? '1px solid #39FF14' : 'none'
                        }}
                    >
                        {isAdded ? '¡Agregado al Carrito! ' : 'Añadir al Carrito'}
                    </button>
                </div>
            </article>
        </Link>
    );
}

export default ProductCard;