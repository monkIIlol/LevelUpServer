import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
import { OrderService } from '../services/OrderService';

const regiones: Record<string, string[]> = {
    'Metropolitana de Santiago': ['Santiago', 'San Bernardo', 'Maipú', 'Puente Alto'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
    'Concepción': ['Concepción', 'Hualpen', 'Talcahuano', 'Tomé']
};
const regionNombres = Object.keys(regiones);

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const CheckoutPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        region: '',
        comuna: '',
        address: ''
    });
    const [comunas, setComunas] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Cargar datos del usuario si está logueado
    useEffect(() => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                region: currentUser.region || '',
                comuna: currentUser.comuna || '',
                address: currentUser.address || ''
            });
        }
    }, [currentUser]);

    // Cargar comunas al cambiar región
    useEffect(() => {
        if (formData.region && regiones[formData.region]) {
            setComunas(regiones[formData.region]);
        } else {
            setComunas([]);
        }
    }, [formData.region]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        setErrors({});
        let ok = true;
        const newErrors: Record<string, string> = {};

        // Validaciones simples
        if (!formData.firstName.trim()) { newErrors.firstName = 'Requerido'; ok = false; }
        if (!formData.lastName.trim()) { newErrors.lastName = 'Requerido'; ok = false; }
        if (!formData.email.trim()) { newErrors.email = 'Requerido'; ok = false; }
        if (!formData.region) { newErrors.region = 'Requerido'; ok = false; }
        if (!formData.comuna) { newErrors.comuna = 'Requerido'; ok = false; }
        if (!formData.address.trim()) { newErrors.address = 'Requerido'; ok = false; }

        if (!ok) {
            setErrors(newErrors);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
                navigate('/login');
                return;
            }

            // 1. Crear el pedido en el Backend
            const respuestaBackend = await OrderService.crearPedido(cartItems, token);
            
            // 2. IMPORTANTE: Guardamos los datos de la compra ANTES de limpiar
            const datosCompra = {
                orderId: respuestaBackend.id, // ID que devuelve el backend
                items: [...cartItems],        // Copia de los items
                total: totalPrice,            // Total pagado
                buyer: { ...formData }        // Datos del cliente
            };

            // 3. Limpiamos el carrito
            clearCart(); 

            // 4. Navegamos a la página de éxito PASANDO LOS DATOS en el 'state'
            // OJO: La ruta debe coincidir con tu App.tsx (/checkout/success)
            navigate('/checkout/success', { state: datosCompra });

        } catch (error: any) {
            console.error("Fallo la compra:", error);
            alert("Error al procesar la compra: " + error.message);
            navigate('/checkout/failure');
        }
    };

    if (cartItems.length === 0) {
        return (
            <main id="main-content">
                <header className="page-header">
                    <h1>Checkout</h1>
                </header>
                <div className="form-container" style={{textAlign: 'center'}}>
                    <p>Tu carrito está vacío.</p>
                    <Link to="/products" className="btn-primary" style={{textDecoration: 'none', padding: '0.8rem 1.5rem', display: 'inline-block', width: 'auto'}}>
                        Ver productos
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main id="main-content">
            <header className="page-header">
                <h1>Finalizar Compra</h1>
            </header>
            <div className="form-container">
                <form id="form-checkout" onSubmit={handleSubmit} noValidate>
                    <fieldset>
                        <legend>Resumen de Compra</legend>
                        <ul style={{listStyle: 'none', padding: 0}}>
                            {cartItems.map(item => (
                                <li key={item.code} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                    <span>{item.name} (x{item.qty})</span>
                                    <strong>{money(item.price * item.qty)}</strong>
                                </li>
                            ))}
                        </ul>
                        <hr style={{borderColor: '#444'}} />
                        <h3 style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Total a pagar:</span>
                            <span style={{color: '#39FF14'}}>{money(totalPrice)}</span>
                        </h3>
                    </fieldset>

                    <fieldset>
                        <legend>Datos de Envío</legend>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Nombres</label>
                            <input 
                                name="firstName" 
                                required 
                                value={formData.firstName} 
                                onChange={handleChange} 
                                style={{ width: '100%', padding: '8px' }}
                            />
                            {errors.firstName && <small className="error">{errors.firstName}</small>}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Apellidos</label>
                            <input 
                                name="lastName" 
                                required 
                                value={formData.lastName} 
                                onChange={handleChange} 
                                style={{ width: '100%', padding: '8px' }}
                            />
                            {errors.lastName && <small className="error">{errors.lastName}</small>}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Correo</label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                value={formData.email} 
                                onChange={handleChange} 
                                style={{ width: '100%', padding: '8px' }}
                            />
                            {errors.email && <small className="error">{errors.email}</small>}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Región</label>
                            <select 
                                name="region" 
                                required 
                                value={formData.region} 
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px' }}
                            >
                                <option value="">Selecciona...</option>
                                {regionNombres.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.region && <small className="error">{errors.region}</small>}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Comuna</label>
                            <select 
                                name="comuna" 
                                required 
                                value={formData.comuna} 
                                onChange={handleChange} 
                                disabled={!comunas.length}
                                style={{ width: '100%', padding: '8px' }}
                            >
                                <option value="">Selecciona...</option>
                                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.comuna && <small className="error">{errors.comuna}</small>}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Dirección</label>
                            <input 
                                name="address" 
                                required 
                                value={formData.address} 
                                onChange={handleChange} 
                                style={{ width: '100%', padding: '8px' }}
                            />
                            {errors.address && <small className="error">{errors.address}</small>}
                        </div>
                    </fieldset>

                    <button className="btn" type="submit" style={{ width: '100%', marginTop: '20px', background: '#39FF14', color: 'black', fontWeight: 'bold' }}>
                        Pagar {money(totalPrice)}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default CheckoutPage;