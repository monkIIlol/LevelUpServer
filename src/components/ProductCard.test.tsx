// En src/components/ProductCard.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { describe, it, expect, vi } from 'vitest'; 
import { BrowserRouter } from 'react-router-dom';
import type { Product } from '../Types';
import { CartContext } from '../context/CartContext'; 

import ProductCard from './ProductCard';

const mockProduct: Product = {
    code: 'JM001',
    category: 'JM',
    name: 'Catan',
    price: 29990,
    img: 'img/catan.png',
    desc: 'Juego de estrategia',
    details: ['Jugadores: 3-4'],
    stock: 10 
};

describe('Componente: ProductCard', () => {

    const mockAddToCart = vi.fn();

    const renderProductCard = () => {
        render(
            <BrowserRouter>
                <CartContext.Provider value={{
                    cartItems: [],
                    totalPrice: 0,
                    addToCart: mockAddToCart, 
                    increaseQty: vi.fn(),
                    decreaseQty: vi.fn(),
                    removeFromCart: vi.fn(),
                    clearCart: vi.fn()
                }}>
                    <ProductCard product={mockProduct} />
                </CartContext.Provider>
            </BrowserRouter>
        );
    };

    //PRUEBA 1: Que se muestre la info 
    it('Debería renderizar la información del producto (nombre, desc, precio)', () => {
        renderProductCard();

        expect(screen.getByText('Catan')).toBeInTheDocument();
        expect(screen.getByText('Juego de estrategia')).toBeInTheDocument();
        expect(screen.getByText('$29.990')).toBeInTheDocument();
        expect(screen.getByAltText('Catan')).toBeInTheDocument();
    });

    //PRUEBA 2: Que el botón "Añadir" funcione
    it('Debería llamar a la función addToCart con el código correcto al hacer clic', async () => {
        renderProductCard();
        const addButton = screen.getByRole('button', { name: /Añadir/i });
        await userEvent.click(addButton);

        expect(mockAddToCart).toHaveBeenCalledTimes(1); 
        expect(mockAddToCart).toHaveBeenCalledWith('JM001'); 
    });

    //PRUEBA 3: Que el enlace (Link) funcione 
    it('Debería ser un enlace (Link) a la página de detalle correcta', () => {
        renderProductCard();
        const link = screen.getByText('Catan').closest('a');

        expect(link).toHaveAttribute('href', '/product/JM001');
    });

});