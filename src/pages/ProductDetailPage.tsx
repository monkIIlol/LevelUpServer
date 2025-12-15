import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProductService } from '../services/ProductService';
import type { Product } from '../Types';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductDetailPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext)!; 
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar producto real
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (code) {
        const found = await ProductService.obtener(code);
        setProduct(found || null);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [code]);

  if (loading) return <div style={{padding:'4rem', textAlign:'center', color:'white'}}>Cargando...</div>;
  
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'white' }}>
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/products')} className="btn" style={{marginTop:'1rem', background:'#39FF14', color:'black'}}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const handleAdd = () => {
    if (stock > 0) {
      addToCart(product);
      showToast("Producto agregado al carrito 🛒", "success");
    } else {
      showToast("Sin stock disponible", "error");
    }
  };

  // Calculamos "cuotas simuladas"
  const cuota = Math.round(product.price / 6);

  return (
    <main id="main-content">
      
      {/* 1. Miga de Pan (Navegación) */}
      <div style={{ padding: '20px 20px 0', maxWidth: '1200px', margin: '0 auto', color: '#888', fontSize: '0.9rem' }}>
        <Link to="/" style={{color:'#888', textDecoration:'none'}}>Inicio</Link> {' > '} 
        <Link to="/products" style={{color:'#888', textDecoration:'none'}}>Productos</Link> {' > '}
        <span style={{color:'#fff'}}>{product.name}</span>
      </div>

      {/* 2. LAYOUT PRINCIPAL DIVIDIDO */}
      <div className="product-detail-layout">
        
        {/* COLUMNA IZQUIERDA: IMAGEN */}
        <div className="detail-image-container">
          <img src={`/${product.img}`} alt={product.name} />
        </div>

        {/* COLUMNA DERECHA: BUY BOX (Información de Compra) */}
        <div className="detail-info-box">
          <span style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.category} | Nuevo
          </span>
          
          <h1 style={{ fontSize: '1.8rem', marginTop: '10px', lineHeight: '1.2' }}>{product.name}</h1>
          
          {/* Precio y Cuotas */}
          <div style={{ margin: '20px 0', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
            <div className="detail-price">
              ${new Intl.NumberFormat('es-CL').format(product.price)}
            </div>
            <div style={{ color: '#39FF14', fontSize: '1rem' }}>
              en 6x ${new Intl.NumberFormat('es-CL').format(cuota)} sin interés
            </div>
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#ccc' }}>
              <span>💳 Visa / MasterCard</span>
              <span>🚚 Envío a todo Chile</span>
            </div>
          </div>

          {/* Estado del Stock */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Disponibilidad:</p>
            {isOutOfStock ? (
               <div style={{ background: '#ff444433', color: '#ff4444', padding: '10px', borderRadius: '6px', border: '1px solid #ff4444' }}>
                  🚫 Producto Agotado
               </div>
            ) : (
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{isLowStock ? '🔥' : '✅'}</span>
                  <span>
                    {isLowStock 
                      ? `¡Corre! Quedan solo ${stock} unidades.` 
                      : `Stock disponible (${stock} unidades)`}
                  </span>
               </div>
            )}
          </div>

          {/* Botón de Acción */}
          <button 
            className="btn"
            onClick={handleAdd}
            disabled={isOutOfStock}
            style={{ 
              width: '100%', 
              padding: '15px', 
              fontSize: '1.1rem',
              background: isOutOfStock ? '#555' : '#39FF14',
              color: isOutOfStock ? '#aaa' : 'black',
              fontWeight: 'bold',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
          </button>

          {/* Sellos de Confianza (Estáticos) */}
          <div style={{ marginTop: '20px', fontSize: '0.85rem', color: '#888', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>🛡️ <strong>Compra Protegida</strong>, recibe el producto que esperabas o te devolvemos tu dinero.</div>
            <div>🏆 <strong>Garantía LevelUp</strong> de 6 meses de fábrica.</div>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN DE DETALLES Y FICHA TÉCNICA */}
      <div className="detail-features">
        <h2 style={{ borderBottom: '2px solid #39FF14', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px' }}>
          Descripción del Producto
        </h2>
        <p style={{ lineHeight: '1.6', color: '#ccc', fontSize: '1.05rem', marginBottom: '40px' }}>
          {product.desc}
        </p>

        {/* Tabla de Especificaciones (Si existen detalles) */}
        {product.details && product.details.length > 0 && (
          <div style={{ marginBottom: '60px' }}>
             <h3 style={{ color: '#fff', marginBottom: '15px' }}>Ficha Técnica</h3>
             <table className="specs-table">
               <tbody>
                 {product.details.map((detail, index) => {
                   // Intentamos separar "Clave: Valor" si el string tiene ":"
                   const parts = detail.includes(':') ? detail.split(':') : ['Característica', detail];
                   return (
                     <tr key={index}>
                       <td>{parts[0]}</td>
                       <td>{parts[1] || ''}</td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;