import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../Types';
import { UserService } from '../../services/UserService';

const AdminUsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await UserService.listar(token);
            setUsers(data);
        } catch (error) {
            console.error("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleEdit = (user: User) => {
        localStorage.setItem('editUserRun', user.run);
        navigate('/admin/user-new');
    };

    const handleDelete = async (run: string, email: string) => {
        if (!confirm(`¿Eliminar a ${email}?`)) return;
        
        const token = localStorage.getItem('token');
        if (!token) return;

        const exito = await UserService.eliminar(run, token);
        if (exito) {
            alert('Usuario eliminado correctamente.');
            loadUsers();
        } else {
            alert('No se pudo eliminar (verificar si tiene pedidos asociados).');
        }
    };

    if (loading) {
        return <div style={{padding: '2rem', color: 'white'}}>Cargando usuarios...</div>;
    }

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h1 style={{ color: '#39FF14' }}>Gestión de Usuarios (BD)</h1>
            
            <button 
                className="btn" 
                onClick={() => navigate('/admin/user-new')}
                style={{marginBottom: '1rem', background: '#39FF14', color: 'black'}}
            >
                + Nuevo Usuario
            </button>

            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: '#222', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>RUN</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Región</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.run} style={{ borderBottom: '1px solid #444' }}>
                                <td style={{ padding: '10px' }}>{user.run}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.region}</td>
                                <td className="actions-cell">
                                    <button 
                                        className="btn-edit" 
                                        onClick={() => handleEdit(user)}
                                        style={{ marginRight: '10px', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: '#007bff', color: 'white' }}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        className="btn-del" 
                                        onClick={() => handleDelete(user.run, user.email)}
                                        style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: '#dc3545', color: 'white' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                                No se encontraron usuarios.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsersPage;