import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // Добавьте импорт
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import CheckoutPage from './pages/CheckoutPage';
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
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
          </main>

          <footer className="footer">
            <div className="footer-content">
              <div className="footer-column">
                <h4>More Than Flowers</h4>
                <p>Студия цветов с 2015 года</p>
                <p>Создаем букеты для ваших особенных моментов</p>
                <p>Ежедневно с 9:00 до 21:00</p>
              </div>
              
              <div className="footer-column">
                <h4>Каталог</h4>
                <ul>
                  <li><a href="/">Авторские букеты</a></li>
                  <li><a href="/">Сборные букеты</a></li>
                  <li><a href="/">Люкс</a></li>
                  <li><a href="/">Свадебные букеты</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Информация</h4>
                <ul>
                  <li><a href="/">О нас</a></li>
                  <li><a href="/">Доставка и оплата</a></li>
                  <li><a href="/">Возврат</a></li>
                  <li><a href="/">Блог</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Контакты</h4>
                <ul>
                  <li>+7 (999) 123-45-67</li>
                  <li>morethanflowers@gmail.ru</li>
                  <li>г. Москва, ул. Цветочная, 1</li>
                  <li>
                    <a href="/">Instagram</a> | <a href="/">VK</a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>© 2026 More Than Flowers. Все права защищены.</p>
            </div>
          </footer>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;