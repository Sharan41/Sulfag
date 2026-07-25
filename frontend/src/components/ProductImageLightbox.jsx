import React, { useEffect, useCallback, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import './ProductImageLightbox.css'

const ProductImageLightbox = ({ images, productName, initialIndex = 0, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const hasMultiple = images.length > 1
  const active = images[activeIndex]

  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const goPrev = useCallback(() => {
    setImgError(false)
    setImgLoaded(false)
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const goNext = useCallback(() => {
    setImgError(false)
    setImgLoaded(false)
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

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && hasMultiple) goPrev()
      else if (deltaX < 0 && hasMultiple) goNext()
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  if (!active) return null

  return createPortal(
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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

        {imgError ? (
          <div className="product-lightbox-error">
            <p>Image could not be loaded</p>
          </div>
        ) : (
          <img
            src={active}
            alt={productName ? `${productName} — view ${activeIndex + 1}` : 'Product'}
            className={`product-lightbox-image ${imgLoaded ? 'is-loaded' : ''}`}
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

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
    </div>,
    document.body
  )
}

export default ProductImageLightbox
