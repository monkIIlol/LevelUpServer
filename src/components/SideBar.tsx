// En src/components/Sidebar.tsx
import React from 'react';
// NavLink es una versión especial de Link que sabe cuándo está "activa"
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        // Usamos el HTML de tu 'admin/index.html'
        <aside className="sidebar">
            <h2>Admin</h2>
            <nav>
                {/* 'end' le dice al Dashboard que solo esté 'active' en la ruta exacta '/admin' */}
                <NavLink to="/admin" end>Dashboard</NavLink>
                <NavLink to="/admin/products">Productos</NavLink>
                <NavLink to="/admin/product-new">Nuevo producto</NavLink>
                <NavLink to="/admin/users">Usuarios</NavLink>
                <NavLink to="/admin/user-new">Nuevo usuario</NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;