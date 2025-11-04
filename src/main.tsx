////////////////// // En src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 1. IMPORTA EL PROVEEDOR
import App from './App.tsx';
import './css/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* 2. ENVUELVE TU APP */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);