
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Footer from './Footer';

describe('Componente: Footer', () => {

    //Prueba 1
    it('Debería mostrar el texto de copyright "© Level-Up Gamer 2025"', () => {
        render(<Footer />);
        const copyrightText = screen.getByText(/© Level-Up Gamer 2025/i);

        expect(copyrightText).toBeInTheDocument();
    });
    //Prueba 2
    it('Debería mostrar el título de la sección "Navegación"', () => {
        render(<Footer />);
        const navTitle = screen.getByRole('heading', { name: /Navegación/i });

        expect(navTitle).toBeInTheDocument();
    });

});