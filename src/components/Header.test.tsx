import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import type { User } from '../Types'; 

import Header from './Header';

// INICIO DE LA MODIFICACIÓN 

const mockUser: User = {
    run: '12345678-9',
    firstName: 'Diego',
    lastName: 'Test',
    email: 'diego@test.cl',
    role: 'Cliente',
    region: '', comuna: '', address: '', birthDate: null
};

const renderHeader = (user: User | null) => {
    render(
        <BrowserRouter>
            <AuthContext.Provider value={{
                currentUser: user, 
                login: vi.fn(),
                logout: vi.fn(),
                register: vi.fn()
            }}>
                <CartProvider>
                    <Header />
                </CartProvider>
            </AuthContext.Provider>
        </BrowserRouter>
    );
};

describe('Componente: Header', () => {

    //  PRUEBA 1 
    it('Debería mostrar el logo que es un enlace al Home', () => {
        renderHeader(null); 

        const logoImage = screen.getByAltText('Logo Level‑Up Gamer');
        expect(logoImage).toBeInTheDocument();
        expect(logoImage.closest('a')).toHaveAttribute('href', '/');
    });

    //  PRUEBA 2 
    it('Debería mostrar "Iniciar sesión" y "Registro" cuando no hay usuario', () => {
        renderHeader(null); 

        const loginLink = screen.getByText('Iniciar sesión');
        const registerButton = screen.getByText('Registro');

        expect(loginLink).toBeInTheDocument();
        expect(registerButton).toBeInTheDocument();

        expect(screen.queryByText(/Diego/i)).toBeNull();
    });

    // --- ¡NUEVA PRUEBA 3! ---
    it('Debería mostrar el UserMenu (nombre y botón "Cerrar Sesión") cuando SÍ hay usuario', async () => {
        renderHeader(mockUser); 
        const user = userEvent.setup();

        const userNameTrigger = screen.getByText(/Diego/i);
        expect(userNameTrigger).toBeInTheDocument();

        expect(screen.queryByText('Iniciar sesión')).toBeNull();
        expect(screen.queryByText('Registro')).toBeNull();

        await user.click(userNameTrigger);

        const logoutButton = await screen.findByText(/Cerrar Sesión/i);
        expect(logoutButton).toBeInTheDocument();
    });
    // --- FIN DE LA MODIFICACIÓN ---

});