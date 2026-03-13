import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [localError, setLocalError] = useState('');
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name || !formData.password || !formData.confirmPassword) {
      setLocalError('Заполните все обязательные поля');
      return;
    }

    if (formData.password.length < 3) {
      setLocalError('Пароль должен быть минимум 3 символа');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Пароли не совпадают');
      return;
    }

    // Подготавливаем данные для отправки (без confirmPassword)
    const { confirmPassword, ...userData } = formData;
    
    const result = await register(userData);
    
    if (result.success) {
      navigate('/login', { state: { message: 'Регистрация успешна! Теперь войдите.' } });
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Регистрация</h2>
        
        {(localError || error) && 
          <div className="error-message">{localError || error}</div>
        }
        
        <div className="form-group">
          <label>Имя *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите ваше имя"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Телефон</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7 (999) 123-45-67"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Пароль *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Подтвердите пароль *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Повторите пароль"
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        
        <p className="login-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;