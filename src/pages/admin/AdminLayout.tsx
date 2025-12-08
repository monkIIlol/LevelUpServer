import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar'; 
import { useAuth } from '../../context/AuthContext';
import '../../css/admin.css'; 

const AdminLayout = () => {
  // Ahora usamos isLoading también
  const { currentUser, isLoading } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Si todavía estamos cargando el usuario del localStorage, NO hacemos nada.
    if (isLoading) return;

    // 2. Si terminó de cargar y NO hay usuario, mandamos al login.
    if (!currentUser) {
      // (Opcional: puedes quitar este alert si te molesta al recargar)
      // alert("Debes iniciar sesión para entrar aquí."); 
      navigate('/login');
      return;
    }

    // 3. Si hay usuario pero NO es Administrador, lo echamos al inicio.
    if (currentUser.role !== 'Administrador') {
      alert("⛔ Acceso Denegado: Solo administradores.");
      navigate('/');
    }
  }, [currentUser, isLoading, navigate]);

  // --- MIENTRAS CARGA (Pantalla de espera) ---
  if (isLoading) {
      return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#121212', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            fontSize: '1.2rem'
        }}>
          <p>Verificando sesión...</p>
        </div>
      );
  }

  // --- SI NO ES ADMIN (Protección visual extra) ---
  // Si terminó de cargar y no es admin, no renderizamos nada (para evitar parpadeos) antes del redirect.
  if (!currentUser || currentUser.role !== 'Administrador') {
      return null; 
  }

  // --- SI ES ADMIN, MOSTRAMOS EL PANEL ---
  return (
    <div className="admin">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;