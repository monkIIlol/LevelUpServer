import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { OrderDetails } from '../Types';

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const CheckoutSuccessPage: React.FC = () => {
    const [order, setOrder] = useState<OrderDetails | null>(null);

    useEffect(() => {
        const orderData = localStorage.getItem('lastSuccessfulOrder');
        if (orderData) {
            setOrder(JSON.parse(orderData));
        }
    }, []);

    if (!order) {
        return (
            <main id="main-content">
                <div className="checkout-result-page error">
                    <span className="icon">⚠️</span>
                    <h1>No se encontró información del pedido</h1>
                    <p>Parece que llegaste a esta página por error.</p>
                    <Link to="/" className="btn-primary">Volver al Inicio</Link>
                </div>
            </main>
        );
    }

    return (
        <main id="main-content">
            <div className="checkout-result-page success">
                <span className="icon">✅</span>
                <h1>¡Compra realizada con éxito!</h1>
                <p>Tu pedido nro <strong>{order.id}</strong> ha sido procesado.</p>

                <section className="order-summary">
                    <h2>Resumen de tu Pedido</h2>
                    
                    <div className="order-summary-details">
                        <h3>Detalles del Cliente y Envío</h3>
                        <p><strong>Nombre:</strong> {order.user.firstName} {order.user.lastName}</p>
                        <p><strong>Correo:</strong> {order.user.email}</p>
                        <p><strong>Dirección:</strong> {order.user.address}</p>
                        <p><strong>Comuna:</strong> {order.user.comuna}</p>
                        <p><strong>Región:</strong> {order.user.region}</p>
                    </div>

                    <div className="order-summary-details">
                        <h3>Items Comprados</h3>
                        <ul className="order-summary-items">
                            {order.items.map(item => (
                                <li key={item.code}>
                                    <span>{item.name} (x{item.qty})</span>
                                    <span>{money(item.price * item.qty)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="order-summary-total">
                            Total Pagado: {money(order.total)}
                        </div>
                    </div>
                </section>

                <Link to="/" className="btn-primary">Volver al Inicio</Link>
            </div>
        </main>
    );
}

export default CheckoutSuccessPage;