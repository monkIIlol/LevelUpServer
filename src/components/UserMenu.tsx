
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
    const { currentUser, logout } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    if (!currentUser) {
        return null;
    }


    const userName = currentUser.firstName || currentUser.email.split('@')[0];

    const userIconSVG = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="user-profile-icon">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
    );

    return (
        <div className="user-menu">
            <button
                className="user-menu-trigger"
                onClick={() => setIsOpen(!isOpen)} 
            >
                {userIconSVG}
                {userName} &#9662;
            </button>

            {isOpen && (
                <div id="user-dropdown" className="dropdown-content show">
                    <a href="/perfil" style={{ borderBottom: '1px solid #333' }}>Mi Perfil</a>

                    <a href="#" id="logout-button" onClick={logout}>
                        Cerrar Sesión
                    </a>
                </div>
            )}
        </div>
    );
}

export default UserMenu;