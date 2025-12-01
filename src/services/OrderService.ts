import type { CartItem } from '../Types';

const API_URL = 'http://localhost:8090/api/orders';

export const OrderService = {
    

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
    }
};