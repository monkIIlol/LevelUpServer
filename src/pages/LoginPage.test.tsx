import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';
import { AuthContext } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { BrowserRouter } from 'react-router-dom';

// Mocks
const mockLogin = vi.fn();

const renderLogin = () => {
    render(
        <AuthContext.Provider value={{ 
            currentUser: null, 
            isLoading: false, 
            login: mockLogin, 
            register: vi.fn(), 
            logout: vi.fn() 
        }}>
            <ToastProvider>
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>
            </ToastProvider>
        </AuthContext.Provider>
    );
};

describe('Componente: LoginPage', () => {

    it('Debería renderizar el formulario correctamente', () => {
        renderLogin();
        // Buscamos textos que sí existen en tu HTML
        expect(screen.getByRole('heading', { name: /Ingreso/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Correo/i)).toBeInTheDocument();
    });

    it('Debería llamar a la función login al enviar el formulario', async () => {
        renderLogin();
        
        // Simulamos escribir credenciales
        fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'admin@levelup.cl' } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '1234' } });
        
        // Simulamos click en "Entrar"
        const button = screen.getByRole('button', { name: /Entrar/i });
        fireEvent.click(button);

        // Esperamos que llame a la función del contexto
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
        });
    });
});