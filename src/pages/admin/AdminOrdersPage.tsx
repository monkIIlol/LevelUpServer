import React, { useState, useEffect } from 'react';
import type { OrderDetails } from '../../Types';
import { OrderService } from '../../services/OrderService';

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState<OrderDetails[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const data = await OrderService.listarTodos(token);
                setOrders(data.reverse());
            } catch (error) {
                console.error(error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h1 style={{ color: '#39FF14' }}>Historial de Ventas (Base de Datos)</h1>
            
            <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ background: '#222', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #444' }}>
                                    <td style={{ padding: '10px' }}>#{order.id}</td>
                                    <td>{order.timestamp}</td>
                                    <td>
                                        {order.user?.email || 'Desconocido'}
                                    </td>
                                    <td style={{ color: '#39FF14', fontWeight: 'bold' }}>
                                        {money(order.total)}
                                    </td>
                                    <td style={{ fontSize: '0.9rem', color: '#ccc' }}>
                                        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.qty}x {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                                    No hay ventas registradas en la Base de Datos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOrdersPage;