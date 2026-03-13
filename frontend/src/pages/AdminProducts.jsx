import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/api';
import './AdminProducts.css';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    image: '',
    description: '',
    code: '',
    quantity: 0
  });

  // Загружаем товары
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
      alert('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category_id: '',
      image: '',
      description: '',
      code: '',
      quantity: 0
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category_id: product.category_id || '',
      image: product.image,
      description: product.description,
      code: product.code || '',
      quantity: product.quantity || 0
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.image || !formData.description) {
      alert('Заполните все поля!');
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        alert('Товар обновлен!');
      } else {
        await createProduct(formData);
        alert('Товар добавлен!');
      }
      
      await loadProducts();
      resetForm();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert('Ошибка при сохранении товара');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await deleteProduct(id);
        await loadProducts();
        alert('Товар удален!');
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Ошибка при удалении товара');
      }
    }
  };

  if (loading && products.length === 0) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-actions">
        <button className="add-btn" onClick={handleAdd}>
          + Добавить новый букет
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content admin-form">
            <h2>{editingProduct ? 'Редактировать' : 'Добавить'} букет</h2>
            
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Название:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Артикул:</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Например: BQ-001"
                />
              </div>

              <div className="form-group">
                <label>Цена (₽):</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Количество:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>ID категории:</label>
                <input
                  type="number"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  placeholder="1, 2, 3..."
                />
              </div>

              <div className="form-group">
                <label>URL изображения:</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="например: /flowers/photo_1.jpg"
                  required
                />
              </div>

              <div className="form-group">
                <label>Описание:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingProduct ? 'Сохранить' : 'Добавить'}
                </button>
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table">
        <h2>Список товаров ({products.length})</h2>
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Изображение</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>В наличии</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="table-image"
                  />
                </td>
                <td>{product.name.substring(0, 50)}...</td>
                <td>{product.category?.name || product.category_id}</td>
                <td>{product.price} ₽</td>
                <td>{product.quantity > 0 ? 'Да' : 'Нет'}</td>
                <td className="actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;