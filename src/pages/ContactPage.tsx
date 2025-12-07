import React, { useState } from 'react';
import { ContactService } from '../services/ContactService';

// Validación email 
const emailValido = (email: string): boolean => {
    if (!email.trim() || email.length > 100) return false;
    return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email.trim());
}

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', comment: '' });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);
        
        let ok = true;
        const newErrors: Partial<typeof formData> = {};

        // 1. Validar Nombre (Requerido y Máximo 100)
        if (!formData.name.trim() || formData.name.length > 100) {
            newErrors.name = 'Nombre requerido (máx 100)'; ok = false;
        }
        // 2. Validar Email (Formato y Máximo 100)
        if (!emailValido(formData.email)) {
            newErrors.email = 'Correo inválido (solo @duoc.cl, @profesor.duoc.cl o @gmail.com)'; ok = false;
        }
        // 3. Validar Comentario (Requerido y Máximo 500)
        if (!formData.comment.trim() || formData.comment.length > 500) {
            newErrors.comment = 'Comentario requerido (máx 500)'; ok = false;
        }

        if (!ok) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        const enviado = await ContactService.enviar(formData);
        setIsSubmitting(false);

        if (enviado) {
            alert('Mensaje enviado');
            setSuccess(true);
            setFormData({ name: '', email: '', comment: '' });
        } else {
            alert('Hubo un error al enviar el mensaje ❌');
        }
    };

    return (
        <main id="main-content" className="gamer-bg-1">
            <header className="page-header">
                <h1>Contacto</h1>
            </header>
            <div className="form-container">
                <form id="form-contact" onSubmit={handleSubmit} noValidate>
                    <label>Nombre
                        <input 
                            name="name" 
                            type="text" 
                            maxLength={100} 
                            required 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                        {errors.name && <small className="error">{errors.name}</small>}
                    </label>
                    <label>Correo
                        <input 
                            name="email" 
                            type="email" 
                            maxLength={100} 
                            required 
                            placeholder="tucorreo@duoc.cl"
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                        {errors.email && <small className="error">{errors.email}</small>}
                    </label>
                    <label>Comentario
                        <textarea 
                            name="comment" 
                            maxLength={500} 
                            required 
                            value={formData.comment} 
                            onChange={handleChange}
                        ></textarea>
                        {errors.comment && <small className="error">{errors.comment}</small>}
                    </label>
                    
                    <button className="btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>

                    {success && <p style={{ color: '#39FF14', textAlign: 'center', marginTop: '1rem' }}>¡Gracias! Te contactaremos pronto.</p>}
                </form>
            </div>
        </main>
    );
}

export default ContactPage;