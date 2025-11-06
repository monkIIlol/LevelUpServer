
import { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../Types'; 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null);


    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // --- LÓGICA DE AUTENTICACIÓN ---
    const register = (user: User) => {
        const usuarios: User[] = JSON.parse(localStorage.getItem('usuarios') || '[]');

        if (usuarios.some(u => u.email === user.email)) {
            throw new Error('Este correo ya está registrado.');
        }

        usuarios.push(user);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        login(user);
    };

    // Función para iniciar sesión
    const login = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    // Función para cerrar sesión
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}