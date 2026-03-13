import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!username || !password) {
      setLocalError('Заполните все поля');
      return;
    }
    
    const result = await login(username, password);
    
    if (result.success) {
      // Перенаправляем админа в админку, обычного пользователя на главную
      if (result.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className='login-page'>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Вход в магазин</h2>
          
          {(localError || error) && 
            <div className="error-message">{localError || error}</div>
          }
          
          <div className="form-group">
            <label>Email или телефон:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="email@example.com или +79991234567"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="введите пароль"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
          
          <p className="register-link">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;