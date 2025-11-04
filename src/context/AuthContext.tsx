////// // En src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '../Types'; // Importamos nuestros moldes
 // Importamos nuestros moldes

// 1. Creamos la "mochila" (el Context)
// Le decimos que tendrá la forma de 'AuthContextType'
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Creamos el "Proveedor" de la mochila
// Este es el componente que tendrá toda la lógica
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    // 'useState' es como la memoria de React.
    // Aquí guardamos quién es el usuario actual.
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // 'useEffect' se ejecuta UNA SOLA VEZ cuando la app carga
    // Sirve para revisar si ya había una sesión guardada
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []); // El '[]' vacío significa "ejecútate solo al inicio"

    // --- AQUI VA LA LÓGICA (TRADUCIDA DE VALIDATE.JS) ---

    // Función para registrar un usuario
    const register = (user: User) => {
        // Aquí iría la lógica de tu validate.js
        // 1. Leer 'usuarios' de localStorage
        // 2. Revisar si el email ya existe
        // 3. Añadir el nuevo usuario a la lista
        // 4. Guardar la lista actualizada en 'usuarios'
        // 5. Iniciar sesión con este usuario
        console.log("Usuario registrado (lógica pendiente)", user);
        login(user); // Por ahora, solo lo logueamos
    };

    // Función para iniciar sesión
    const login = (user: User) => {
        // 1. Lo guardamos en la memoria de React (useState)
        setCurrentUser(user);
        // 2. Lo guardamos en la memoria del navegador (localStorage)
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    // Función para cerrar sesión
    const logout = () => {
        // 1. Lo borramos de la memoria de React
        setCurrentUser(null);
        // 2. Lo borramos de la memoria del navegador
        localStorage.removeItem('currentUser');
    };

    // El "Proveedor" le pasa la información a todos sus hijos
    return (
        <AuthContext.Provider value={{ currentUser, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Creamos un "gancho" (Hook) personalizado
// Esto es para que sea más fácil "usar" la mochila en otros componentes
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}