import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext'; 
import { ToastProvider } from '../context/ToastContext'; 
import Header from './Header';
import type { User } from '../Types';

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
            <ToastProvider> 
                <AuthContext.Provider value={{
                    currentUser: user,
                    isLoading: false, 
                    login: vi.fn(),
                    logout: vi.fn(),
                    register: vi.fn()
                }}>
                    <CartProvider>
                        <Header />
                    </CartProvider>
                </AuthContext.Provider>
            </ToastProvider>
        </BrowserRouter>
    );
};

describe('Componente: Header', () => {

    // PRUEBA 1
    it('Debería mostrar el logo que es un enlace al Home', () => {
        renderHeader(null); 
        const logoImage = screen.getByAltText(/Logo/i); 
        expect(logoImage).toBeInTheDocument();
        expect(logoImage.closest('a')).toHaveAttribute('href', '/');
    });

    // PRUEBA 2
    it('Debería mostrar "Iniciar sesión" y "Registro" cuando no hay usuario', () => {
        renderHeader(null); 
        expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument();
        expect(screen.getByText(/Registro/i)).toBeInTheDocument();
        expect(screen.queryByText(/Diego/i)).toBeNull();
    });

    // PRUEBA 3
    it('Debería mostrar el UserMenu (Hola Diego) cuando SÍ hay usuario', async () => {
        renderHeader(mockUser); 
        const userNameText = screen.getByText(/Diego/i);
        expect(userNameText).toBeInTheDocument();
        expect(screen.queryByText('Iniciar sesión')).toBeNull();
    });
});