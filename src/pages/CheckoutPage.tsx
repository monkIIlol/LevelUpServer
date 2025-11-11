import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { User, OrderDetails } from '../Types';

// Lógica de Regiones y Comunas
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
    const [errors, setErrors] = useState<Partial<typeof formData>>({});

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

    // Actualizar comunas 
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        let ok = true;
        const newErrors: Partial<typeof formData> = {};

        // Validaciones 
        if (!formData.firstName.trim()) { newErrors.firstName = 'Nombre requerido'; ok = false; }
        if (!formData.lastName.trim()) { newErrors.lastName = 'Apellido requerido'; ok = false; }
        if (!formData.email.trim()) { newErrors.email = 'Email requerido'; ok = false; }
        if (!formData.region) { newErrors.region = 'Región requerida'; ok = false; }
        if (!formData.comuna) { newErrors.comuna = 'Comuna requerida'; ok = false; }
        if (!formData.address.trim()) { newErrors.address = 'Dirección requerida'; ok = false; }

        if (!ok) {
            setErrors(newErrors);
            return;
        }

        try {
            const orderDetails: OrderDetails = {
                id: `ORDER-${new Date().toISOString()}`,
                timestamp: new Date().toLocaleString('es-CL'),
                user: formData, 
                items: cartItems,
                total: totalPrice
            };

            let history: any[] = JSON.parse(localStorage.getItem('cartHistory') || '[]');
            history.push({
                user: `${formData.firstName} ${formData.lastName}`,
                product: `${cartItems.length} items`,
                code: orderDetails.id,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('cartHistory', JSON.stringify(history));

            //GUARDAR PEDIDO ADMIN 
            const pedidosGuardados: OrderDetails[] = JSON.parse(localStorage.getItem('pedidosDetallados') || '[]');
            const pedidosActualizados = [orderDetails, ...pedidosGuardados];
            localStorage.setItem('pedidosDetallados', JSON.stringify(pedidosActualizados));


            localStorage.setItem('lastSuccessfulOrder', JSON.stringify(orderDetails));

            clearCart();
            navigate('/checkout-success');

        } catch (error) {
            console.error("Error al procesar el pago: ", error);
            navigate('/checkout-error');
        }
    };

    if (cartItems.length === 0) {
        return (
            <main id="main-content">
                <header className="page-header">
                    <h1>Checkout</h1>
                </header>
                <div className="form-container" style={{textAlign: 'center'}}>
                    <p>Tu carrito está vacío. No puedes proceder al pago.</p>
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
                <h1>Checkout</h1>
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
                            <span style={{color: 'var(--accent-2)'}}>{money(totalPrice)}</span>
                        </h3>
                    </fieldset>
                    <fieldset>
                        <legend>Información del cliente</legend>
                        <label>Nombres
                            <input name="firstName" required value={formData.firstName} onChange={handleChange} />
                            {errors.firstName && <small className="error">{errors.firstName}</small>}
                        </label>
                        <label>Apellidos
                            <input name="lastName" required value={formData.lastName} onChange={handleChange} />
                            {errors.lastName && <small className="error">{errors.lastName}</small>}
                        </label>
                        <label>Correo
                            <input name="email" type="email" required value={formData.email} onChange={handleChange} />
                            {errors.email && <small className="error">{errors.email}</small>}
                        </label>
                    </fieldset>
                    <fieldset>
                        <legend>Dirección de entrega</legend>
                        <label>Región
                            <select name="region" required value={formData.region} onChange={handleChange}>
                                <option value="">Selecciona...</option>
                                {regionNombres.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.region && <small className="error">{errors.region}</small>}
                        </label>
                        <label>Comuna
                            <select name="comuna" required value={formData.comuna} onChange={handleChange} disabled={comunas.length === 0}>
                                <option value="">Selecciona...</option>
                                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.comuna && <small className="error">{errors.comuna}</small>}
                        </label>
                        <label>Dirección (Calle y Número)
                            <input name="address" required value={formData.address} onChange={handleChange} />
                            {errors.address && <small className="error">{errors.address}</small>}
                        </label>
                    </fieldset>
                    <button className="btn" type="submit">Pagar ahora {money(totalPrice)}</button>
                </form>
            </div>
        </main>
    );
}

export default CheckoutPage;