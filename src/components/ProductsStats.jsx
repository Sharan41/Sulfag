import React from 'react'
import productsData from '../data/products.json'
import './ProductsStats.css'

const ProductsStats = ({ totalProducts, selectedCategory, products }) => {
  // Calculate category breakdown from all products
  const categoryBreakdown = {
    insecticides: productsData.insecticides?.length || 0,
    fungicides: productsData.fungicides?.length || 0,
    herbicides: productsData.herbicides?.length || 0,
    specialty: productsData.specialty?.length || 0
  }

  const getCategoryName = (cat) => {
    const names = {
      all: 'All Products',
      insecticides: 'Insecticides',
      fungicides: 'Fungicides',
      herbicides: 'Herbicides',
      specialty: 'Specialty'
    }
    return names[cat] || 'Products'
  }

  return (
    <div className="products-stats">
      <div className="stats-content">
        <div className="stat-item">
          <div className="stat-number">{totalProducts}</div>
          <div className="stat-label">{getCategoryName(selectedCategory)}</div>
        </div>
        {selectedCategory === 'all' && (
          <>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{categoryBreakdown.insecticides}</div>
              <div className="stat-label">Insecticides</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{categoryBreakdown.fungicides}</div>
              <div className="stat-label">Fungicides</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{categoryBreakdown.herbicides}</div>
              <div className="stat-label">Herbicides</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{categoryBreakdown.specialty}</div>
              <div className="stat-label">Specialty</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductsStats

