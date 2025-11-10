
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../Types'; 

const AdminUsersPage = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);

    const loadUsers = () => {
        const usersData = JSON.parse(localStorage.getItem('usuarios') || '[]');
        setUsers(usersData);
    }

    useEffect(() => {
        loadUsers();
    }, []); 

    // --- Lógica para los botones de Acción ---

    const handleEdit = (index: number) => {
        localStorage.setItem('editUserIndex', index.toString());
        navigate('/admin/user-new');
    }

    const handleDelete = (index: number) => {
        if (confirm('¿Seguro que quieres eliminar este usuario?')) {
            let currentUsers = [...users];
            currentUsers.splice(index, 1);
            localStorage.setItem('usuarios', JSON.stringify(currentUsers));
            loadUsers();
        }
    }

    return (
        <div>
            <h1>Usuarios</h1>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>RUN</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Región</th>
                        <th>Comuna</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user.run || user.email}>
                                <td>{user.run}</td>
                                <td>{`${user.firstName} ${user.lastName}`}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.region}</td>
                                <td>{user.comuna}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => handleEdit(index)}>
                                        Editar
                                    </button>
                                    <button className="btn-del" onClick={() => handleDelete(index)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center' }}>No hay usuarios registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUsersPage;