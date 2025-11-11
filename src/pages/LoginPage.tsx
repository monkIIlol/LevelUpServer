import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import type { User } from '../Types';
import { Form, Button, Alert } from 'react-bootstrap';


const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const usuarios: User[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuarioEncontrado = usuarios.find(u => u.email === email);

        if (usuarioEncontrado && usuarioEncontrado.password === password) {
            alert('Inicio de sesión exitoso ✅');
            login(usuarioEncontrado);
            navigate('/');
        } else if (email === "admin@levelup.cl" && password === "admin123") {
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
                <Form id="form-login" onSubmit={handleSubmit} noValidate>
                    
                    <Form.Group className="mb-3" controlId="loginEmail">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            maxLength={100}
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="loginPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            minLength={4}
                            maxLength={10}
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                    <Button type="submit" className="btn">
                        Entrar
                    </Button>

                    <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ccc' }}>
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" style={{ color: '#00e676', fontWeight: 'bold', textDecoration: 'none' }}>
                            Regístrate
                        </Link>
                    </p>

                </Form>
            </div>
        </main>
    );
}

export default LoginPage;