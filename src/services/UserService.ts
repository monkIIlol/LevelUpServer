import type { User } from '../Types';

const API_URL = 'http://localhost:8090/api/users';

export const UserService = {
    // Listar
    async listar(token: string): Promise<User[]> {
        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            return [];
        }
    },

    // Obtener uno
    async obtener(run: string, token: string): Promise<User | null> {
        try {
            const response = await fetch(`${API_URL}/${run}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    },

    // Crear
    async crear(user: User, token: string): Promise<User | null> {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    },

    // Actualizar
    async actualizar(run: string, user: User, token: string): Promise<User | null> {
        try {
            const response = await fetch(`${API_URL}/${run}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    },

    // Eliminar
    async eliminar(run: string, token: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/${run}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};