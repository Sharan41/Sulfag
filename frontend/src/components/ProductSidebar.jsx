import React from 'react'
import './ProductSidebar.css'

const ProductSidebar = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: 'ALL PRODUCTS', count: 67 },
    { id: 'insecticides', label: 'INSECTICIDES', count: 40 },
    { id: 'fungicides', label: 'FUNGICIDES', count: 8 },
    { id: 'herbicides', label: 'HERBICIDES', count: 8 },
    { id: 'specialty', label: 'OTHER', count: 11 }
  ]

  return (
    <aside className="product-sidebar">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategoryChange(category.id)}
        >
          <span className="category-label">{category.label}</span>
          <span className="category-count">({category.count})</span>
        </button>
      ))}
    </aside>
  )
}

export default ProductSidebar

