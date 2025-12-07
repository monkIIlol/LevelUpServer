import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout(); 
        navigate('/login'); 
    }

    return (
        <aside className="sidebar">
            <h2>Admin</h2>
            <nav>
                {/* --- TUS ENLACES ORIGINALES --- */}
                <NavLink to="/admin" end>Dashboard</NavLink>
                <NavLink to="/admin/orders">Pedidos</NavLink>
                <NavLink to="/admin/products">Productos</NavLink>
                <NavLink to="/admin/product-new">Nuevo producto</NavLink>
                <NavLink to="/admin/users">Usuarios</NavLink>
                <NavLink to="/admin/user-new">Nuevo usuario</NavLink>

                {/* --- LO NUEVO (Separador visual y navegación) --- */}
                <hr style={{ margin: '10px 0', border: '0', borderTop: '1px solid #555' }} />
                
                <NavLink to="/" style={{ color: '#39FF14' }}> Ir a la Tienda</NavLink>
                <NavLink to="/perfil"> Mi Perfil</NavLink>

                <a href="#" onClick={handleLogout} style={{ color: '#ff6b6b' }}>Cerrar Sesión</a>
            </nav>
        </aside>
    );
}

export default Sidebar;