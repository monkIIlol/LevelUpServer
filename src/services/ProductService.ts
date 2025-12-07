import type { Product } from '../Types';


const API_URL = 'http://localhost:8090/api/products';

export const ProductService = {
    // 1. Listar 
    async listar(): Promise<Product[]> {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            return [];
        }
    },

    // 2. Obtener 
    async obtener(code: string): Promise<Product | null> {
        try {
            const response = await fetch(`${API_URL}/${code}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    },

    // 3. CREAR (NUEVO) 
    async create(product: Product, token: string): Promise<Product | null> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error backend:", errorText);
                throw new Error(errorText);
            }

            return await response.json();
        } catch (error) {
            console.error("Error al crear producto:", error);
            throw error;
        }
    },
    
    // ELIMINAR PRODUCTO 
    async eliminar(code: string, token: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/${code}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    },
    
    // ACTUALIZAR (PUT)
    async actualizar(code: string, product: Product, token: string): Promise<Product | null> {
        try {
            const response = await fetch(`${API_URL}/${code}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(product)
            });
            
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    },

    
};
