import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../Types';
import { categories } from '../../data/products'; 

// Validaciones simples
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
    if (!product.img || product.img.trim() === '') {
        errors.img = 'Ruta de la imagen requerida'; ok = false;
    }

    return { ok, errors };
}

const AdminProductFormPage = () => {
    const navigate = useNavigate();
    
    // Estado del formulario base
    const [formData, setFormData] = useState<Partial<Product>>({
        code: '', name: '', desc: '', price: 0, stock: 0, category: '', img: ''
    });
    
    // NUEVO: Estado separado para el texto de los detalles
    const [detailsText, setDetailsText] = useState(''); 

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    // Cargar datos si es edición
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
                
                // NUEVO: Convertir el array de detalles a texto (uno por línea) para editar
                if (productToEdit.details && Array.isArray(productToEdit.details)) {
                    setDetailsText(productToEdit.details.join('\n'));
                }
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

        // NUEVO: Convertir el texto de detalles a Array
        // Separamos por salto de línea (\n) y filtramos líneas vacías
        const detailsArray = detailsText.split('\n').filter(line => line.trim() !== '');

        const finalProduct: Product = {
            code: formData.code!,
            name: formData.name!,
            desc: formData.desc || '',
            price: Number(formData.price),
            stock: Number(formData.stock),
            category: formData.category!,
            img: formData.img!,
            details: detailsArray // Guardamos el array procesado
        };

        if (isEditing && editIndex !== null) {
            productos[editIndex] = finalProduct;
            alert('Producto actualizado ✅');
        } else {
            // Validar que no exista el código si es nuevo
            if (productos.some(p => p.code === finalProduct.code)) {
                setErrors({ code: 'El código ya existe' });
                return;
            }
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
                <label>Código (SKU)
                    <input name="code" required minLength={3} value={formData.code} onChange={handleChange} disabled={isEditing} />
                    {errors.code && <small className="error">{errors.code}</small>}
                </label>
                
                <label>Nombre del Producto
                    <input name="name" required maxLength={100} value={formData.name} onChange={handleChange} />
                    {errors.name && <small className="error">{errors.name}</small>}
                </label>
                
                <label>Descripción Corta (Resumen)
                    <textarea 
                        name="desc" 
                        maxLength={500} 
                        value={formData.desc} 
                        onChange={handleChange}
                        placeholder="Ej: Mouse ergonómico de alta precisión..."
                        style={{ height: '80px' }}
                    ></textarea>
                </label>

                {/* --- CAMPO NUEVO --- */}
                <label>Detalles Técnicos (Uno por línea)
                    <textarea 
                        name="details" 
                        value={detailsText} 
                        onChange={(e) => setDetailsText(e.target.value)}
                        placeholder="Ej:&#10;Sensor Óptico 16K&#10;Peso 85g&#10;Cable trenzado"
                        style={{ height: '120px', whiteSpace: 'pre-wrap' }}
                    ></textarea>
                    <small style={{color:'#aaa'}}>Escribe cada característica y presiona Enter.</small>
                </label>
                {/* ------------------- */}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ flex: 1 }}>Precio (CLP)
                        <input name="price" type="number" step="1" min="0" required value={formData.price} onChange={handleChange} />
                        {errors.price && <small className="error">{errors.price}</small>}
                    </label>
                    <label style={{ flex: 1 }}>Stock
                        <input name="stock" type="number" min="0" step="1" required value={formData.stock} onChange={handleChange} />
                        {errors.stock && <small className="error">{errors.stock}</small>}
                    </label>
                </div>

                <label>Ruta de Imagen
                    <input
                        name="img"
                        type="text"
                        required
                        placeholder="ej: img/nuevo-producto.png"
                        value={formData.img}
                        onChange={handleChange}
                    />
                    {errors.img && <small className="error">{errors.img}</small>}
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
                    {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
            </form>
        </div>
    );
}

export default AdminProductFormPage;