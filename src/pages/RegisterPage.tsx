import React from 'react';

const RegisterPage = () => {
    return (
        <main id="main-content">
            <header className="page-header">
                <h1>Registro</h1>
            </header>

            <div className="form-container">
                {/* Asegúrate de que tu CSS apunte a este ID para la validación */}
                <form id="form-register">
                    <fieldset>
                        <legend>Datos de acceso</legend>
                        <label>Correo
                            <input name="email" type="email" maxLength={100} required placeholder="tucorreo@duoc.cl" />
                        </label>
                        <label>Contraseña
                            <input name="password" type="password" minLength={4} maxLength={10} required />
                            <small className="hint">Entre 4 y 10 caracteres</small>
                        </label>
                        {/* Campo clave que añadimos para la validación */}
                        <label>Confirmar Contraseña
                            <input name="confirmPassword" type="password" required />
                        </label>
                    </fieldset>

                    <fieldset>
                        <legend>Perfil</legend>
                        <label>RUN (sin puntos ni guion)
                            <input name="run" type="text" minLength={7} maxLength={9} required placeholder="19011022K" />
                        </label>
                        <label>Nombres
                            <input name="firstName" type="text" maxLength={50} required />
                        </label>
                        <label>Apellidos
                            <input name="lastName" type="text" maxLength={100} required />
                        </label>
                        <label>Fecha nacimiento
                            <input name="birthDate" type="date" required />
                        </label>
                        <label>Tipo de usuario
                            <select name="role" required>
                                <option value="">Selecciona…</option>
                                <option>Cliente</option>
                                <option>Vendedor</option>
                                <option>Administrador</option>
                            </select>
                        </label>
                        <label>Región
                            {/* Estos ID son para que tu 'validate.js' los llene */}
                            <select name="region" id="region-select" required></select>
                        </label>
                        <label>Comuna
                            <select name="comuna" id="comuna-select" required></select>
                        </label>
                        <label>Dirección
                            <input name="address" type="text" maxLength={300} required />
                        </label>
                    </fieldset>

                    <button className="btn" type="submit">Crear cuenta</button>
                </form>
            </div>
        </main>
    );
}

export default RegisterPage;