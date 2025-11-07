
import React, { useState, useEffect } from 'react';
import { categories } from '../data/products'; 
import ProductCard from '../components/ProductCard';
import type { Product } from '../Types';

const ProductsPage = () => {

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const productsData: Product[] = JSON.parse(localStorage.getItem('productos') || '[]');
        setAllProducts(productsData); 
        setFilteredProducts(productsData); 
    }, []);

    
    const handleFilterApply = () => {
        let tempProducts = allProducts;

        if (selectedCategory) {
            tempProducts = tempProducts.filter(p => p.category === selectedCategory);
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            tempProducts = tempProducts.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.desc.toLowerCase().includes(lowerQuery)
            );
        }

        setFilteredProducts(tempProducts);
    };

    return (
        <main id="main-content">
            <header className="page-header">
                <h1>Productos</h1>
            </header>

            <div className="products-layout">

                {/* -- Barra lateral de Filtros -- */}
                <aside aria-label="Filtros">
                    <h3>Filtros</h3>
                    <label>Categoría
                        <select
                            id="filter-category"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>Buscar
                        <input
                            id="filter-q"
                            type="search"
                            placeholder="ej. 'mouse'"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </label>
                    <button
                        className="btn"
                        id="apply-filters"
                        onClick={handleFilterApply}
                    >
                        Aplicar
                    </button>
                </aside>

                {/* -- Sección de la Grilla de Productos -- */}
                <section className="products" id="products-grid" aria-live="polite">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard key={product.code} product={product} />
                        ))
                    ) : (
                        <p>No se encontraron productos con esos filtros.</p>
                    )}
                </section>

            </div>
        </main>
    );
}

export default ProductsPage;