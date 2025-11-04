// En src/App.tsx
import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // 1. IMPORTA LA NUEVA PÁGINA
import RegisterPage from './pages/RegisterPage';

// Esta es la "Plantilla Maestra" de tu sitio
const AppLayout = () => {
    return (
        <>
            <Header />
            <Outlet /> {/* <-- Aquí es donde se "pintarán" las páginas */}
            <Footer />
        </>
    );
}

// Aquí definimos qué componente se muestra para cada URL
function App() {
    return (
        <Routes>
            {/* Todas las rutas que estén aquí adentro usarán el AppLayout */}
            <Route path="/" element={<AppLayout />}>

                {/* Si la URL es exactamente "/", muestra la HomePage */}
                <Route index element={<HomePage />} />

                {/* 2. AÑADE ESTA NUEVA RUTA */}
                <Route path="login" element={<LoginPage />} />

                <Route path="register" element={<RegisterPage />} />

                </Route>

                {/* Más adelante añadiremos más rutas aquí */}
                {/* <Route path="products" element={<ProductsPage />} /> */}

        </Routes>
    );
}

export default App;