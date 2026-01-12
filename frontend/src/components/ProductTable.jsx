import React, { useEffect, useRef, useState } from 'react'
import './ProductTable.css'

const ProductTable = ({ products }) => {
  const [isVisible, setIsVisible] = useState(true)
  const tableRef = useRef(null)

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

  return (
    <>
      {/* Desktop Table View */}
      <div className={`product-table-wrapper ${isVisible ? 'animate-in' : ''}`} ref={tableRef}>
        <table className="product-table">
          <thead>
            <tr>
              <th>S.N</th>
              <th>PRODUCT</th>
              <th>BRAND NAME</th>
              <th>CROPS</th>
              <th>TARGET PESTS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} style={{ animationDelay: `${index * 0.03}s` }}>
                <td>{index + 1}</td>
                <td className="product-name">{product.product}</td>
                <td>{product.brand}</td>
                <td>{product.crops}</td>
                <td>{product.pests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="product-table-mobile">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="product-table-mobile-card"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="mobile-card-header">
              <span className="mobile-card-number">#{index + 1}</span>
              <div className="mobile-card-product-name">{product.product}</div>
            </div>
            <div className="mobile-card-row">
              <div>
                <div className="mobile-card-label">Brand Name</div>
                <div className="mobile-card-value mobile-card-brand">{product.brand}</div>
              </div>
              <div>
                <div className="mobile-card-label">Crops</div>
                <div className="mobile-card-value">{product.crops}</div>
              </div>
              <div>
                <div className="mobile-card-label">Target Pests</div>
                <div className="mobile-card-value">{product.pests}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ProductTable

