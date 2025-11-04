export interface User {
    run: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: string;
    region: string;
    comuna: string;
    address: string;
    birthDate: string | null;
}

// Este es el "molde" de nuestra mochila (AuthContext)
// Define qué cosas va a compartir
export interface AuthContextType {
    currentUser: User | null; // El usuario que está logueado (o null si no hay nadie)
    login: (user: User) => void;   // La función para iniciar sesión
    logout: () => void;           // La función para cerrar sesión
    register: (user: User) => void; // La función para registrarse
}