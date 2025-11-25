// En src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import App from './App.tsx';

import { products } from './data/products';

import './css/styles.css'; 
import './css/admin.css'; 

if (!localStorage.getItem('productos')) {
  localStorage.setItem('productos', JSON.stringify(products));
}

const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios') || '[]');
const existeAdmin = usuariosExistentes.some((u: any) => u.role === 'Administrador');

if (!existeAdmin) {
  const adminUser = {
    run: '00000000-0',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@levelup.cl',
    password: 'admin123', // Contraseña por defecto
    role: 'Administrador',
    region: 'Metropolitana de Santiago',
    comuna: 'Santiago',
    address: 'Casa Central',
    birthDate: '1990-01-01'
  };
  usuariosExistentes.push(adminUser);
  localStorage.setItem('usuarios', JSON.stringify(usuariosExistentes));
  console.log("Admin por defecto creado (admin@levelup.cl / admin123)");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);