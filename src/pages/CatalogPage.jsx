import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import './CatalogPage.css';

function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('все');
  const [flowers, setFlowers] = useState([]);

  // Загружаем цветы из localStorage
  useEffect(() => {
    const savedFlowers = localStorage.getItem('flowers');
    if (savedFlowers) {
      setFlowers(JSON.parse(savedFlowers));
    }
  }, []);

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
          <p>Наша команда флористов создаст цветочную композицию специально по вашему заказу...</p>
        </div>
      </section>
      
      <div className="catalog-page">
        <div className="catalog-header">
          <h1 className="catalog-title">All Bouquets</h1>
        </div>

        <div className="filters">
          {/* фильтры */}
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
              description={flower.description}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CatalogPage;