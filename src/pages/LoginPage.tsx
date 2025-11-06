
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import type { User } from '../Types'; 
const LoginPage = () => {

    const navigate = useNavigate();
    const { login } = useAuth(); 


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 

    // --- LÓGICA DEL FORMULARIO ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        setError(''); 

        const usuarios: User[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarioEncontrado = usuarios.find(u => u.email === email);


        if (usuarioEncontrado && usuarioEncontrado.password === password) {
            // SI el usuario existe Y la contraseña es correcta
            alert('Inicio de sesión exitoso ✅');
            login(usuarioEncontrado); 
            navigate('/'); 

        } else if (email === "admin@levelup.cl" && password === "admin123") {
            // Caso especial para el admin
            const adminUser: User = {
                firstName: "Admin", email: "admin@levelup.cl", role: "Administrador",
                run: '0-0', lastName: 'Admin', region: '', comuna: '', address: '', birthDate: null
            };
            login(adminUser);
            navigate('/admin'); 

        } else {
            setError('Correo o contraseña incorrectos');
        }
    }

    return (
        <main id="main-content">
            <header className="page-header">
                <h1>Ingreso</h1>
            </header>

            <div className="form-container">
                
                <form id="form-login" onSubmit={handleSubmit}>
                    <label>Correo
                        <input
                            name="email"
                            type="email"
                            maxLength={100}
                            required
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </label>
                    <label>Contraseña
                        <input
                            name="password"
                            type="password"
                            minLength={4}
                            maxLength={10}
                            required
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </label>

                    {/* Mostramos el error si existe */}
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    <button className="btn" type="submit">Entrar</button>
                </form>
            </div>
        </main>
    );
}

export default LoginPage;