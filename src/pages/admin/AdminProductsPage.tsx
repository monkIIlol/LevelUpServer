import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import type { Product } from '../../Types';
import { ProductService } from '../../services/ProductService'; 

const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const AdminProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);

    // Cargar productos reales
    const loadProducts = async () => {
        const data = await ProductService.listar();
        setProducts(data);
    }

    useEffect(() => {
        loadProducts();
    }, []); 

    const handleEdit = (code: string) => { 
        localStorage.setItem('editProductCode', code); 
        navigate('/admin/product-new');
    }

    // ELIMINAR REAL
    const handleDelete = async (code: string) => {
        if (confirm('¿Seguro que quieres eliminar este producto de la Base de Datos?')) {
            const token = localStorage.getItem('token');
            if (!token) return alert("No estás autorizado");

            const exito = await ProductService.eliminar(code, token);
            
            if (exito) {
                alert("Producto eliminado correctamente");
                loadProducts(); 
            } else {
                alert("Error al eliminar. Puede que tenga ventas asociadas.");
            }
        }
    }

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            <h1 style={{ color: '#39FF14' }}>Gestión de Productos</h1>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}> 
                <thead>
                    <tr style={{ background: '#222', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Código</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={product.code} style={{ borderBottom: '1px solid #444' }}>
                                <td style={{ padding: '10px' }}>{product.code}</td>
                                <td>{product.name}</td>
                                <td>{money(product.price)}</td>
                                <td>{product.stock || 0}</td>
                                <td>{product.category}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => handleEdit(product.code)} style={{ marginRight: '10px' }}>
                                        Editar
                                    </button>
                                    <button className="btn-del" onClick={() => handleDelete(product.code)} style={{ background: '#d33', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay productos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminProductsPage;