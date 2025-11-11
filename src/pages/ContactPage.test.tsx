// --- 1. IMPORTACIONES ---
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ContactPage from './ContactPage'; // Importamos el componente a probar

// --- 2. CONFIGURACIÓN DEL MOCK DE LOCALSTORAGE y ALERT ---
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        },
        removeItem: (key: string) => {
            delete store[key];
        }
    };
})();
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Función "wrapper" para renderizar el componente
const renderComponent = () => {
    render(
        <BrowserRouter>
            <ContactPage />
        </BrowserRouter>
    );
};

// Antes de CADA prueba, limpiamos los mocks
beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    vi.spyOn(window, 'alert').mockImplementation(() => { });
    vi.spyOn(localStorageMock, 'setItem');
});


// --- 3. LAS PRUEBAS ---
describe('Componente: ContactPage', () => {

    // --- PRUEBA 1: (Sin cambios) ---
    it('debería actualizar el estado (state) al escribir en los inputs', async () => {
        const user = userEvent.setup();
        renderComponent();

        const nombreInput = screen.getByLabelText(/Nombre/i) as HTMLInputElement;
        expect(nombreInput.value).toBe('');
        await user.type(nombreInput, 'Juan Perez');
        expect(nombreInput.value).toBe('Juan Perez');

        const correoInput = screen.getByLabelText(/Correo/i) as HTMLInputElement;
        expect(correoInput.value).toBe('');
        await user.type(correoInput, 'correo@test.com');
        expect(correoInput.value).toBe('correo@test.com');

        const comentarioInput = screen.getByLabelText(/Comentario/i) as HTMLTextAreaElement;
        expect(comentarioInput.value).toBe('');
        await user.type(comentarioInput, 'Hola mundo');
        expect(comentarioInput.value).toBe('Hola mundo');
    });


    // --- PRUEBA 2: (¡CORREGIDA CON TEXTO FLEXIBLE!) ---
    it('debería mostrar mensajes de error si el formulario se envía vacío', async () => {
        const user = userEvent.setup();
        renderComponent();

        const submitButton = screen.getByRole('button', { name: /Enviar/i });
        await user.click(submitButton);

        // --- INICIO DE LA CORRECCIÓN ---
        // En lugar de buscar el texto exacto, buscamos las partes únicas
        // de tus mensajes de error. ¡Esto es mucho más seguro!
        await waitFor(() => {
            // Busca el error que contiene "máx 100" (para el nombre)
            expect(screen.getByText(/máx 100/i)).toBeInTheDocument();
            // Busca el error que contiene "@duoc.cl" (para el email)
            expect(screen.getByText(/@duoc.cl/i)).toBeInTheDocument();
            // Busca el error que contiene "máx 500" (para el comentario)
            expect(screen.getByText(/máx 500/i)).toBeInTheDocument();
        });
        // --- FIN DE LA CORRECCIÓN ---

        // Verificamos que NUNCA se llamó a localStorage (porque la validación falló)
        expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });


    // --- PRUEBA 3: (Sin cambios) ---
    it('debería enviar el formulario, guardar en localStorage y limpiar los campos', async () => {
        const user = userEvent.setup();
        renderComponent();

        const nombreInput = screen.getByLabelText(/Nombre/i) as HTMLInputElement;
        const correoInput = screen.getByLabelText(/Correo/i) as HTMLInputElement;
        const comentarioInput = screen.getByLabelText(/Comentario/i) as HTMLTextAreaElement;
        const submitButton = screen.getByRole('button', { name: /Enviar/i });

        await user.type(nombreInput, 'Usuario de Prueba');
        await user.type(correoInput, 'test@gmail.com');
        await user.type(comentarioInput, 'Un comentario válido');

        await user.click(submitButton);

        expect(window.alert).toHaveBeenCalledWith('Mensaje enviado ✅');

        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'mensajesContacto',
            expect.stringContaining('Usuario de Prueba')
        );

        expect(await screen.findByText('¡Mensaje enviado con éxito!')).toBeInTheDocument();

        expect(nombreInput.value).toBe('');
        expect(correoInput.value).toBe('');
        expect(comentarioInput.value).toBe('');
    });

});