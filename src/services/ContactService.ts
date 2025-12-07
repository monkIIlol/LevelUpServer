import type { ContactoMensaje } from '../Types';

const API_URL = 'http://localhost:8090/api/messages';

export const ContactService = {
    // Enviar mensaje (Público)
    async enviar(data: { name: string, email: string, comment: string }) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return response.ok;
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            return false;
        }
    },

    // Listar mensajes (Para el Dashboard)
    async listar(token: string): Promise<ContactoMensaje[]> {
        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) return [];
            
            const data = await response.json();
            // Adaptamos los datos si es necesario (Java manda 'id' numérico, React suele esperar string en listas)
            return data.map((m: any) => ({
                id: m.id.toString(),
                name: m.name,
                email: m.email,
                comment: m.comment,
                timestamp: new Date(m.timestamp).toLocaleString('es-CL')
            }));
        } catch (error) {
            return [];
        }
    },

    // Eliminar mensaje
    async eliminar(id: string, token: string) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return true;
        } catch (error) {
            return false;
        }
    }
};