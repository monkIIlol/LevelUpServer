import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutErrorPage: React.FC = () => {
    return (
        <main id="main-content">
            <div className="checkout-result-page error">
                <span className="icon">❌</span>
                <h1>No se pudo realizar el pago</h1>
                <p>
                    Hubo un error al procesar tu pago. Por favor, inténtalo de nuevo.
                    Si el problema persiste, contacta a soporte.
                </p>
                
                <Link to="/carrito" className="btn-primary">
                    Volver al Carrito
                </Link>
            </div>
        </main>
    );
}

export default CheckoutErrorPage;