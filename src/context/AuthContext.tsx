import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../Types'; 

interface AuthContextType {
    currentUser: User | null;
    isLoading: boolean; 
    login: (user: User) => Promise<boolean>;
    register: (user: User) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
            setCurrentUser(JSON.parse(storedUser));
        }
        
        setIsLoading(false); 
    }, []);

    // --- LOGIN REAL (Conectado a Java) ---
    const login = async (user: User): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:8090/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: user.email, 
                    password: user.password 
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                
                setCurrentUser(data.user);
                return true; 
            } else {
                alert("Error: Credenciales incorrectas");
                return false;
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("El servidor no responde. ¿Está encendido el Backend?");
            return false;
        }
    };

    // --- REGISTRO REAL (Conectado a Java) ---
    const register = async (user: User): Promise<boolean> => {
        try {
            const response = await fetch('http://localhost:8090/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (response.ok) {

                alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
                return true;
            } else {
                const errorMsg = await response.text();
                alert("Error al registrar: " + errorMsg);
                return false;
            }
        } catch (error) {
            console.error("Error de registro:", error);
            alert("No se pudo conectar al servidor.");
            return false;
        }
    };

    // --- LOGOUT (Cerrar Sesión) ---
    const logout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        setCurrentUser(null);
        window.location.href = '/login'; // Forzamos ir al login
    };

    return (
        <AuthContext.Provider value={{ currentUser, isLoading, login, logout, register }}>
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