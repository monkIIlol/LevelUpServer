import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; 

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const CartPage = () => {
    const { cartItems, totalPrice, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate(); 

    const handleGoToCheckout = () => {
        if (cartItems.length === 0) {
            alert('Tu carrito está vacío ❌');
            return;
        }
        navigate('/checkout'); 
    }

    return (
        <main className="cart-layout">
            <section className="cart-left">
                <h2>Mi Carrito de Compras</h2>
                <div id="cart-items" className="cart-items-list">

                    {cartItems.length === 0 ? (
                        <p id="cart-empty" className="cart-empty">Tu carrito está vacío.</p>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.code} className="cart-card">
                                <h3>{item.name} <small>({item.code})</small></h3>
                                <p>Cantidad: {item.qty}</p>
                                <p>Precio: {money(item.price * item.qty)}</p>
                                <div className="cart-actions">
                                    <button className="btn btn-dec" onClick={() => decreaseQty(item.code)}>−</button>
                                    <button className="btn btn-inc" onClick={() => increaseQty(item.code)}>+</button>
                                    <button className="btn btn-rem" onClick={() => removeFromCart(item.code)}>Quitar</button>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </section>

            <aside className="cart-right">
                <div className="cart-summary">
                    <h3>Detalle total</h3>
                    <p id="cart-total"><strong>Total:</strong> {money(totalPrice)}</p>
                    <button id="cart-clear" className="btn btn-secondary" onClick={clearCart}>
                        Vaciar carrito
                    </button>
                    <button id="cart-checkout" className="btn btn-primary" onClick={handleGoToCheckout}>
                        Ir a Pagar
                    </button>
                </div>
            </aside>
        </main>
    );
}

export default CartPage;