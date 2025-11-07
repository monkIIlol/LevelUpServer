// En src/pages/admin/AdminUserFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../Types';

// --- FUNCIONES DE VALIDACIÓN (Copiadas de tu validate.js) ---
const regiones = {
    'Metropolitana de Santiago': ['Santiago', 'San Bernardo', 'Maipú', 'Puente Alto'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
    'Concepción': ['Concepción', 'Hualpen', 'Talcahuano', 'Tomé']
};
const regionNombres = Object.keys(regiones);

const validarRUN = (run: string): boolean => {
    if (!run) return false;
    const clean = String(run).toUpperCase().replace(/[^0-9K]/g, '');
    if (clean.length < 7 || clean.length > 9) return false;
    const dv = clean.slice(-1);
    const cuerpo = clean.slice(0, -1);
    let suma = 0, mult = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * mult;
        mult = mult === 7 ? 2 : mult + 1;
    }
    const res = 11 - (suma % 11);
    const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res);
    return dv === dvCalc;
}
const soloLetras = (v: string): boolean => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v);
const emailValido = (email: string): boolean => {
    if (!email.trim() || email.length > 100) return false;
    return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email.trim());
}
// -------------------------------------------------------------

const AdminUserFormPage = () => {
    const navigate = useNavigate();

    // Estado para todos los campos del formulario
    const [formData, setFormData] = useState<Partial<User>>({
        run: '', firstName: '', lastName: '', email: '', role: 'Cliente', region: '', comuna: '', address: '', birthDate: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [comunas, setComunas] = useState<string[]>([]);

    // Efecto para rellenar comunas
    useEffect(() => {
        if (formData.region) {
            setComunas(regiones[formData.region as keyof typeof regiones] || []);
        } else {
            setComunas([]);
        }
    }, [formData.region]);

    // 'useEffect' para cargar los datos si estamos editando
    useEffect(() => {
        const indexStr = localStorage.getItem('editUserIndex');
        if (indexStr !== null) {
            const index = parseInt(indexStr, 10);
            const users: User[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const userToEdit = users[index];

            if (userToEdit) {
                setFormData(userToEdit); // Rellena el formulario
                setIsEditing(true);
                setEditIndex(index);
            }
        }
        // Al salir, limpiamos el 'editUserIndex'
        return () => {
            localStorage.removeItem('editUserIndex');
        }
    }, []); // El '[]' vacío significa "ejecútate solo al inicio"

    // Manejador de cambios genérico
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Lógica para guardar (traducida de tu 'validate.js')
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        let ok = true;
        const newErrors: Record<string, string> = {};

        // Validaciones (copiadas de tu 'validate.js' de registro)
        if (!validarRUN(formData.run!)) { newErrors.run = 'RUN inválido'; ok = false; }
        if (!formData.firstName || !soloLetras(formData.firstName)) { newErrors.firstName = 'Nombre inválido'; ok = false; }
        if (!formData.lastName || !soloLetras(formData.lastName)) { newErrors.lastName = 'Apellido inválido'; ok = false; }
        if (!emailValido(formData.email!)) { newErrors.email = 'Email inválido'; ok = false; }
        if (!formData.role) { newErrors.role = 'Rol requerido'; ok = false; }
        if (!formData.region) { newErrors.region = 'Región requerida'; ok = false; }
        if (!formData.comuna) { newErrors.comuna = 'Comuna requerida'; ok = false; }
        if (!formData.address) { newErrors.address = 'Dirección requerida'; ok = false; }

        if (!ok) {
            setErrors(newErrors);
            return;
        }

        const usuarios: User[] = JSON.parse(localStorage.getItem('usuarios') || '[]');

        // Creamos el objeto final (asegurándonos de que 'password' no se pierda si existe)
        const finalUser: User = {
            run: formData.run!,
            firstName: formData.firstName!,
            lastName: formData.lastName!,
            email: formData.email!,
            role: formData.role!,
            region: formData.region!,
            comuna: formData.comuna!,
            address: formData.address!,
            birthDate: formData.birthDate || null,
            password: formData.password || '1234' // Asigna una contraseña por defecto si estás creando desde el admin
        };

        if (isEditing && editIndex !== null) {
            // MODO EDICIÓN
            // Mantenemos la contraseña original si no la estamos editando
            finalUser.password = usuarios[editIndex].password;
            usuarios[editIndex] = finalUser;
            alert('Usuario actualizado ✅');
        } else {
            // MODO NUEVO
            usuarios.push(finalUser);
            alert('Usuario agregado ✅');
        }

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        navigate('/admin/users');
    };

    return (
        <div>
            <h1>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h1>

            {/* Tu formulario de 'admin-user-new.html' traducido */}
            <form id="form-admin-user" noValidate onSubmit={handleSubmit}>
                <label>RUN
                    <input name="run" required minLength={7} maxLength={9} placeholder="19011022K" value={formData.run} onChange={handleChange} />
                    {errors.run && <small className="error">{errors.run}</small>}
                </label>
                <label>Nombres
                    <input name="firstName" required maxLength={50} value={formData.firstName} onChange={handleChange} />
                    {errors.firstName && <small className="error">{errors.firstName}</small>}
                </label>
                <label>Apellidos
                    <input name="lastName" required maxLength={100} value={formData.lastName} onChange={handleChange} />
                    {errors.lastName && <small className="error">{errors.lastName}</small>}
                </label>
                <label>Correo
                    <input name="email" type="email" required maxLength={100} value={formData.email} onChange={handleChange} />
                    {errors.email && <small className="error">{errors.email}</small>}
                </label>
                <label>Fecha nacimiento
                    <input name="birthDate" type="date" value={formData.birthDate || ''} onChange={handleChange} />
                </label>
                <label>Tipo de usuario
                    <select name="role" required value={formData.role} onChange={handleChange}>
                        <option value="">Selecciona…</option>
                        <option>Administrador</option>
                        <option>Vendedor</option>
                        <option>Cliente</option>
                    </select>
                    {errors.role && <small className="error">{errors.role}</small>}
                </label>
                <label>Región
                    <select name="region" id="admin-region" required value={formData.region} onChange={handleChange}>
                        <option value="">Selecciona...</option>
                        {regionNombres.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors.region && <small className="error">{errors.region}</small>}
                </label>
                <label>Comuna
                    <select name="comuna" id="admin-comuna" required value={formData.comuna} onChange={handleChange} disabled={comunas.length === 0}>
                        <option value="">Selecciona...</option>
                        {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.comuna && <small className="error">{errors.comuna}</small>}
                </label>
                <label>Dirección
                    <input name="address" required maxLength={300} value={formData.address} onChange={handleChange} />
                    {errors.address && <small className="error">{errors.address}</small>}
                </label>

                {/* Nota: No incluimos un campo de contraseña para simplificar,
           el admin no debería manejar contraseñas de usuarios. */}

                <button className="btn" type="submit">{isEditing ? 'Actualizar' : 'Guardar'}</button>
            </form>
        </div>
    );
}

export default AdminUserFormPage;