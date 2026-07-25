import React, { useEffect, useCallback, useState } from 'react'
import './ProductImageLightbox.css'

/**
 * Full-screen product image viewer.
 * Supports 1–2 images with thumb strip, Esc / backdrop / X to close.
 */
const ProductImageLightbox = ({ images, productName, initialIndex = 0, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const hasMultiple = images.length > 1
  const active = images[activeIndex]

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasMultiple) goPrev()
      if (e.key === 'ArrowRight' && hasMultiple) goNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, goPrev, goNext, hasMultiple])

  if (!active) return null

  return (
    <div
      className="product-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={productName ? `${productName} product image` : 'Product image'}
      onClick={onClose}
    >
      <button
        type="button"
        className="product-lightbox-close"
        onClick={onClose}
        aria-label="Close image"
      >
        ×
      </button>

      <div
        className="product-lightbox-stage"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMultiple && (
          <button
            type="button"
            className="product-lightbox-nav product-lightbox-nav-prev"
            onClick={goPrev}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}

        <img
          src={active}
          alt={productName ? `${productName} — view ${activeIndex + 1}` : 'Product'}
          className="product-lightbox-image"
        />

        {hasMultiple && (
          <button
            type="button"
            className="product-lightbox-nav product-lightbox-nav-next"
            onClick={goNext}
            aria-label="Next image"
          >
            ›
          </button>
        )}
      </div>

      {hasMultiple && (
        <div
          className="product-lightbox-thumbs"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={`product-lightbox-thumb ${i === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      {productName && (
        <p className="product-lightbox-caption" onClick={(e) => e.stopPropagation()}>
          {productName}
          {hasMultiple && (
            <span className="product-lightbox-count">
              {' '}
              ({activeIndex + 1}/{images.length})
            </span>
          )}
        </p>
      )}
    </div>
  )
}

export default ProductImageLightbox
