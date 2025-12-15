import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar'; 
import { useAuth } from '../../context/AuthContext';
import '../../css/admin.css'; 

const AdminLayout = () => {
  const { currentUser, isLoading } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      navigate('/login');
      return;
    }


    if (currentUser.role !== 'Administrador') {
      alert("⛔ Acceso Denegado: Solo administradores.");
      navigate('/');
    }
  }, [currentUser, isLoading, navigate]);

  // --- MIENTRAS CARGA  ---
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

  // --- SI NO ES ADMIN  ---
  if (!currentUser || currentUser.role !== 'Administrador') {
      return null; 
  }

  // --- SI ES ADMIN, MOSTRA PANEL ---
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