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


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const loginData: any = {
            email: email,
            password: password
        };

        // 1. Intentamos loguear con el Backend
        const exito = await login(loginData);

        if (exito) {
            // 2. RECUPERAMOS EL ROL:
            // Como el AuthContext ya guardó al usuario en localStorage, lo leemos de ahí
            const usuarioGuardado = JSON.parse(localStorage.getItem('currentUser') || '{}');

            // 3. REDIRECCIÓN INTELIGENTE
            if (usuarioGuardado.role === 'Administrador') {
                navigate('/admin'); // Si es jefe, al panel
            } else {
                navigate('/');      // Si es cliente, a la tienda
            }
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