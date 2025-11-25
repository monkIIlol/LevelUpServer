
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import type { Product } from '../../Types';


const money = (clp: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(clp);
}

const AdminProductsPage = () => {
    const navigate = useNavigate();


    const [products, setProducts] = useState<Product[]>([]);


    const loadProducts = () => {
        const productsData = JSON.parse(localStorage.getItem('productos') || '[]');
        setProducts(productsData);
    }


    useEffect(() => {
        loadProducts();
    }, []); 

    //Lógica para los botones de Acción 

    const handleEdit = (index: number) => {

        localStorage.setItem('editProductIndex', index.toString());

        navigate('/admin/product-new');
    }

    const handleDelete = (index: number) => {
        if (confirm('¿Seguro que quieres eliminar este producto?')) {

            let currentProducts = [...products];
            currentProducts.splice(index, 1);
            localStorage.setItem('productos', JSON.stringify(currentProducts));
            loadProducts();
        }
    }

    return (
        <div>
            <h1>Productos</h1>
            <table className="admin-table"> 
                <thead>
                    <tr>
                        <th>Código</th>
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
                            <tr key={product.code}>
                                <td>{product.code}</td>
                                <td>{product.name}</td>
                                <td>{money(product.price)}</td>
                                <td>{product.stock || 0}</td>
                                <td>{product.category}</td>
                                <td className="actions-cell">
                                    <button className="btn-edit" onClick={() => handleEdit(index)}>
                                        Editar
                                    </button>
                                    <button className="btn-del" onClick={() => handleDelete(index)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>No hay productos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminProductsPage;