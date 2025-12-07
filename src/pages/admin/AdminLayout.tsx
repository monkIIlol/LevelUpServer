import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar'; 
import { useAuth } from '../../context/AuthContext';
import '../../css/admin.css'; 

const AdminLayout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Si no hay usuario logueado -> Login
    if (!currentUser) {
      alert("Debes iniciar sesión para entrar aquí.");
      navigate('/login');
      return;
    }

    // 2. Si hay usuario pero NO es Administrador -> Home 
    if (currentUser.role !== 'Administrador') {
      alert("⛔ Acceso Denegado: Solo administradores.");
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Si no es admin, no renderiza
  if (!currentUser || currentUser.role !== 'Administrador') {
      return null; 
  }

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