import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../Types';
import { UserService } from '../../services/UserService'; // Conexión a BD

const AdminUsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);

    // Cargar usuarios desde la Base de Datos
    const loadUsers = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const data = await UserService.listar(token);
            setUsers(data);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    // Lógica para Editar
    const handleEdit = (user: User) => {
        // Guardamos el RUN o Email para editar
        localStorage.setItem('editUserRun', user.run);
        navigate('/admin/user-new');
    }

    // Lógica para Eliminar (Conectada a Java)
    const handleDelete = async (run: string, email: string) => {
        // 1. Confirmación visual
        if (!confirm(`¿Seguro que quieres eliminar al usuario ${email}?`)) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return alert("No estás autorizado");

        // 2. Intentar borrar en la Base de Datos
        const exito = await UserService.eliminar(run, token);

        if (exito) {
            alert('Usuario eliminado correctamente de la Base de Datos.');
            loadUsers(); // Recargar tabla
        } else {
            // Si falla, es probable que la BD (Foreign Key) lo haya bloqueado por tener pedidos
            alert(`❌ No puedes eliminar al usuario "${email}" porque tiene pedidos registrados o ocurrió un error en el servidor.`);
        }
    }

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h1 style={{ color: '#39FF14' }}>Usuarios (Base de Datos)</h1>

            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: '#222', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>RUN</th>
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
                        users.map((user) => (
                            <tr key={user.run || user.email} style={{ borderBottom: '1px solid #444' }}>
                                <td style={{ padding: '10px' }}>{user.run}</td>
                                <td>{`${user.firstName} ${user.lastName}`}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.region}</td>
                                <td>{user.comuna}</td>
                                <td className="actions-cell">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(user)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn-del"
                                        onClick={() => handleDelete(user.run, user.email)}
                                        style={{ background: '#d33', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No hay usuarios registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUsersPage;