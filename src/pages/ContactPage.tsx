import React, { useState } from 'react';
import type { ContactoMensaje } from '../Types'; 

//Validacion email
const emailValido = (email: string): boolean => {
    if (!email.trim() || email.length > 100) return false;
    return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email.trim());
}

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', comment: '' });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);
        let ok = true;
        const newErrors: Partial<typeof formData> = {};

        // 1. Validar Nombre
        if (!formData.name.trim() || formData.name.length > 100) {
            newErrors.name = 'Nombre requerido (máx 100)'; ok = false;
        }
        // 2. Validar Email
        if (!emailValido(formData.email)) {
            newErrors.email = 'Correo inválido (solo @duoc.cl, @profesor.duoc.cl o @gmail.com)'; ok = false;
        }
        // 3. Validar Comentario
        if (!formData.comment.trim() || formData.comment.length > 500) {
            newErrors.comment = 'Comentario requerido (máx 500)'; ok = false;
        }

        if (!ok) {
            setErrors(newErrors);
            return;
        }

        const nuevoMensaje: ContactoMensaje = {
            id: new Date().toISOString(),
            name: formData.name,
            email: formData.email,
            comment: formData.comment,
            timestamp: new Date().toLocaleString('es-CL')
        };

        const mensajesGuardados: ContactoMensaje[] = JSON.parse(
            localStorage.getItem('mensajesContacto') || '[]'
        );

        const mensajesActualizados = [nuevoMensaje, ...mensajesGuardados];
        localStorage.setItem('mensajesContacto', JSON.stringify(mensajesActualizados));



        // Si todo está ok 
        alert('Mensaje enviado ✅');
        setSuccess(true);
        setFormData({ name: '', email: '', comment: '' });
    };

    return (
        <main id="main-content">
            <header className="page-header">
                <h1>Contacto</h1>
            </header>

            <div className="form-container">
                <form id="form-contact" onSubmit={handleSubmit} noValidate>
                    <label>Nombre
                        <input name="name" type="text" maxLength={100} required value={formData.name} onChange={handleChange} />
                        {errors.name && <small className="error">{errors.name}</small>}
                    </label>
                    <label>Correo
                        <input name="email" type="email" maxLength={100} required placeholder="tucorreo@gmail.com" value={formData.email} onChange={handleChange} />
                        {errors.email && <small className="error">{errors.email}</small>}
                    </label>
                    <label>Comentario
                        <textarea name="comment" maxLength={500} required value={formData.comment} onChange={handleChange}></textarea>
                        {errors.comment && <small className="error">{errors.comment}</small>}
                    </label>
                    <button className="btn" type="submit">Enviar</button>

                    {success && <p style={{ color: 'var(--accent-2)', textAlign: 'center' }}>¡Mensaje enviado con éxito!</p>}
                </form>
            </div>
        </main>
    );
}

export default ContactPage;