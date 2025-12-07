import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import type { User } from '../Types.ts';

import { Form, Button } from 'react-bootstrap';


//FUNCIONES DE VALIDACIÓN 
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

    // LÓGICA DE ESTADO 
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // --- LÓGICA DE VALIDACIÓN
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        let ok = true;
        const newErrors: Partial<typeof formData> = {};

        if (!validarRUN(formData.run)) {
            newErrors.run = 'RUN inválido (sin puntos ni guion, ej: 19011022K)'; ok = false;
        }
        if (!formData.firstName.trim() || formData.firstName.length > 50 || !soloLetras(formData.firstName)) {
            newErrors.firstName = 'Nombre inválido (requerido, máx 50, solo letras)'; ok = false;
        }
        if (!formData.lastName.trim() || formData.lastName.length > 100 || !soloLetras(formData.lastName)) {
            newErrors.lastName = 'Apellido inválido (requerido, máx 100, solo letras)'; ok = false;
        }
        if (!emailValido(formData.email)) {
            newErrors.email = 'Correo inválido (solo @duoc.cl, @profesor\.duoc\.cl o @gmail\.com)'; ok = false;
        }
        if (formData.password.length < 4 || formData.password.length > 10) {
            newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres'; ok = false;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'; ok = false;
        }
        if (!formData.region) { newErrors.region = 'Selecciona región'; ok = false; }
        if (!formData.comuna) { newErrors.comuna = 'Selecciona comuna'; ok = false; }
        if (!formData.address.trim() || formData.address.length > 300) {
            newErrors.address = 'Dirección requerida (máx 300)'; ok = false;
        }
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

    return (
        <main id="main-content" className="gamer-bg-3">
            <header className="page-header">
                <h1>Registro</h1>
            </header>
            <div className="form-container">
                <Form id="form-register" onSubmit={handleSubmit} noValidate>

                    <fieldset>
                        <legend>Datos de acceso</legend>
                        <Form.Group className="mb-3" controlId="regEmail">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                required
                                placeholder="tucorreo@duoc.cl"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="regPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                minLength={4}
                                maxLength={10}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="regConfirmPassword">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </fieldset>

                    <fieldset>
                        <legend>Perfil</legend>

                        <Form.Group className="mb-3" controlId="regRun">
                            <Form.Label>RUN (sin puntos ni guion)</Form.Label>
                            <Form.Control
                                type="text"
                                name="run"
                                minLength={7}
                                maxLength={9}
                                required
                                placeholder="19011022K"
                                value={formData.run}
                                onChange={handleChange}
                                isInvalid={!!errors.run}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.run}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="regFirstName">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                maxLength={50}
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                isInvalid={!!errors.firstName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="regLastName">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                maxLength={100}
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                isInvalid={!!errors.lastName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.lastName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="regBirthDate">
                            <Form.Label>Fecha nacimiento</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                required
                                value={formData.birthDate}
                                onChange={handleChange}
                                isInvalid={!!errors.birthDate}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.birthDate}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="regRegion">
                            <Form.Label>Región</Form.Label>
                            <Form.Select
                                name="region"
                                id="region-select"
                                required
                                value={formData.region}
                                onChange={handleChange}
                                isInvalid={!!errors.region}
                            >
                                <option value="">Selecciona…</option>
                                {regionNombres.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.region}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="regComuna">
                            <Form.Label>Comuna</Form.Label>
                            <Form.Select
                                name="comuna"
                                id="comuna-select"
                                required
                                value={formData.comuna}
                                onChange={handleChange}
                                isInvalid={!!errors.comuna}
                                disabled={comunas.length === 0}
                            >
                                <option value="">Selecciona…</option>
                                {comunas.map(comuna => (
                                    <option key={comuna} value={comuna}>{comuna}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.comuna}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="regAddress">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                maxLength={300}
                                required
                                value={formData.address}
                                onChange={handleChange}
                                isInvalid={!!errors.address}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </fieldset>

                    <Button className="btn" type="submit">
                        Crear cuenta
                    </Button>
                </Form>
            </div>
        </main>
    );
}

export default RegisterPage;