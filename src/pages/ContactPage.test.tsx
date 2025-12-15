import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ContactPage from './ContactPage';
import { ContactService } from '../services/ContactService';


vi.mock('../services/ContactService', () => ({
    ContactService: {
        enviar: vi.fn()
    }
}));

const renderComponent = () => {
    render(
        <BrowserRouter>
            <ContactPage />
        </BrowserRouter>
    );
};

describe('Componente: ContactPage', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
        // Mockeamos el alert
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    it('debería actualizar los inputs al escribir', () => {
        renderComponent();
        
        const nombreInput = screen.getByLabelText(/Nombre/i) as HTMLInputElement;
        fireEvent.change(nombreInput, { target: { value: 'Juan' } });
        expect(nombreInput.value).toBe('Juan');
    });

    it('debería mostrar validaciones si enviamos vacío', async () => {
        renderComponent();
        
        const boton = screen.getByRole('button', { name: /Enviar Mensaje/i });
        fireEvent.click(boton);

        // Esperamos textos exactos de tu ContactPage.tsx
        expect(await screen.findByText(/Nombre requerido/i)).toBeInTheDocument();
        expect(await screen.findByText(/Correo inválido/i)).toBeInTheDocument();
        expect(await screen.findByText(/Comentario requerido/i)).toBeInTheDocument();
    });

    it('debería enviar el formulario exitosamente si todo está bien', async () => {
        // Configuramos el mock para que diga "true" (éxito)
        (ContactService.enviar as any).mockResolvedValue(true);
        
        renderComponent();

        // Llenamos datos
        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'juan@duoc.cl' } }); // Email válido
        fireEvent.change(screen.getByLabelText(/Comentario/i), { target: { value: 'Hola' } });

        const boton = screen.getByRole('button', { name: /Enviar Mensaje/i });
        fireEvent.click(boton);

        // Verificamos que se llamó al servicio
        await waitFor(() => {
            expect(ContactService.enviar).toHaveBeenCalledTimes(1);
        });

        // Verificamos el alert exacto de tu componente
        expect(window.alert).toHaveBeenCalledWith('Mensaje enviado');
    });
});