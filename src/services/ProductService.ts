// src/services/ProductService.ts
import type { Product } from '../Types';

const API_URL = 'http://localhost:8090/api/products';

export const ProductService = {
    // 1. Obtener todos los productos
    async listar(): Promise<Product[]> {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al cargar productos');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    // 2. Obtener un producto por código
    async obtener(code: string): Promise<Product | null> {
        try {
            const response = await fetch(`${API_URL}/${code}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    // 3. Crear producto (Requiere Token - Lo veremos en el paso de Admin)
    async crear(product: Product, token: string): Promise<Product | null> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
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
    }
};