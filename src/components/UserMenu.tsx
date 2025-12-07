import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
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

    const closeMenu = () => setIsOpen(false);

    return (
        <div className="user-menu" style={{ position: 'relative' }}>
            <button
                className="user-menu-trigger"
                onClick={() => setIsOpen(!isOpen)}
                
            >
                {userIconSVG}
                {userName} &#9662;
            </button>

            {isOpen && (
                <div id="user-dropdown" className="dropdown-content show" style={{ display: 'flex', flexDirection: 'column' }}>
                    
                    {/* --- BOTÓN EXCLUSIVO ADMIN --- */}
                    {currentUser.role === 'Administrador' && (
                        <Link 
                            to="/admin" 
                            onClick={closeMenu}
                            style={{ 
                                padding: '12px 16px',
                                borderBottom: '1px solid #333', 
                                color: '#39FF14', 
                                fontWeight: 'bold',
                                textDecoration: 'none'
                            }}
                        >
                             Panel Admin
                        </Link>
                    )}

                    {/* Links Comunes */}
                    <Link 
                        to="/perfil" 
                        onClick={closeMenu}
                        style={{ padding: '12px 16px', borderBottom: '1px solid #333', textDecoration: 'none', color: '#fff' }}
                    >
                        Mi Perfil
                    </Link>

                    <a 
                        href="#" 
                        id="logout-button" 
                        onClick={(e) => { e.preventDefault(); logout(); closeMenu(); }}
                        style={{ padding: '12px 16px', color: '#ff6b6b', textDecoration: 'none' }}
                    >
                        Cerrar Sesión
                    </a>
                </div>
            )}
        </div>
    );
}

export default UserMenu;