import React from 'react';
import { useCart } from '../../context/CartContext'; // Добавь этот импорт
import './ProductCard.css';

function ProductCard({ id, name, price, image, category }) {
  const { addToCart } = useCart(); // Добавь эту строку

  const product = { id, name, price, image, category };

  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name}</h3>
        <p className="product-price">{price} ₽</p>
        <button 
          className="add-to-cart-btn"
          onClick={() => addToCart(product)} // Добавь onClick
        >
          В корзину
        </button>
      </div>
    </div>
  );
}

export default ProductCard;