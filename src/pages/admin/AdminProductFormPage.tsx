import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../Types';
import { categories } from '../../data/products';
import { ProductService } from '../../services/ProductService'; // Lógica real

const validateForm = (product: Partial<Product>): { ok: boolean, errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    let ok = true;

    if (!product.code || product.code.trim().length < 3) {
        errors.code = 'Código requerido (min 3)'; ok = false;
    }
    if (!product.name || product.name.trim().length === 0) {
        errors.name = 'Nombre requerido'; ok = false;
    }
    // (Puedes agregar más validaciones aquí si quieres)
    return { ok, errors };
}

const AdminProductFormPage = () => {
    const navigate = useNavigate();

    // Estado del formulario
    const [formData, setFormData] = useState<Partial<Product>>({
        code: '', name: '', desc: '', price: 0, stock: 0, category: '', img: ''
    });

    // Estado para los detalles técnicos (Lista)
    const [detailsText, setDetailsText] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);

    // Cargar datos si estamos en modo edición
    useEffect(() => {
        const checkEditMode = async () => {
            const editCode = localStorage.getItem('editProductCode');
            if (editCode) {
                setIsEditing(true);
                // Cargar desde Backend
                const product = await ProductService.obtener(editCode);
                if (product) {
                    setFormData({
                        code: product.code,
                        name: product.name,
                        desc: product.description || product.desc,
                        price: product.price,
                        stock: product.stock,
                        category: product.category,
                        img: product.img
                    });
                    if (product.details) {
                        setDetailsText(product.details.join('\n'));
                    }
                }
            }
        };
        checkEditMode();

        return () => {
            localStorage.removeItem('editProductCode');
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const { ok, errors } = validateForm(formData);
        if (!ok) {
            setErrors(errors);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return alert("Debes iniciar sesión como Admin");

        const detailsArray = detailsText.split('\n').filter(line => line.trim() !== '');

        const productToSend: Product = {
            code: formData.code!,
            name: formData.name!,
            price: Number(formData.price),
            stock: Number(formData.stock),
            category: formData.category!,
            img: formData.img!,
            description: formData.desc,
            desc: formData.desc,
            details: detailsArray
        };

        try {
            let result;
            if (isEditing) {
                result = await ProductService.actualizar(formData.code!, productToSend, token);
                alert(result ? '¡Producto actualizado! ✅' : 'Error al actualizar');
            } else {
                result = await ProductService.create(productToSend, token);
                alert(result ? '¡Producto creado! ✅' : 'Error al crear');
            }

            if (result) navigate('/admin/products');
        } catch (error) {
            console.error(error);
            alert('Error de conexión con el servidor.');
        }
    };

    return (
        <div>
            <h1>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>

            {/* Volvemos a usar el ID original para que tu CSS funcione */}
            <form id="form-product" noValidate onSubmit={handleSubmit}>

                <label>Código
                    <input
                        name="code"
                        required
                        minLength={3}
                        value={formData.code}
                        onChange={handleChange}
                        disabled={isEditing} // No se puede cambiar el código al editar
                    />
                    {errors.code && <small className="error">{errors.code}</small>}
                </label>

                <label>Nombre
                    <input
                        name="name"
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <small className="error">{errors.name}</small>}
                </label>

                <label>Descripción
                    <textarea
                        name="desc"
                        maxLength={500}
                        value={formData.desc}
                        onChange={handleChange}
                    ></textarea>
                </label>

                {/* Nuevo campo necesario para los detalles técnicos */}
                <label>Detalles Técnicos (Uno por línea)
                    <textarea
                        value={detailsText}
                        onChange={(e) => setDetailsText(e.target.value)}
                        placeholder="Ej: Pantalla 4K..."
                        style={{ height: '100px' }} // Único estilo inline mínimo para diferenciarlo
                    ></textarea>
                </label>

                <label>Precio
                    <input
                        name="price"
                        type="number"
                        min="0"
                        required
                        value={formData.price}
                        onChange={handleChange}
                    />
                </label>

                <label>Stock
                    <input
                        name="stock"
                        type="number"
                        min="0"
                        required
                        value={formData.stock}
                        onChange={handleChange}
                    />
                </label>

                <label>Ruta de Imagen
                    <input
                        name="img"
                        type="text"
                        required
                        placeholder="ej: img/producto.png"
                        value={formData.img}
                        onChange={handleChange}
                    />
                </label>

                <label>Categoría
                    <select
                        name="category"
                        required
                        id="admin-category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Selecciona...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </label>

                <button className="btn" type="submit">
                    {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
            </form>
        </div>
    );
}

export default AdminProductFormPage;