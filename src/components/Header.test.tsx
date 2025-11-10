
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

import Header from './Header';

describe('Componente: Header', () => {
    const renderHeader = () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <CartProvider>
                        <Header />
                    </CartProvider>
                </AuthProvider>
            </BrowserRouter>
        );
    };

    //  PRUEBA 1 
    it('Debería mostrar el logo que es un enlace al Home', () => {
        renderHeader();

        const logoImage = screen.getByAltText('Logo Level‑Up Gamer');
        expect(logoImage).toBeInTheDocument();


        expect(logoImage.closest('a')).toHaveAttribute('href', '/');
    });

    //  PRUEBA 2 
    it('Debería mostrar "Iniciar sesión" y "Registro" cuando no hay usuario', () => {
        renderHeader();

        const loginLink = screen.getByText('Iniciar sesión');
        const registerButton = screen.getByText('Registro');

        expect(loginLink).toBeInTheDocument();
        expect(registerButton).toBeInTheDocument();
    });

});