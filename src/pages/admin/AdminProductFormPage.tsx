import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../Types';
import { categories } from '../../data/products';
import { ProductService } from '../../services/ProductService';

const validateForm = (product: Partial<Product>): { ok: boolean, errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    let ok = true;

    if (!product.code || product.code.trim().length < 3) {
        errors.code = 'Código requerido (min 3)'; ok = false;
    }
    if (!product.name || product.name.trim().length === 0) {
        errors.name = 'Nombre requerido'; ok = false;
    }
    return { ok, errors };
}

const AdminProductFormPage = () => {
    const navigate = useNavigate();

    // Estados
    const [formData, setFormData] = useState<Partial<Product>>({
        code: '', name: '', desc: '', price: 0, stock: 0, category: '', img: ''
    });
    const [detailsText, setDetailsText] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        const loadProductToEdit = async () => {
            const editCode = localStorage.getItem('editProductCode');
            if (editCode) {
                setIsEditing(true);
                setLoading(true);
                try {
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
                    } else {
                        alert("No se encontró el producto.");
                        navigate('/admin/products');
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadProductToEdit();

        return () => {
            localStorage.removeItem('editProductCode');
        }
    }, [navigate]);

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
            setLoading(true);
            let result;

            if (isEditing) {
                result = await ProductService.actualizar(formData.code!, productToSend, token);
                if (result) alert('¡Producto actualizado! ✅');
                else throw new Error("Error al actualizar");
            } else {
                result = await ProductService.create(productToSend, token);
                if (result) alert('¡Producto creado! ✅');
                else throw new Error("Error al crear");
            }

            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            alert('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>Cargando producto...</div>;

    return (
        <div style={{ padding: '2rem', color: 'white' }}>
            {/* Título centrado y neón */}
            <h1 style={{ color: '#39FF14', textAlign: 'center' }}>
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>

            {/* Formulario centrado */}
            <form id="form-product" noValidate onSubmit={handleSubmit} style={{ margin: '0 auto' }}>

                <label>Código
                    <input
                        name="code"
                        required
                        minLength={3}
                        value={formData.code}
                        onChange={handleChange}
                        disabled={isEditing}
                        style={{
                            background: isEditing ? '#333' : '#121212',
                            cursor: isEditing ? 'not-allowed' : 'text'
                        }}
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
                        style={{ height: '80px' }}
                    ></textarea>
                </label>

                <label>Detalles Técnicos (Uno por línea)
                    <textarea
                        value={detailsText}
                        onChange={(e) => setDetailsText(e.target.value)}
                        placeholder="Ej: Pantalla 4K..."
                        style={{ height: '100px' }}
                    ></textarea>
                </label>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
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
                    </div>
                    <div style={{ flex: 1 }}>
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
                    </div>
                </div>

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

                {/* Botones de Acción (Estilo simétrico) */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="btn"
                        style={{ flex: 1, background: '#555', color: '#fff' }}
                    >
                        Cancelar
                    </button>

                    <button
                        className="btn"
                        type="submit"
                        disabled={loading}
                        style={{ flex: 1, background: '#39FF14', color: '#000' }}
                    >
                        {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default AdminProductFormPage;