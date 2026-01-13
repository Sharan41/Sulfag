import React, { useEffect, useRef, useState } from 'react'
import productsData from '../data/products.json'
import './ProductCards.css'

const ProductCards = ({ products }) => {
  const [isVisible, setIsVisible] = useState(true)
  const gridRef = useRef(null)

  useEffect(() => {
    // Set visible immediately, animation will still work
    setIsVisible(true)
  }, [])
  if (products.length === 0) {
    return (
      <div className="products-empty">
        <p>No products found. Try adjusting your search or category filter.</p>
      </div>
    )
  }

  const getCategoryColor = (productId) => {
    // Determine category based on product ID ranges
    const fungicideIds = productsData.fungicides?.map(p => p.id) || []
    const herbicideIds = productsData.herbicides?.map(p => p.id) || []
    const specialtyIds = productsData.specialty?.map(p => p.id) || []
    
    if (fungicideIds.includes(productId)) {
      return 'fungicide'
    } else if (herbicideIds.includes(productId)) {
      return 'herbicide'
    } else if (specialtyIds.includes(productId)) {
      return 'specialty'
    }
    return 'insecticide'
  }

  return (
    <div className={`product-cards-grid ${isVisible ? 'animate-in' : ''}`} ref={gridRef}>
      {products.map((product, index) => {
        const category = getCategoryColor(product.id)
        return (
          <div 
            key={product.id} 
            className={`product-card product-card-${category}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="product-card-header">
              <span className={`product-category-badge badge-${category}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              <span className="product-id">#{product.id}</span>
            </div>
            
            <div className="product-card-body">
              <h3 className="product-card-name">{product.product}</h3>
              <p className="product-card-brand">{product.brand}</p>
              
              <div className="product-card-details">
                <div className="product-detail-item">
                  <span className="detail-label">Packing:</span>
                  <span className="detail-value">{product.packing || 'N/A'}</span>
                </div>
                <div className="product-detail-item">
                  <span className="detail-label">Crops:</span>
                  <span className="detail-value">{product.crops}</span>
                </div>
                <div className="product-detail-item">
                  <span className="detail-label">Target:</span>
                  <span className="detail-value">{product.pests}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductCards

