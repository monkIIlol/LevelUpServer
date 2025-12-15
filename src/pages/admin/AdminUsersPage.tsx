import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../Types';
import { UserService } from '../../services/UserService';
import { useToast } from '../../context/ToastContext'; 

const AdminUsersPage = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState(''); 

    const loadUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const data = await UserService.listar(token);
            setUsers(data);
        } catch (error) {
            showToast("Error al cargar usuarios", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

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
            showToast("Usuario eliminado", "success");
            loadUsers();
        } else {
            showToast("No se pudo eliminar (¿Tiene pedidos?)", "error");
        }
    };

    // LÓGICA DE FILTRADO
    const usuariosFiltrados = users.filter(user => 
        user.firstName.toLowerCase().includes(busqueda.toLowerCase()) ||
        user.lastName.toLowerCase().includes(busqueda.toLowerCase()) ||
        user.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        user.run.includes(busqueda)
    );

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h1 style={{ color: '#39FF14' }}>Gestión de Usuarios</h1>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button 
                    className="btn" 
                    onClick={() => navigate('/admin/user-new')}
                    style={{ background: '#39FF14', color: 'black', whiteSpace: 'nowrap' }}
                >
                    + Nuevo Usuario
                </button>
                
                {/* BUSCADOR */}
                <input 
                    type="text" 
                    placeholder="🔍 Buscar por nombre, email o RUN..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ 
                        width: '100%', padding: '10px', borderRadius: '5px', 
                        border: '1px solid #444', background: '#222', color: 'white' 
                    }}
                />
            </div>

            {loading ? <p>Cargando...</p> : (
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#222' }}>
                            <th style={{ padding: '10px' }}>RUN</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.length > 0 ? (
                            usuariosFiltrados.map((user) => (
                                <tr key={user.run} style={{ borderBottom: '1px solid #444' }}>
                                    <td style={{ padding: '10px' }}>{user.run}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span style={{ 
                                            color: user.role === 'Administrador' ? '#39FF14' : 'white',
                                            fontWeight: user.role === 'Administrador' ? 'bold' : 'normal'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button className="btn-edit" onClick={() => handleEdit(user)} style={{ marginRight: '10px', background: '#007bff', color: 'white', border:'none', padding:'5px', borderRadius:'4px' }}>Editar</button>
                                        <button className="btn-del" onClick={() => handleDelete(user.run, user.email)} style={{ background: '#dc3545', color: 'white', border:'none', padding:'5px', borderRadius:'4px' }}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>No se encontraron coincidencias.</td></tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsersPage;