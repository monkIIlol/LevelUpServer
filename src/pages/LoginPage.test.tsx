
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { describe, it, expect, vi, beforeEach } from 'vitest'; 
import { BrowserRouter } from 'react-router-dom';
import type { User } from '../Types';
import { AuthContext } from '../context/AuthContext'; 

import LoginPage from './LoginPage';

const mockUser: User = {
    run: '12345678-9',
    firstName: 'Diego',
    lastName: 'Test',
    email: 'diego@test.cl',
    password: 'diego123', 
    role: 'Cliente',
    region: '', comuna: '', address: '', birthDate: null
};

describe('Componente: LoginPage', () => {
    const mockLogin = vi.fn();
    const localStorageMock = vi.spyOn(Storage.prototype, 'getItem');

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => { });

    beforeEach(() => {
        cleanup(); 
        mockLogin.mockClear(); 
        localStorageMock.mockClear(); 
        alertMock.mockClear(); 
    });

    const renderLogin = () => {
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{
                    currentUser: null,
                    login: mockLogin,
                    logout: vi.fn(),
                    register: vi.fn()
                }}>
                    <LoginPage />
                </AuthContext.Provider>
            </BrowserRouter>
        );
    };

    //PRUEBA 1: Lógica de Error 
    it('Debería mostrar un error con credenciales incorrectas', async () => {
        localStorageMock.mockReturnValue('[]');
        renderLogin();

        await userEvent.type(screen.getByLabelText(/Correo/i), 'correo@falso.cl');
        await userEvent.type(screen.getByLabelText(/Contraseña/i), '12345');
        await userEvent.click(screen.getByRole('button', { name: /Entrar/i }));

        expect(await screen.findByText('Correo o contraseña incorrectos')).toBeInTheDocument();

        expect(mockLogin).not.toHaveBeenCalled();
    });

    //PRUEBA 2: Lógica de Admin 
    it('Debería llamar a login (Admin) con credenciales de admin', async () => {
        localStorageMock.mockReturnValue('[]');
        renderLogin();

        await userEvent.type(screen.getByLabelText(/Correo/i), 'admin@levelup.cl');
        await userEvent.type(screen.getByLabelText(/Contraseña/i), 'admin123');

        await userEvent.click(screen.getByRole('button', { name: /Entrar/i }));

        expect(mockLogin).toHaveBeenCalledTimes(1);

        expect(screen.queryByText('Correo o contraseña incorrectos')).toBeNull();
    });

    //PRUEBA 3: Lógica de Usuario Normal 
    it('Debería llamar a login (Usuario) con credenciales correctas de localStorage', async () => {
        localStorageMock.mockReturnValue(JSON.stringify([mockUser]));
        renderLogin();

        await userEvent.type(screen.getByLabelText(/Correo/i), 'diego@test.cl');
        await userEvent.type(screen.getByLabelText(/Contraseña/i), 'diego123');

        await userEvent.click(screen.getByRole('button', { name: /Entrar/i }));

        expect(mockLogin).toHaveBeenCalledTimes(1);

        expect(mockLogin).toHaveBeenCalledWith(mockUser);

        expect(alertMock).toHaveBeenCalledWith('Inicio de sesión exitoso ✅');
    });

});