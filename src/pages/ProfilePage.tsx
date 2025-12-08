import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import type { OrderDetails, User } from '../Types';
import { OrderService } from '../services/OrderService';
import { UserService } from '../services/UserService';


const regiones: Record<string, string[]> = {
    'Metropolitana de Santiago': ['Santiago', 'San Bernardo', 'Maipú', 'Puente Alto'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
    'Concepción': ['Concepción', 'Hualpen', 'Talcahuano', 'Tomé']
};
const regionNombres = Object.keys(regiones);

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const ProfilePage = () => {
    const { currentUser, login } = useAuth();
    const navigate = useNavigate();

    // Estados
    const [activeTab, setActiveTab] = useState<'perfil' | 'pedidos'>('perfil');
    const [isEditing, setIsEditing] = useState(false);
    const [misPedidos, setMisPedidos] = useState<OrderDetails[]>([]);
    const [loading, setLoading] = useState(false);

    // Formulario
    const [formData, setFormData] = useState<Partial<User>>({});
    const [comunas, setComunas] = useState<string[]>([]);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            if (currentUser) {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Cargar Pedidos
                const pedidosReales = await OrderService.obtenerMisPedidos(token);
                setMisPedidos(pedidosReales);

                setFormData({
                    run: currentUser.run,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    email: currentUser.email,
                    region: currentUser.region,
                    comuna: currentUser.comuna,
                    address: currentUser.address
                });

                if (currentUser.region && regiones[currentUser.region]) {
                    setComunas(regiones[currentUser.region]);
                }
            }
        };
        cargarDatos();
    }, [currentUser]);

    // Manejar inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'region') {
            setComunas(regiones[value] || []);
            setFormData(prev => ({ ...prev, comuna: '' }));
        }
    };

    // Guardar cambios 
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        if (!formData.firstName || !formData.lastName || !formData.address) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Sesión expirada.");
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const usuarioParaGuardar = {
                ...currentUser,
                ...formData
            } as User;

            const usuarioActualizado = await UserService.actualizar(usuarioParaGuardar, token);
            if (usuarioActualizado) {
                localStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));
                alert("Perfil actualizado correctamente  ✅");
                setIsEditing(false);
                window.location.reload();
            } else {
                alert("Error al actualizar el perfil.");
            }

        } catch (error) {
            console.error("Error al guardar perfil:", error);
            alert("Hubo un problema de conexión.");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <main id="main-content" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2>Acceso Restringido</h2>
                <p>Debes iniciar sesión para ver tu perfil.</p>
                <Link to="/login" className="btn-primary" style={{ display: 'inline-block', width: 'auto', marginTop: '1rem' }}>Iniciar Sesión</Link>
            </main>
        );
    }

    return (
        <main id="main-content" className="gamer-bg">
            <header className="page-header">
                <h1>Mi Cuenta</h1>
            </header>

            {/* --- TABS --- */}
            <div className="profile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
                    onClick={() => setActiveTab('perfil')}
                >
                    Mis Datos
                </button>
                <button
                    className={`tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pedidos')}
                >
                    Mis Pedidos
                </button>
            </div>

            {/* --- PESTAÑA PERFIL --- */}
            {activeTab === 'perfil' && (
                <section className="profile-card">
                    {!isEditing ? (
                        <div className="profile-view">
                            <div className="profile-header">
                                <h2>Información Personal</h2>
                                <button onClick={() => setIsEditing(true)} className="btn-icon-edit">
                                    Modificar
                                </button>
                            </div>

                            <div className="data-grid">
                                <div className="data-item">
                                    <span className="data-label">Nombre Completo</span>
                                    <span className="data-value">{currentUser.firstName} {currentUser.lastName}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">RUN</span>
                                    <span className="data-value">{currentUser.run}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Correo Electrónico</span>
                                    <span className="data-value">{currentUser.email}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Ubicación</span>
                                    <span className="data-value">{currentUser.region}, {currentUser.comuna}</span>
                                </div>
                                <div className="data-item">
                                    <span className="data-label">Dirección de Envío</span>
                                    <span className="data-value">{currentUser.address}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // MODO EDICIÓN
                        <form onSubmit={handleSave} className="profile-edit">
                            <div className="profile-header">
                                <h2>Editar Perfil</h2>
                            </div>

                            <div className="edit-grid">
                                <div>
                                    <label>Nombres</label>
                                    <input name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Apellidos</label>
                                    <input name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Región</label>
                                    <select name="region" value={formData.region || ''} onChange={handleChange} required>
                                        <option value="">Selecciona...</option>
                                        {regionNombres.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Comuna</label>
                                    <select name="comuna" value={formData.comuna || ''} onChange={handleChange} required disabled={!comunas.length}>
                                        {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Dirección</label>
                                    <input name="address" value={formData.address || ''} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="edit-actions">
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancelar</button>
                            </div>
                        </form>
                    )}
                </section>
            )}

            {/* --- PESTAÑA PEDIDOS --- */}
            {activeTab === 'pedidos' && (
                <section className="orders-container">
                    {misPedidos.length === 0 ? (
                        <div className="profile-card" style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '1.5rem' }}>
                                Aún no has realizado compras en Level-Up.
                            </p>
                            <Link to="/products" className="btn-primary" style={{ display: 'inline-block', width: 'auto' }}>
                                Ir a la Tienda
                            </Link>
                        </div>
                    ) : (
                        misPedidos.map(pedido => (
                            <article key={pedido.id} className="order-item">
                                <div className="order-header">
                                    <div>
                                        <div className="order-id">Pedido #{pedido.id}</div>
                                        <div className="order-date">{pedido.timestamp}</div>
                                    </div>
                                    <div style={{ color: '#39FF14' }}>✅ Pagado</div>
                                </div>
                                <div className="order-body">
                                    <ul className="order-product-list">
                                        {pedido.items.map((item, idx) => (
                                            <li key={idx} className="order-product">
                                                <span>{item.qty}x {item.name}</span>
                                                <span>{money(item.price * item.qty)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="order-total-price">
                                        Total: {money(pedido.total)}
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            )}
        </main>
    );
}

export default ProfilePage;