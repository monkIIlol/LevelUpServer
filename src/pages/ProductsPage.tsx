import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductService } from '../services/ProductService';
import type { Product } from '../Types';
import { useToast } from '../context/ToastContext';


const CATEGORY_NAMES: Record<string, string> = {
    'CO': 'Consolas',
    'JM': 'Juegos de Mesa',
    'AC': 'Accesorios',
    'CG': 'Computadores',
    'SG': 'Sillas Gamer',
    'MS': 'Mouses',
    'MP': 'Mousepads',
    'PP': 'Merchandising'
};

const ProductsPage = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados
  const [activeCategory, setActiveCategory] = useState("TODOS");
  const [sortOrder, setSortOrder] = useState("default");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await ProductService.listar();
        setProducts(data);


        const uniqueCats = Array.from(new Set(data.map(p => p.category)));
        setAvailableCategories(uniqueCats);
        
      } catch (error) {
        showToast("Error conectando al servidor", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtrar y Ordenar
  const filteredProducts = products
    .filter(p => activeCategory === "TODOS" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

  return (
    <div style={{ background: '#121212', minHeight: '100vh', color: '#fff' }}>
      
      {/* 1. HERO BANNER (Cabecera impactante) */}
      <div className="cyber-banner">
        <h1>Level Up <span style={{ color: '#fff', fontSize:'1rem', verticalAlign:'middle', border:'1px solid #fff', padding:'2px 6px' }}>STORE</span></h1>
        <p style={{ color: '#ddd', fontSize: '1.2rem', marginTop: '10px', background:'rgba(0,0,0,0.6)', padding:'5px 15px', borderRadius:'20px' }}>
          El arsenal definitivo para tu setup
        </p>
      </div>

      <div className="cyber-container">
        
        {/* 2. SIDEBAR DE CRISTAL (Izquierda) */}
        <aside className="cyber-sidebar">
          <h3 className="cyber-filter-title">Categorías</h3>
          
          <button 
            className={`cyber-filter-btn ${activeCategory === "TODOS" ? 'active' : ''}`}
            onClick={() => setActiveCategory("TODOS")}
          >
            🚀 Todo el Catálogo
          </button>

          {availableCategories.map(code => (
            <button 
              key={code}
              className={`cyber-filter-btn ${activeCategory === code ? 'active' : ''}`}
              onClick={() => setActiveCategory(code)}
            >
              {CATEGORY_NAMES[code] || code}
            </button>
          ))}
        </aside>

        {/* 3. GRILLA DE PRODUCTOS (Derecha) */}
        <main>
          <div className="cyber-header">
            <span className="cyber-count">
              Detectados: <span style={{ color: '#39FF14' }}>{filteredProducts.length}</span> items
            </span>
            
            <select 
              className="cyber-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="default">Relevancia</option>
              <option value="low-high">Precio: Menor a Mayor</option>
              <option value="high-low">Precio: Mayor a Menor</option>
            </select>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px', fontSize: '1.5rem', color: '#39FF14' }}>
              Cargando Sistema...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="cyber-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.code} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ 
                textAlign: 'center', padding: '60px', 
                background: 'rgba(255,255,255,0.05)', borderRadius: '12px' 
            }}>
              <h3>No se encontraron productos en esta sección.</h3>
              <button 
                onClick={() => setActiveCategory("TODOS")}
                className="btn" 
                style={{ marginTop: '20px', background: '#39FF14', color: '#000', fontWeight: 'bold' }}
              >
                Volver al Catálogo Completo
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default ProductsPage;