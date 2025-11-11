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
                <NavLink to="/admin" end>Dashboard</NavLink>
                <NavLink to="/admin/orders">Pedidos</NavLink>
                <NavLink to="/admin/products">Productos</NavLink>
                <NavLink to="/admin/product-new">Nuevo producto</NavLink>
                <NavLink to="/admin/users">Usuarios</NavLink>
                <NavLink to="/admin/user-new">Nuevo usuario</NavLink>

                <a href="#" onClick={handleLogout}>Cerrar Sesión</a>
            </nav>
        </aside>
    );
}

export default Sidebar;