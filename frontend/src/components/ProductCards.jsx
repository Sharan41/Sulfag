import React, { useEffect, useState } from 'react'
import productsData from '../data/products.json'
import ProductImageLightbox from './ProductImageLightbox'
import './ProductCards.css'

const ProductCards = ({ products }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
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
    const fungicideIds = productsData.fungicides?.map((p) => p.id) || []
    const herbicideIds = productsData.herbicides?.map((p) => p.id) || []
    const specialtyIds = productsData.specialty?.map((p) => p.id) || []

    if (fungicideIds.includes(productId)) return 'fungicide'
    if (herbicideIds.includes(productId)) return 'herbicide'
    if (specialtyIds.includes(productId)) return 'specialty'
    return 'insecticide'
  }

  const openLightbox = (product, startIndex = 0) => {
    const images = (product.images || []).filter(Boolean)
    if (images.length === 0) return
    setLightbox({
      images,
      productName: product.brand || product.product,
      initialIndex: startIndex,
    })
  }

  return (
    <>
      <div className={`product-cards-grid ${isVisible ? 'animate-in' : ''}`}>
        {products.map((product, index) => {
          const category = getCategoryColor(product.id)
          const images = (product.images || []).filter(Boolean)
          const hasImages = images.length > 0

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

              {hasImages && (
                <div className="product-card-media">
                  <button
                    type="button"
                    className="product-card-thumb-main"
                    onClick={() => openLightbox(product, 0)}
                    aria-label={`View ${product.brand || product.product} image`}
                  >
                    <img
                      src={images[0]}
                      alt={`${product.brand || product.product} packaging`}
                      loading="lazy"
                    />
                    <span className="product-card-thumb-hint">View</span>
                  </button>

                  {images.length > 1 && (
                    <div className="product-card-thumb-strip" role="group" aria-label="More product images">
                      {images.map((src, imgIndex) => (
                        <button
                          key={src + imgIndex}
                          type="button"
                          className={`product-card-thumb-mini ${imgIndex === 0 ? 'is-primary' : ''}`}
                          onClick={() => openLightbox(product, imgIndex)}
                          aria-label={`Open image ${imgIndex + 1} of ${images.length}`}
                        >
                          <img src={src} alt="" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

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

      {lightbox && (
        <ProductImageLightbox
          images={lightbox.images}
          productName={lightbox.productName}
          initialIndex={lightbox.initialIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}

export default ProductCards
