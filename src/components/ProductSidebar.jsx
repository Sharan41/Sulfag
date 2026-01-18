import React from 'react'
import './ProductSidebar.css'

const ProductSidebar = ({ selectedCategory, onCategoryChange, productsData }) => {
  // Calculate counts dynamically from productsData
  const getCount = (category) => {
    if (!productsData) return 0
    if (category === 'all') {
      return (
        (productsData.insecticides?.length || 0) +
        (productsData.fungicides?.length || 0) +
        (productsData.herbicides?.length || 0) +
        (productsData.specialty?.length || 0)
      )
    }
    return productsData[category]?.length || 0
  }

  const categories = [
    { id: 'all', label: 'ALL PRODUCTS', count: getCount('all') },
    { id: 'insecticides', label: 'INSECTICIDES', count: getCount('insecticides') },
    { id: 'fungicides', label: 'FUNGICIDES', count: getCount('fungicides') },
    { id: 'herbicides', label: 'HERBICIDES', count: getCount('herbicides') },
    { id: 'specialty', label: 'OTHER', count: getCount('specialty') }
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

