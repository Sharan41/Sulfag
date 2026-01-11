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
  )
}

export default ProductTable

