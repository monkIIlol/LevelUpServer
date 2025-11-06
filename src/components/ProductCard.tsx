import React from 'react';
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

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); 
        addToCart(product.code);
    }

    return (
        <Link to={`/product/${product.code}`} className="card-link">
            <article className="card">
                <img src={`/${product.img}`} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
                <p><strong>{money(product.price)}</strong></p>
                <div className="row">
                    <button
                        className="btn"
                        data-add={product.code}
                        onClick={handleAddToCart} // El botón ahora funciona
                    >
                        Añadir
                    </button>
                </div>
            </article>
        </Link>
    );
}

export default ProductCard;