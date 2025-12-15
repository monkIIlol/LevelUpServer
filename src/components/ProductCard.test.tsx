import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from './ProductCard';
import { CartContext } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import { BrowserRouter } from 'react-router-dom';

const mockProduct = {
    code: 'TEST01',
    name: 'Producto Test',
    price: 10000,
    stock: 5,
    category: 'MS',
    img: 'test.jpg',
    description: 'Descripción de prueba',
    details: []
};

const addToCartMock = vi.fn();

const renderWithProviders = (component: any) => {
    return render(
        <ToastProvider>
            <CartContext.Provider value={{ 
                cartItems: [], 
                addToCart: addToCartMock, 
                removeFromCart: vi.fn(), 
                clearCart: vi.fn(), 
                totalPrice: 0,
                increaseQty: vi.fn(),
                decreaseQty: vi.fn()
            }}>
                <BrowserRouter>
                    {component}
                </BrowserRouter>
            </CartContext.Provider>
        </ToastProvider>
    );
};

describe('ProductCard Component', () => {
    it('Debería renderizar la información del producto', () => {
        renderWithProviders(<ProductCard product={mockProduct} />);
        expect(screen.getByText('Producto Test')).toBeDefined();
        expect(screen.getByText(/\$10.000/)).toBeDefined();
    });

    it('Debería llamar a addToCart al hacer clic en el botón', () => {
        renderWithProviders(<ProductCard product={mockProduct} />);
        const button = screen.getByRole('button', { name: /Añadir al Carrito/i });
        fireEvent.click(button);
        expect(addToCartMock).toHaveBeenCalled();
    });

    it('Debería tener el enlace correcto al detalle', () => {
        renderWithProviders(<ProductCard product={mockProduct} />);
        const link = screen.getByRole('link');
        expect(link.getAttribute('href')).toBe('/product/TEST01');
    });
});