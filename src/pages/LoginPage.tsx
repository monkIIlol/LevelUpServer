import React from 'react';

const LoginPage = () => {
    return (
        <main id="main-content">
            <header className="page-header">
                <h1>Ingreso</h1>
            </header>

            <div className="form-container">
                <form id="form-login">
                    <label>Correo
                        <input name="email" type="email" maxLength={100} required />
                    </label>
                    <label>Contraseña
                        <input name="password" type="password" minLength={4} maxLength={10} required />
                    </label>
                    <button className="btn" type="submit">Entrar</button>
                </form>
            </div>
        </main>
    );
}

export default LoginPage;