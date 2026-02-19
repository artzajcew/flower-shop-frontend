import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

function ProductCard({ id, name, price, image, category, description }) { // Добавили description
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = { id, name, price, image, category, description }; // Добавили description

  const handleCardClick = () => {
    navigate(`/product/${id}`, { 
      state: { modal: true, product } 
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price.toLocaleString()} ₽</p>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}

export default ProductCard;