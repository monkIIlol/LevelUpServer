import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../Types'; 

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Al cargar la página, revisamos si ya hay un usuario guardado
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // --- LOGIN REAL (Conectado a Java) ---
    const login = async (user: User) => {
        // NOTA: Aquí 'user' viene con email y password desde el formulario
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
                
                // data.token -> Es el JWT que te dio Java
                // data.user -> Son los datos del usuario (nombre, rol, etc)
                
                // Guardamos en el navegador
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                
                // Actualizamos el estado de React
                setCurrentUser(data.user);
                return true; // Éxito
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
    const register = async (user: User) => {
        try {
            const response = await fetch('http://localhost:8090/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user) // Enviamos el usuario completo
            });

            if (response.ok) {
                const data = await response.json();
                // Opcional: Podrías hacer login automático aquí
                alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
            } else {
                const errorMsg = await response.text();
                alert("Error al registrar: " + errorMsg);
            }
        } catch (error) {
            console.error("Error de registro:", error);
            alert("No se pudo conectar al servidor.");
        }
    };

    // --- LOGOUT (Cerrar Sesión) ---
    const logout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        setCurrentUser(null);
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