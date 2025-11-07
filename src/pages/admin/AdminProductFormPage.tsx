
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../Types';
import { categories } from '../../data/products'; // Importamos categorías

const validateForm = (product: Partial<Product>): { ok: boolean, errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    let ok = true;

    if (!product.code || product.code.trim().length < 3) {
        errors.code = 'Código requerido (min 3)'; ok = false;
    }
    if (!product.name || product.name.trim().length === 0 || product.name.length > 100) {
        errors.name = 'Nombre requerido (máx 100)'; ok = false;
    }
    const p = Number(product.price);
    if (isNaN(p) || p < 0) {
        errors.price = 'Precio debe ser ≥ 0'; ok = false;
    }
    const st = Number(product.stock);
    if (!(Number.isInteger(st) && st >= 0)) {
        errors.stock = 'Stock debe ser entero ≥ 0'; ok = false;
    }
    if (!product.category) {
        errors.category = 'Selecciona categoría'; ok = false;
    }

    return { ok, errors };
}

const AdminProductFormPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Partial<Product>>({
        code: '', name: '', desc: '', price: 0, stock: 0, category: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        const indexStr = localStorage.getItem('editProductIndex');
        if (indexStr !== null) {
            const index = parseInt(indexStr, 10);
            const products: Product[] = JSON.parse(localStorage.getItem('productos') || '[]');
            const productToEdit = products[index];

            if (productToEdit) {
                setFormData(productToEdit);
                setIsEditing(true);
                setEditIndex(index);
            }
        }
        return () => {
            localStorage.removeItem('editProductIndex');
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const { ok, errors } = validateForm(formData);
        if (!ok) {
            setErrors(errors);
            return;
        }

        const productos: Product[] = JSON.parse(localStorage.getItem('productos') || '[]');


        const finalProduct: Product = {
            code: formData.code!,
            name: formData.name!,
            desc: formData.desc || '', 
            price: Number(formData.price),
            stock: Number(formData.stock),
            category: formData.category!,
            img: formData.img || 'img/ejemplo.png',
            details: formData.details || [],
        };

        if (isEditing && editIndex !== null) {
            productos[editIndex] = finalProduct;
            alert('Producto actualizado ✅');
        } else {
            productos.push(finalProduct);
            alert('Producto agregado ✅');
        }

        localStorage.setItem('productos', JSON.stringify(productos));
        navigate('/admin/products');
    };

    return (
        <div>
            <h1>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>

            <form id="form-product" noValidate onSubmit={handleSubmit}>
                <label>Código
                    <input name="code" required minLength={3} value={formData.code} onChange={handleChange} />
                    {errors.code && <small className="error">{errors.code}</small>}
                </label>
                <label>Nombre
                    <input name="name" required maxLength={100} value={formData.name} onChange={handleChange} />
                    {errors.name && <small className="error">{errors.name}</small>}
                </label>

                <label>Descripción
                    <textarea
                        name="desc" 
                        maxLength={500}
                        value={formData.desc} 
                        onChange={handleChange}>
                    </textarea>
                </label>

                <label>Precio
                    <input name="price" type="number" step="0.01" min="0" required value={formData.price} onChange={handleChange} />
                    {errors.price && <small className="error">{errors.price}</small>}
                </label>
                <label>Stock
                    <input name="stock" type="number" min="0" step="1" required value={formData.stock} onChange={handleChange} />
                    {errors.stock && <small className="error">{errors.stock}</small>}
                </label>
                <label>Categoría
                    <select name="category" required id="admin-category" value={formData.category} onChange={handleChange}>
                        <option value="">Selecciona...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category && <small className="error">{errors.category}</small>}
                </label>

                <button className="btn" type="submit">
                    {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
            </form>
        </div>
    );
}

export default AdminProductFormPage;