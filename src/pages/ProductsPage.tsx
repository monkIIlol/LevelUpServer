// En src/pages/ProductsPage.tsx
import React, { useState } from 'react';
import { products, categories } from '../data/products'; // 1. Importamos los datos
import ProductCard from '../components/ProductCard'; // 2. Importamos el "Lego"
import type { Product } from '../Types';

const ProductsPage = () => {


    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleFilterApply = () => {

        let tempProducts = products;
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

                <aside aria-label="Filtros">
                    <h3>Filtros</h3>
                    <label>Categoría
                        <select
                            id="filter-category"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)} // Actualiza el estado
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
                            onChange={e => setSearchQuery(e.target.value)} // Actualiza el estado
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

                
                <section className="products" id="products-grid" aria-live="polite">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.code} product={product} />
                    ))}
                </section>

            </div>
        </main>
    );
}

export default ProductsPage;