
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { User } from '../Types';

// --- FUNCIONES DE VALIDACIÓN ---
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

const validarFechaNacimiento = (fecha: string): { ok: boolean, error: string } => {
    if (!fecha) {
        return { ok: false, error: 'Fecha de nacimiento requerida' };
    }
    const d = new Date(fecha);
    const isValid = !isNaN(d.getTime());
    const today = new Date();
    const minDate = new Date(1900, 0, 1);

    if (!isValid) return { ok: false, error: 'Fecha inválida' };
    if (d > today) return { ok: false, error: 'La fecha no puede ser futura' };
    if (d < minDate) return { ok: false, error: 'La fecha es demasiado antigua' };

    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;

    if (age < 18) {
        return { ok: false, error: 'Debes ser mayor de 18 años' };
    }

    return { ok: true, error: '' };
}
// -------------------------------------------------------------

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        run: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        role: 'Cliente',
        region: '',
        comuna: '',
        address: ''
    });

    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [comunas, setComunas] = useState<string[]>([]);

    useEffect(() => {
        if (formData.region) {
            setComunas(regiones[formData.region as keyof typeof regiones] || []);
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

    // --- LÓGICA DE VALIDACIÓN COMPLETA  ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        let ok = true;
        const newErrors: Partial<typeof formData> = {};

        // 1. Validar RUN
        if (!validarRUN(formData.run)) {
            newErrors.run = 'RUN inválido (sin puntos ni guion, ej: 19011022K)'; ok = false;
        }
        // 2. Validar Nombres
        if (!formData.firstName.trim() || formData.firstName.length > 50 || !soloLetras(formData.firstName)) {
            newErrors.firstName = 'Nombre inválido (requerido, máx 50, solo letras)'; ok = false;
        }
        // 3. Validar Apellidos
        if (!formData.lastName.trim() || formData.lastName.length > 100 || !soloLetras(formData.lastName)) {
            newErrors.lastName = 'Apellido inválido (requerido, máx 100, solo letras)'; ok = false;
        }
        // 4. Validar Email
        if (!emailValido(formData.email)) {
            newErrors.email = 'Correo inválido (solo @duoc.cl, @profesor.duoc.cl o @gmail.com)'; ok = false;
        }
        // 5. Validar Contraseñas
        if (formData.password.length < 4 || formData.password.length > 10) {
            newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres'; ok = false;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'; ok = false;
        }
        // 6. Validar Selects y Dirección
        if (!formData.role) { newErrors.role = 'Selecciona un perfil'; ok = false; }
        if (!formData.region) { newErrors.region = 'Selecciona región'; ok = false; }
        if (!formData.comuna) { newErrors.comuna = 'Selecciona comuna'; ok = false; }
        if (!formData.address.trim() || formData.address.length > 300) {
            newErrors.address = 'Dirección requerida (máx 300)'; ok = false;
        }
        // 7. Validar Fecha de Nacimiento
        const fechaValida = validarFechaNacimiento(formData.birthDate);
        if (!fechaValida.ok) {
            newErrors.birthDate = fechaValida.error; ok = false;
        }

        if (!ok) {
            setErrors(newErrors);
            return; 
        }

        try {
            const newUser: User = {
                run: formData.run.trim(),
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role,
                region: formData.region,
                comuna: formData.comuna,
                address: formData.address.trim(),
                birthDate: formData.birthDate
            };

            register(newUser); 
            alert('Usuario creado con éxito ✅');
            navigate('/'); 

        } catch (error: any) {
            setErrors({ email: error.message });
        }
    };

    // --- HTML  ---
    return (
        <main id="main-content">
            <header className="page-header">
                <h1>Registro</h1>
            </header>
            <div className="form-container">
                <form id="form-register" onSubmit={handleSubmit}>

                    <fieldset>
                        <legend>Datos de acceso</legend>
                        <label>Correo
                            <input name="email" type="email" required placeholder="tucorreo@duoc.cl" value={formData.email} onChange={handleChange} />
                            {errors.email && <small className="error">{errors.email}</small>}
                        </label>
                        <label>Contraseña
                            <input name="password" type="password" minLength={4} maxLength={10} required value={formData.password} onChange={handleChange} />
                            {errors.password && <small className="error">{errors.password}</small>}
                        </label>
                        <label>Confirmar Contraseña
                            <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />
                            {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}
                        </label>
                    </fieldset>

                    <fieldset>
                        <legend>Perfil</legend>
                        <label>RUN (sin puntos ni guion)
                            <input name="run" type="text" minLength={7} maxLength={9} required placeholder="19011022K" value={formData.run} onChange={handleChange} />
                            {errors.run && <small className="error">{errors.run}</small>}
                        </label>
                        <label>Nombres
                            <input name="firstName" type="text" maxLength={50} required value={formData.firstName} onChange={handleChange} />
                            {errors.firstName && <small className="error">{errors.firstName}</small>}
                        </label>
                        <label>Apellidos
                            <input name="lastName" type="text" maxLength={100} required value={formData.lastName} onChange={handleChange} />
                            {errors.lastName && <small className="error">{errors.lastName}</small>}
                        </label>
                        <label>Fecha nacimiento
                            <input name="birthDate" type="date" required value={formData.birthDate} onChange={handleChange} />
                            {errors.birthDate && <small className="error">{errors.birthDate}</small>}
                        </label>
                        <label>Tipo de usuario
                            <select name="role" required value={formData.role} onChange={handleChange}>
                                <option value="Cliente">Cliente</option>
                                <option value="Vendedor">Vendedor</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                            {errors.role && <small className="error">{errors.role}</small>}
                        </label>
                        <label>Región
                            <select name="region" id="region-select" required value={formData.region} onChange={handleChange}>
                                <option value="">Selecciona…</option>
                                {regionNombres.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                            {errors.region && <small className="error">{errors.region}</small>}
                        </label>
                        <label>Comuna
                            <select name="comuna" id="comuna-select" required value={formData.comuna} onChange={handleChange} disabled={comunas.length === 0}>
                                <option value="">Selecciona…</option>
                                {comunas.map(comuna => (
                                    <option key={comuna} value={comuna}>{comuna}</option>
                                ))}
                            </select>
                            {errors.comuna && <small className="error">{errors.comuna}</small>}
                        </label>
                        <label>Dirección
                            <input name="address" type="text" maxLength={300} required value={formData.address} onChange={handleChange} />
                            {errors.address && <small className="error">{errors.address}</small>}
                        </label>
                    </fieldset>

                    <button className="btn" type="submit">Crear cuenta</button>
                </form>
            </div>
        </main>
    );
}

export default RegisterPage;