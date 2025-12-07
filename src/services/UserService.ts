import type { User } from '../Types';

const API_URL = 'http://localhost:8090/api/users';

export const UserService = {
    // 1. Listar todos los usuarios
    async listar(token: string): Promise<User[]> {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Si el token venció o es inválido
            if (response.status === 403 || response.status === 401) {
                return []; 
            }

            if (!response.ok) {
                return [];
            }

            return await response.json();

        } catch (error) {
            console.error("Error de conexión con usuarios:", error);
            return [];
        }
    },

    // 2. Obtener un usuario por RUN
    async obtenerPorRun(run: string, token: string): Promise<User | null> {
        try {
            const response = await fetch(`${API_URL}/${run}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    },

    // 3. Crear usuario
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
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    // 4. Actualizar usuario
    async actualizar(user: User, token: string): Promise<User | null> {
        try {
            const response = await fetch(`${API_URL}/${user.run}`, {
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

    // 5. Eliminar usuario
    async eliminar(run: string, token: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_URL}/${run}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
};