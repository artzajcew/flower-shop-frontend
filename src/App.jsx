import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // Добавьте импорт
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider> {/* Оборачиваем все в CartProvider */}
        <div className="app">
          <header className='header'>
            <nav className='nav'>
              <Link to='/' className='nav-link nav-link-9'>More Than Flowers</Link>
              <Link to='/' className='nav-link nav-link-1'>Каталог</Link>
              <Link to='/cart' className='nav-link nav-link-1'>
                Корзина
              </Link>
              <Link to='/login' className='nav-link nav-link-1'>Вход</Link>
            </nav>
          </header>

          <main className='content'>
            <Routes>
              <Route path='/' element={<CatalogPage />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/admin' element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;