import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import type { OrderDetails, User } from '../Types';
import { OrderService } from '../services/OrderService';

// --- Datos de Regiones (Misma lógica) ---
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
    
    const [formData, setFormData] = useState<Partial<User>>({});
    const [comunas, setComunas] = useState<string[]>([]);
    

    // Cargar datos
    useEffect(() => {
        const cargarPedidos = async () => {
            if (currentUser) {
                const token = localStorage.getItem('token');
                if (token) {
                    // Llamamos al backend real
                    const pedidosReales = await OrderService.obtenerMisPedidos(token);
                    setMisPedidos(pedidosReales);
                }
            }
        };
        cargarPedidos();
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
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        if (!formData.firstName || !formData.lastName || !formData.address) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        const usuarios: User[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const index = usuarios.findIndex(u => u.email === currentUser.email);

        if (index !== -1) {
            const usuarioActualizado = { ...usuarios[index], ...formData };
            usuarios[index] = usuarioActualizado as User;
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            login(usuarioActualizado as User);
            alert("Perfil actualizado correctamente ✅");
            setIsEditing(false);
        }
    };

    if (!currentUser) {
        return (
            <main id="main-content" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <h2>Acceso Restringido</h2>
                <p>Debes iniciar sesión para ver tu perfil.</p>
                <Link to="/login" className="btn-primary" style={{ display:'inline-block', width: 'auto', marginTop: '1rem' }}>Iniciar Sesión</Link>
            </main>
        );
    }

    return (
        <main id="main-content">
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
                        // MODO LECTURA
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
                                    <input name="firstName" value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Apellidos</label>
                                    <input name="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label>Región</label>
                                    <select name="region" value={formData.region} onChange={handleChange} required>
                                        <option value="">Selecciona...</option>
                                        {regionNombres.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Comuna</label>
                                    <select name="comuna" value={formData.comuna} onChange={handleChange} required disabled={!comunas.length}>
                                        {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Dirección</label>
                                    <input name="address" value={formData.address} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="edit-actions">
                                <button type="submit" className="btn-primary">Guardar Cambios</button>
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
                        <div className="profile-card" style={{textAlign: 'center'}}>
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
                                        <div className="order-id">Pedido #{pedido.id.slice(0, 8)}</div>
                                        <div className="order-date">{pedido.timestamp}</div>
                                    </div>
                                    <div style={{ color: '#fff' }}>✅ Procesado</div>
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
                                        Total Pagado: {money(pedido.total)}
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