
import React, { useState, useEffect } from 'react';
import type { Product, User } from '../../Types'; 


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

    useEffect(() => {
        const products: Product[] = JSON.parse(localStorage.getItem('productos') || '[]');
        setProductCount(products.length);

        const users: User[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
        setUserCount(users.length);

        const history: HistoryItem[] = JSON.parse(localStorage.getItem('cartHistory') || '[]');
        setOrderCount(history.length);
 
        setRecentOrders(history.slice(-10).reverse());

    }, []); 

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
        </div>
    );
}

export default DashboardPage;