import type { CartItem } from '../Types';

const API_URL = 'http://localhost:8090/api/orders';

export const OrderService = {
    
    // Función 1: Crear Pedido
    async crearPedido(items: CartItem[], token: string) {
        const payload = {
            items: items.map(item => ({
                code: item.code,
                qty: item.qty
            }))
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                return await response.json();
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al procesar la compra');
            }
        } catch (error) {
            console.error("Error en OrderService:", error);
            throw error;
        }
    }, 

    async obtenerMisPedidos(token: string) {
        try {
            const response = await fetch(`${API_URL}/my-orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) return [];

            const dataBackend = await response.json();


            const pedidosFormateados = dataBackend.map((boleta: any) => ({
                id: boleta.id.toString(), 
                timestamp: new Date(boleta.fecha).toLocaleString(), // Formatear fecha
                total: boleta.total,
                user: boleta.usuario, // Opcional
                items: boleta.detalles.map((detalle: any) => ({
                    code: detalle.producto.code,
                    name: detalle.producto.name,
                    price: detalle.precioUnitario,
                    qty: detalle.cantidad
                }))
            }));

            return pedidosFormateados;

        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            return [];
        }
    },

    async listarTodos(token: string) {
        try {
            const response = await fetch(API_URL, { // GET /api/orders
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) return [];
            
            const dataBackend = await response.json();

            // Mismo formateo que hicimos para "Mis Pedidos"
            return dataBackend.map((boleta: any) => ({
                id: boleta.id.toString(),
                timestamp: new Date(boleta.fecha).toLocaleString(),
                total: boleta.total,
                user: boleta.usuario, // Ahora sí nos sirve ver quién compró
                items: boleta.detalles.map((detalle: any) => ({
                    code: detalle.producto.code,
                    name: detalle.producto.name,
                    price: detalle.precioUnitario,
                    qty: detalle.cantidad
                }))
            }));
        } catch (error) {
            return [];
        }
    }
};
