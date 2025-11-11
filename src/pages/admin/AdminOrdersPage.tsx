import React, { useState, useEffect } from 'react';
import type { OrderDetails } from '../../Types'; 

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const AdminOrdersPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<OrderDetails[]>([]);

    // Cargar pedidos al iniciar
    useEffect(() => {
        const pedidosGuardados: OrderDetails[] = JSON.parse(
            localStorage.getItem('pedidosDetallados') || '[]'
        );
        setPedidos(pedidosGuardados);
    }, []);

    // Función para eliminar un pedido
    const handleEliminarPedido = (id: string) => {
        if (!confirm('¿Seguro que quieres eliminar este pedido? Esta acción es permanente.')) {
            return;
        }
        // 1. Filtrar el pedido
        const pedidosActualizados = pedidos.filter(p => p.id !== id);
        setPedidos(pedidosActualizados);

        // 2. Actualizar localStorage
        localStorage.setItem('pedidosDetallados', JSON.stringify(pedidosActualizados));
    };

    return (
        <div>
            <h1>Pedidos / Boletas</h1>
            <p>Aquí se listan todos los pedidos detallados realizados por los clientes.</p>

            <section className="order-list">
                {pedidos.length === 0 ? (
                    <p>No hay pedidos detallados para mostrar.</p>
                ) : (
                    pedidos.map((pedido) => (
                        <article key={pedido.id} className="order-card">
                            <header>
                                <div>
                                    <strong>Pedido ID: {pedido.id}</strong>
                                    <small>Fecha: {pedido.timestamp}</small>
                                </div>
                                <strong className="order-total">{money(pedido.total)}</strong>
                            </header>
                            
                            <div className="order-card-body">
                                <div className="order-customer">
                                    <h4>Cliente</h4>
                                    <p>{pedido.user.firstName} {pedido.user.lastName}</p>
                                    <p>{pedido.user.email}</p>
                                    <p>{pedido.user.address}, {pedido.user.comuna}, {pedido.user.region}</p>
                                </div>
                                <div className="order-items">
                                    <h4>Productos ({pedido.items.length})</h4>
                                    <ul>
                                        {pedido.items.map(item => (
                                            <li key={item.code}>
                                                <span>{item.name} (x{item.qty})</span>
                                                <span>{money(item.price * item.qty)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <footer>
                                <button 
                                    className="btn-eliminar"
                                    onClick={() => handleEliminarPedido(pedido.id)}
                                >
                                    Eliminar Pedido
                                </button>
                            </footer>
                        </article>
                    ))
                )}
            </section>
        </div>
    );
}

export default AdminOrdersPage;