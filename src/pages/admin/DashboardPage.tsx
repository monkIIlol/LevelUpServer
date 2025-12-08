import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/ProductService';
import { UserService } from '../../services/UserService';
import { OrderService } from '../../services/OrderService';
import { ContactService } from '../../services/ContactService';
import type { ContactoMensaje, OrderDetails } from '../../Types';

const DashboardPage = () => {
    const navigate = useNavigate();

    const [productCount, setProductCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [recentOrders, setRecentOrders] = useState<OrderDetails[]>([]);
    
    const [mensajes, setMensajes] = useState<ContactoMensaje[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            try {
                // 1. Cargar Productos Reales 
                const productsData = await ProductService.listar();
                setProductCount(productsData.length);

                // 2. Cargar Usuarios Reales 
                const usersData = await UserService.listar(token);
                setUserCount(usersData.length);

                // 3. Cargar Pedidos Reales 
                const ordersData = await OrderService.listarTodos(token);
                setOrderCount(ordersData.length);
                
                // Tomamos los últimos 5 pedidos
                const ultimosPedidos = [...ordersData].reverse().slice(0, 5);
                setRecentOrders(ultimosPedidos);

                // 4. Cargar Mensajes Reales 
                const msgs = await ContactService.listar(token);
                setMensajes(msgs);

            } catch (error) {
                console.error("Error cargando dashboard:", error);
            }
        };

        loadDashboardData();
    }, []);

    // Función para eliminar 
    const handleEliminarMensaje = async (id: string) => {
        if (!confirm('¿Seguro que quieres eliminar este mensaje de la BD?')) return;
        
        const token = localStorage.getItem('token');
        if (!token) return;

        const exito = await ContactService.eliminar(id, token);
        
        if (exito) {
            setMensajes(prev => prev.filter(m => m.id !== id));
        } else {
            alert("Error al eliminar el mensaje.");
        }
    };

    return (
        <div>
            <h1 style={{ color: '#39FF14' }}>Dashboard General</h1>

            <section className="stats">
                <div className="stat-card">
                    <h3>Productos</h3>
                    <p id="stat-products" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{productCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Usuarios Registrados</h3>
                    <p id="stat-users" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{userCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Ventas Totales</h3>
                    <p id="stat-orders" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{orderCount}</p>
                </div>
            </section>

            <section className="recent-orders">
                <h2 style={{ marginTop: '2rem' }}>Últimas Ventas (Base de Datos)</h2>
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID Pedido</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody id="orders-body">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.user?.email || 'Anónimo'}</td>
                                    <td style={{ color: '#39FF14' }}>
                                        ${new Intl.NumberFormat('es-CL').format(order.total)}
                                    </td>
                                    <td>{order.timestamp}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>
                                    No hay ventas registradas aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button 
                    className="btn" 
                    style={{ marginTop: '1rem', background: '#333', color: '#fff', border: '1px solid #555' }}
                    onClick={() => navigate('/admin/orders')}
                >
                    Ver todo el historial
                </button>
            </section>

            {/* SECCIÓN DE MENSAJES  */}
            <section className="recent-messages" style={{ marginTop: '3rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                <h2>Mensajes de Contacto (Base de Datos)</h2>
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
                                    <small>{msg.timestamp}</small>
                                </header>
                                <p>{msg.comment}</p>
                                <footer>
                                    <button className="btn-eliminar" onClick={() => handleEliminarMensaje(msg.id)}>
                                        Eliminar
                                    </button>
                                </footer>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;