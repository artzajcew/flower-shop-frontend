import React, { useState } from 'react';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import { flowers } from '../data/flowers'; // Импортируем данные
import './CatalogPage.css';

function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('все');

  const getFilteredFlowers = () => {
    if (selectedCategory === 'все') {
      return flowers;
    }
    return flowers.filter(flower => 
      flower.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const filteredFlowers = getFilteredFlowers();

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p>Наша команда флористов создаст цветочную композицию специально по вашему заказу, используя цветы высочайшего качества и профессионализм.</p>
        </div>
      </section>
      
      <div className="catalog-page">
        <div className="catalog-header">
          <h1 className="catalog-title">All Bouquets</h1>
        </div>

        <div className="filters">
          <button 
            className={`filter-btn ${selectedCategory === 'все' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('все')}
          >
            Все
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'люкс' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('люкс')}
          >
            Люкс
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'авторский' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('авторский')}
          >
            Авторские
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'сборный' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('сборный')}
          >
            Сборные
          </button>
        </div>

        <div className="products-count">
          Найдено букетов: {filteredFlowers.length}
        </div>

        <div className="products-grid">
          {filteredFlowers.map(flower => (
            <ProductCard
              key={flower.id}
              id={flower.id}
              name={flower.name}
              price={flower.price}
              category={flower.category}
              image={flower.image}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CatalogPage;