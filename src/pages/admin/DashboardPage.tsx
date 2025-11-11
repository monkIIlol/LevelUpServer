import React, { useState, useEffect } from 'react';
// Importamos el nuevo tipo de mensaje
import type { Product, User, ContactoMensaje } from '../../Types';


interface HistoryItem {
    user: string;
    product: string;
    code: string;
    timestamp: string;
}

const DashboardPage = () => {

    const [productCount, setProductCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [recentOrders, setRecentOrders] = useState<HistoryItem[]>([]);

    // --- INICIO ADICIÓN DE MENSAJES ---
    const [mensajes, setMensajes] = useState<ContactoMensaje[]>([]);
    // --- FIN ADICIÓN DE MENSAJES ---

    useEffect(() => {
        const products: Product[] = JSON.parse(localStorage.getItem('productos') || '[]');
        setProductCount(products.length);

        const users: User[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
        setUserCount(users.length);

        const history: HistoryItem[] = JSON.parse(localStorage.getItem('cartHistory') || '[]');
        setOrderCount(history.length);
        setRecentOrders(history.slice(-10).reverse());

        // --- INICIO ADICIÓN DE MENSAJES ---
        // Cargar mensajes de contacto desde localStorage
        const mensajesGuardados: ContactoMensaje[] = JSON.parse(
            localStorage.getItem('mensajesContacto') || '[]'
        );
        setMensajes(mensajesGuardados);
        // --- FIN ADICIÓN DE MENSAJES ---

    }, []);

    // --- INICIO ADICIÓN DE MENSAJES ---
    // Función para eliminar un mensaje
    const handleEliminarMensaje = (id: string) => {
        if (!confirm('¿Seguro que quieres eliminar este mensaje?')) {
            return;
        }
        // 1. Filtrar el mensaje fuera del estado
        const mensajesActualizados = mensajes.filter(m => m.id !== id);
        setMensajes(mensajesActualizados);

        // 2. Actualizar localStorage
        localStorage.setItem('mensajesContacto', JSON.stringify(mensajesActualizados));
    };
    // --- FIN ADICIÓN DE MENSAJES ---


    return (
        <div>
            <h1>Dashboard</h1>

            <section className="stats">
                <div className="stat-card">
                    <h3>Productos</h3>
                    <p id="stat-products">{productCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Usuarios</h3>
                    <p id="stat-users">{userCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Pedidos</h3>
                    <p id="stat-orders">{orderCount}</p>
                </div>
            </section>

            <section className="recent-orders">
                <h2>Pedidos recientes</h2>
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Producto</th>
                            <th>Código</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody id="orders-body">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order, index) => (
                                <tr key={index}>
                                    <td>{order.user}</td>
                                    <td>{order.product}</td>
                                    <td>{order.code}</td>
                                    <td>{new Date(order.timestamp).toLocaleString('es-CL')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center' }}>No hay pedidos recientes.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {/* --- INICIO DE LA SECCIÓN DE MENSAJES --- */}
            <section className="recent-messages">
                <h2>Mensajes de Contacto / Reclamos</h2>
                <div className="message-list">
                    {mensajes.length === 0 ? (
                        <p>No hay mensajes nuevos.</p>
                    ) : (
                        mensajes.map((msg) => (
                            <article key={msg.id} className="message-card">
                                <header>
                                    <div>
                                        <strong>De: {msg.name}</strong>
                                        <small> ({msg.email})</small>
                                    </div>
                                    <small>Recibido: {msg.timestamp}</small>
                                </header>
                                <p>{msg.comment}</p>
                                <footer>
                                    <button
                                        className="btn-eliminar"
                                        onClick={() => handleEliminarMensaje(msg.id)}
                                    >
                                        Eliminar
                                    </button>
                                </footer>
                            </article>
                        ))
                    )}
                </div>
            </section>
            {/* --- FIN DE LA SECCIÓN DE MENSAJES --- */}

        </div>
    );
}

export default DashboardPage;