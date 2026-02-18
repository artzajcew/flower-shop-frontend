import React from 'react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Корзина пуста</h2>
        <p>Добавьте цветы из каталога</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>
      
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div className="cart-item-info">
            <h3>{item.name}</h3>
            <p>{item.price} ₽</p>
          </div>
          
          <div className="cart-item-quantity">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
          
          <div className="cart-item-total">
            {item.price * item.quantity} ₽
          </div>
          
          <button onClick={() => removeFromCart(item.id)}>×</button>
        </div>
      ))}
      
      <div className="cart-total">
        <strong>Итого: {totalPrice} ₽</strong>
      </div>
    </div>
  );
}

export default CartPage;