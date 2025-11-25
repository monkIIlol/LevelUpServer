import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import type { Product } from '../Types';

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const CartPage = () => {
    const { cartItems, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    // Estado para manejar qué items están seleccionados (checkbox)
    const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    // Cargar productos para obtener las imágenes (ya que CartItem no tiene imagen)
    useEffect(() => {
        const productsData = JSON.parse(localStorage.getItem('productos') || '[]');
        setAllProducts(productsData);

        // Por defecto, seleccionamos todos los items al cargar
        if (cartItems.length > 0) {
            setSelectedCodes(cartItems.map(i => i.code));
        }
    }, [cartItems.length]); // Dependencia ajustada

    // Encontrar imagen del producto
    const getProductImage = (code: string) => {
        const product = allProducts.find(p => p.code === code);
        return product ? `/${product.img}` : '/img/default.png';
    }

    // Manejar Checkbox individual
    const toggleSelect = (code: string) => {
        if (selectedCodes.includes(code)) {
            setSelectedCodes(selectedCodes.filter(c => c !== code));
        } else {
            setSelectedCodes([...selectedCodes, code]);
        }
    };

    // Manejar "Seleccionar todo"
    const toggleSelectAll = () => {
        if (selectedCodes.length === cartItems.length) {
            setSelectedCodes([]);
        } else {
            setSelectedCodes(cartItems.map(i => i.code));
        }
    };

    // Calcular total solo de lo seleccionado
    const selectedTotal = cartItems
        .filter(item => selectedCodes.includes(item.code))
        .reduce((total, item) => total + (item.price * item.qty), 0);

    const selectedCount = cartItems.filter(item => selectedCodes.includes(item.code)).length;

    const handleGoToCheckout = () => {
        if (selectedCount === 0) {
            alert('Selecciona al menos un producto para pagar ❌');
            return;
        }
        // NOTA: En un escenario real, aquí pasarías solo los "selectedCodes" al checkout.
        // Por ahora, mantenemos el flujo original pero validando selección.
        navigate('/checkout');
    }

    if (cartItems.length === 0) {
        return (
            <main id="main-content" className="cart-empty-state">
                <div className="empty-container">
                    <span style={{ fontSize: '4rem' }}>🛒</span>
                    <h2>Tu carro está vacío</h2>
                    <p>¿No sabes qué comprar? ¡Revisa nuestras ofertas!</p>
                    <Link to="/products" className="btn-primary">Ver Productos</Link>
                </div>
            </main>
        );
    }

    return (
        <main id="main-content" style={{ backgroundColor: '#121212', minHeight: '90vh', padding: '2rem 1rem' }}>
            <div className="ml-layout">

                {/* --- COLUMNA IZQUIERDA: PRODUCTOS --- */}
                <section className="ml-products">
                    <div className="ml-header-card">
                        <div className="ml-checkbox-group">
                            <input
                                type="checkbox"
                                checked={selectedCodes.length === cartItems.length && cartItems.length > 0}
                                onChange={toggleSelectAll}
                                id="select-all"
                            />
                            <label htmlFor="select-all">Seleccionar todos ({cartItems.length})</label>
                        </div>
                        <button onClick={clearCart} className="ml-link-btn">Eliminar todos</button>
                    </div>

                    <div className="ml-items-list">
                        {cartItems.map(item => (
                            <article key={item.code} className="ml-card">
                                <div className="ml-card-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedCodes.includes(item.code)}
                                        onChange={() => toggleSelect(item.code)}
                                    />
                                </div>

                                <div className="ml-card-img">
                                    <img src={getProductImage(item.code)} alt={item.name} />
                                </div>

                                <div className="ml-card-details">
                                    <div className="ml-card-info">
                                        <h3>{item.name}</h3>
                                        <span className="stock-badge">Disponible</span>
                                        <div className="ml-actions">
                                            <button className="ml-link-btn" onClick={() => removeFromCart(item.code)}>Eliminar</button>
                                            <button className="ml-link-btn">Guardar para después</button>
                                        </div>
                                    </div>

                                    <div className="ml-card-pricing">
                                        <div className="qty-selector">
                                            <button onClick={() => decreaseQty(item.code)} disabled={item.qty <= 1}>-</button>
                                            <span>{item.qty}</span>
                                            <button onClick={() => increaseQty(item.code)}>+</button>
                                        </div>
                                        <div className="price-block">
                                            <span className="price-unit">{money(item.price * item.qty)}</span>
                                            {item.qty > 1 && <small className="price-single">({money(item.price)} c/u)</small>}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* --- COLUMNA DERECHA: RESUMEN --- */}
                <aside className="ml-summary">
                    <div className="ml-summary-card">
                        <h3>Resumen de compra</h3>

                        <div className="summary-row">
                            <span>Productos ({selectedCount})</span>
                            <span>{money(selectedTotal)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Envíos</span>
                            <span style={{ color: '#39FF14' }}>Gratis</span>
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span>{money(selectedTotal)}</span>
                        </div>

                        <button className="btn-checkout-ml" onClick={handleGoToCheckout}>
                            Continuar compra
                        </button>

                        {selectedCount === 0 && (
                            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#ff6b6b', marginTop: '1rem' }}>
                                Debes seleccionar items para continuar
                            </p>
                        )}
                    </div>
                </aside>

            </div>
        </main>
    );
}

export default CartPage;