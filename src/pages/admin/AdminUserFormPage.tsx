import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../Types';
import { UserService } from '../../services/UserService';

// --- VALIDACIONES AUXILIARES ---
const regiones: Record<string, string[]> = {
    'Metropolitana de Santiago': ['Santiago', 'San Bernardo', 'Maipú', 'Puente Alto'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
    'Concepción': ['Concepción', 'Hualpen', 'Talcahuano', 'Tomé']
};
const regionNombres = Object.keys(regiones);

const validarRUN = (run: string): boolean => {
    if (!run) return false;
    const clean = String(run).toUpperCase().replace(/[^0-9K]/g, '');
    if (clean.length < 7 || clean.length > 9) return false;
    // Validación simplificada para el ejemplo
    return true; 
}
const emailValido = (email: string): boolean => /^[^\s@]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(email);

const AdminUserFormPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<User>({
        run: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Cliente',
        region: '',
        comuna: '',
        address: '',
        birthDate: ''
    });

    const [comunas, setComunas] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Cargar datos si estamos editando
    useEffect(() => {
        const loadUserToEdit = async () => {
            const runToEdit = localStorage.getItem('editUserRun');
            const token = localStorage.getItem('token');

            if (runToEdit && token) {
                setIsEditing(true);
                setLoading(true);
                try {
                    const user = await UserService.obtenerPorRun(runToEdit, token);
                    if (user) {
                        setFormData({
                            ...user,
                            password: '' // No traemos la contraseña por seguridad
                        });
                        // Cargar comunas correspondientes a la región del usuario
                        if (user.region && regiones[user.region]) {
                            setComunas(regiones[user.region]);
                        }
                    } else {
                        alert("No se pudo cargar el usuario.");
                        navigate('/admin/users');
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadUserToEdit();

        // Limpiar flag al salir (opcional, pero buena práctica)
        return () => {
            localStorage.removeItem('editUserRun');
        }
    }, [navigate]);

    // Actualizar comunas al cambiar región
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

        // Validaciones básicas
        if (!validarRUN(formData.run)) { newErrors.run = 'RUN inválido'; ok = false; }
        if (!formData.firstName) { newErrors.firstName = 'Nombre requerido'; ok = false; }
        if (!formData.lastName) { newErrors.lastName = 'Apellido requerido'; ok = false; }
        if (!emailValido(formData.email)) { newErrors.email = 'Email inválido'; ok = false; }
        if (!formData.role) { newErrors.role = 'Rol requerido'; ok = false; }
        
        // Contraseña obligatoria solo si es nuevo usuario
        if (!isEditing && (!formData.password || formData.password.length < 4)) {
            newErrors.password = 'Contraseña requerida (min 4 chars)'; ok = false;
        }

        if (!ok) {
            setErrors(newErrors);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return alert("Debes iniciar sesión.");

        try {
            setLoading(true);
            if (isEditing) {
                // Actualizar en BD
                const resultado = await UserService.actualizar(formData, token);
                if (resultado) alert('Usuario actualizado correctamente ✅');
                else throw new Error("Fallo al actualizar");
            } else {
                // Crear en BD
                const resultado = await UserService.crear(formData, token);
                if (resultado) alert('Usuario creado ✅');
                else throw new Error("Fallo al crear");
            }
            navigate('/admin/users');
        } catch (error: any) {
            console.error(error);
            alert('Error: ' + (error.message || "No se pudo guardar el usuario."));
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <div style={{padding:'2rem', color:'white'}}>Cargando datos...</div>;

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h1 style={{ color: '#39FF14', textAlign: 'center' }}>
                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h1>

            <form onSubmit={handleSubmit} style={{ margin: '0 auto' }}>
                
                {/* RUN (Bloqueado al editar porque es la llave primaria lógica) */}
                <label>RUN
                    <input
                        name="run"
                        value={formData.run}
                        onChange={handleChange}
                        disabled={isEditing}
                        placeholder="12345678-9"
                        style={{ background: isEditing ? '#333' : '#121212', cursor: isEditing ? 'not-allowed' : 'text' }}
                    />
                    {errors.run && <small className="error">{errors.run}</small>}
                </label>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label>Nombre
                            <input name="firstName" value={formData.firstName} onChange={handleChange} />
                            {errors.firstName && <small className="error">{errors.firstName}</small>}
                        </label>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Apellido
                            <input name="lastName" value={formData.lastName} onChange={handleChange} />
                            {errors.lastName && <small className="error">{errors.lastName}</small>}
                        </label>
                    </div>
                </div>

                <label>Correo Electrónico
                    <input name="email" type="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <small className="error">{errors.email}</small>}
                </label>

                <label>Contraseña {isEditing && <small style={{color:'#aaa'}}>(Dejar en blanco para mantener la actual)</small>}
                    <input 
                        name="password" 
                        type="password" 
                        value={formData.password || ''} 
                        onChange={handleChange}
                        placeholder={isEditing ? "********" : "Nueva contraseña"} 
                    />
                    {errors.password && <small className="error">{errors.password}</small>}
                </label>

                <label>Rol
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="Cliente">Cliente</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Vendedor">Vendedor</option>
                    </select>
                </label>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label>Región
                            <select name="region" value={formData.region} onChange={handleChange}>
                                <option value="">Selecciona...</option>
                                {regionNombres.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </label>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Comuna
                            <select name="comuna" value={formData.comuna} onChange={handleChange} disabled={!comunas.length}>
                                <option value="">Selecciona...</option>
                                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </label>
                    </div>
                </div>

                <label>Dirección
                    <input name="address" value={formData.address} onChange={handleChange} />
                </label>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/users')}
                        className="btn"
                        style={{ flex: 1, background: '#555', color: '#fff' }}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn"
                        style={{ flex: 1, background: '#39FF14', color: '#000' }}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AdminUserFormPage;