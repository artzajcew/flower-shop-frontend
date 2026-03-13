import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../api/api';
import './ProductPage.css';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(parseInt(id));
        setProduct(response.data);
      } catch (err) {
        setError('Товар не найден');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  return (
    <div className="product-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>
      
      <div className="product-container">
        <div className="product-gallery">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-details">
          <span className="product-category">{product.category?.name || product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-price">{product.price.toLocaleString()} ₽</p>
          
          <div className="product-description">
            <h3>Описание</h3>
            <p>{product.description}</p>
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;