
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

    //Lógica para los botones de Accion
    const handleEdit = (index: number) => {
        localStorage.setItem('editUserIndex', index.toString());
        navigate('/admin/user-new');
    }

    const handleDelete = (index: number) => {
        const userToDelete = users[index]; // Obtenemos el usuario a borrar

        // 1. Cargar historial de pedidos detallados
        const pedidos: any[] = JSON.parse(localStorage.getItem('pedidosDetallados') || '[]');

        // 2. Verificar si el usuario tiene pedidos
        // Nota: Asumimos que el enlace es el email. Si usas RUN, cambia a p.user.run
        const tienePedidos = pedidos.some(p => p.user.email === userToDelete.email);

        if (tienePedidos) {
            alert(`❌ No puedes eliminar al usuario "${userToDelete.email}" porque tiene pedidos registrados. Elimina sus pedidos primero si es estrictamente necesario.`);
            return;
        }

        // 3. Si no tiene pedidos, proceder con la confirmación normal
        if (confirm(`¿Seguro que quieres eliminar a ${userToDelete.firstName}?`)) {
            let currentUsers = [...users];
            currentUsers.splice(index, 1);
            localStorage.setItem('usuarios', JSON.stringify(currentUsers));
            loadUsers();
            alert('Usuario eliminado correctamente.');
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