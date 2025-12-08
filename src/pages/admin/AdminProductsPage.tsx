import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../Types';
import { ProductService } from '../../services/ProductService';
import { useToast } from '../../context/ToastContext';

const AdminProductsPage = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState(''); // Buscador

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await ProductService.listar();
            setProducts(data);
        } catch (error) {
            showToast("Error al cargar productos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProducts(); }, []);

    const handleEdit = (product: Product) => {
        localStorage.setItem('editProductCode', product.code);
        navigate('/admin/product-new');
    };

    const handleDelete = async (code: string, name: string) => {
        if (!confirm(`¿Eliminar ${name}?`)) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        const exito = await ProductService.eliminar(code, token);
        if (exito) {
            showToast("Producto eliminado", "success");
            loadProducts();
        } else {
            showToast("Error al eliminar", "error");
        }
    };

    // FILTRO
    const productosFiltrados = products.filter(p => 
        p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.code.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.category.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h1 style={{ color: '#39FF14' }}>Inventario de Productos</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                <button 
                    className="btn" 
                    onClick={() => navigate('/admin/product-new')}
                    style={{ background: '#39FF14', color: 'black', whiteSpace: 'nowrap' }}
                >
                    + Nuevo Producto
                </button>
                 <input 
                    type="text" 
                    placeholder="🔍 Buscar por nombre, código o categoría..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ 
                        width: '100%', padding: '10px', borderRadius: '5px', 
                        border: '1px solid #444', background: '#222', color: 'white' 
                    }}
                />
            </div>

            {loading ? <p>Cargando...</p> : (
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#222' }}>
                            <th style={{ padding: '10px' }}>Código</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map((p) => (
                            <tr key={p.code} style={{ borderBottom: '1px solid #444' }}>
                                <td style={{ padding: '10px' }}>{p.code}</td>
                                <td><img src={`/${p.img}`} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} /></td>
                                <td>{p.name}</td>
                                <td>${p.price.toLocaleString()}</td>
                                <td style={{ color: (p.stock ?? 0) < 5 ? '#ff4444' : 'white', fontWeight: (p.stock ?? 0) < 5 ? 'bold' : 'normal' }}>
                                    {p.stock} {p.stock === 0 && '(AGOTADO)'}
                                </td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => handleEdit(p)} style={{ marginRight: '10px', background: '#007bff', color: 'white', border:'none', padding:'5px' }}>Editar</button>
                                    <button className="btn-del" onClick={() => handleDelete(p.code, p.name)} style={{ background: '#dc3545', color: 'white', border:'none', padding:'5px' }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminProductsPage;