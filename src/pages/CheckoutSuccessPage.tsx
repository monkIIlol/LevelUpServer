import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const CheckoutSuccessPage: React.FC = () => {
    const location = useLocation();
    
    // AQUÍ RECUPERAMOS LOS DATOS REALES
    // Si location.state es null, significa que entraron directo por URL sin comprar
    const state = location.state as { orderId: string, items: any[], total: number, buyer: any } | null;

    if (!state) {
        return (
            <main id="main-content" style={{ padding: '40px', textAlign: 'center' }}>
                <h1>⚠️ Error</h1>
                <p>No hay información de compra reciente.</p>
                <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Volver al Inicio</Link>
            </main>
        );
    }

    const { orderId, items, total, buyer } = state;

    return (
        <main id="main-content">
            <div className="checkout-result-page success" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <span style={{ fontSize: '4rem' }}>✅</span>
                    <h1 style={{ color: '#39FF14' }}>¡Compra realizada con éxito!</h1>
                    <p>Tu pedido nro <strong>{orderId}</strong> ha sido procesado.</p>
                </div>

                <section className="order-summary" style={{ background: '#222', padding: '20px', borderRadius: '10px' }}>
                    <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>Resumen de tu Pedido</h2>
                    
                    <div className="order-summary-details" style={{ marginTop: '20px' }}>
                        <h3 style={{ color: '#ccc' }}>Detalles del Cliente</h3>
                        <p><strong>Nombre:</strong> {buyer.firstName} {buyer.lastName}</p>
                        <p><strong>Correo:</strong> {buyer.email}</p>
                        <p><strong>Dirección:</strong> {buyer.address}, {buyer.comuna}, {buyer.region}</p>
                    </div>

                    <div className="order-summary-details" style={{ marginTop: '20px' }}>
                        <h3 style={{ color: '#ccc' }}>Items Comprados</h3>
                        <ul className="order-summary-items" style={{ listStyle: 'none', padding: 0 }}>
                            {items.map((item: any) => (
                                <li key={item.code} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                                    <span>{item.name} (x{item.qty})</span>
                                    <span>{money(item.price * item.qty)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="order-summary-total" style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '15px' }}>
                            Total Pagado: <span style={{ color: '#39FF14' }}>{money(total)}</span>
                        </div>
                    </div>
                </section>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', background: '#39FF14', color: 'black', fontWeight: 'bold', borderRadius: '5px' }}>
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default CheckoutSuccessPage;