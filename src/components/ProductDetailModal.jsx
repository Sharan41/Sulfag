import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PackShot from './PackShot'
import ProductCards from './ProductCards'
import ProductImageLightbox from './ProductImageLightbox'
import { getCategoryBadgeSlug, getCategoryLabel, getCategoryTitle, normalizeCategory } from '../utils/categoryUtils'
import {
  getComposition,
  getCropList,
  getFormulation,
  getProductKey,
  getRelatedProducts,
  getTargetList,
  parsePackSizes,
  shouldShowTargetsAsText,
} from '../utils/productDisplay'
import './ProductDetailModal.css'

const priceFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 })
const formatPrice = (value) => priceFormat.format(value)

const Icon = ({ path, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={path} />
  </svg>
)

const ProductDetailModal = ({
  product,
  products,
  allProducts,
  direction,
  closing,
  playIntro,
  onClose,
  onNavigate,
  onCategoryCrumb,
}) => {
  const [imageIndex, setImageIndex] = useState(0)
  const [zoomIndex, setZoomIndex] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const sheetRef = useRef(null)
  const bodyRef = useRef(null)
  const titleRef = useRef(null)
  const closeRef = useRef(null)
  const dragRef = useRef(null)
  const swipeRef = useRef(null)
  const swipedRef = useRef(false)

  const key = getProductKey(product)
  const category = normalizeCategory(product.category)
  const badge = getCategoryBadgeSlug(product.category)
  const brand = String(product.brand || '').trim()
  const images = (product.images || []).filter(Boolean)
  const formulation = getFormulation(product.product)
  const composition = getComposition(product.product)
  // Pack Size entries from Contentful (with MRP) take over from the parsed Packing text
  const packs = product.packSizes?.length
    ? product.packSizes.map((pack) => ({ size: pack.size, perCase: pack.unitsPerCase ? [pack.unitsPerCase] : [], mrp: pack.mrp }))
    : parsePackSizes(product.packing)
  const crops = getCropList(product.crops)
  const targets = getTargetList(product.pests)
  const extraFields = product.extraFields || []
  const related = getRelatedProducts(product, allProducts)

  const index = products.findIndex((item) => getProductKey(item) === key)
  const previous = index > 0 ? products[index - 1] : null
  const next = index >= 0 && index < products.length - 1 ? products[index + 1] : null

  // Lock the page behind the dialog and hide it from assistive tech
  useEffect(() => {
    const root = document.getElementById('root')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (root) root.inert = true
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = previousOverflow
      if (root) root.inert = false
    }
  }, [])

  // New product: reset the gallery, scroll to top, watch the title for the compact header
  useEffect(() => {
    setImageIndex(0)
    setZoomIndex(null)
    bodyRef.current?.scrollTo({ top: 0 })
    const title = titleRef.current
    if (!title || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { root: bodyRef.current, threshold: 0 })
    observer.observe(title)
    return () => observer.disconnect()
  }, [key])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (zoomIndex !== null) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowLeft' && previous) {
        event.preventDefault()
        onNavigate(previous, 'prev')
        return
      }
      if (event.key === 'ArrowRight' && next) {
        event.preventDefault()
        onNavigate(next, 'next')
        return
      }
      if (event.key === 'Tab' && sheetRef.current) {
        const focusable = [...sheetRef.current.querySelectorAll('button:not([disabled]), a[href]')].filter((el) => el.offsetParent !== null)
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [zoomIndex, previous, next, onClose, onNavigate])

  const showImage = (nextIndex) => {
    if (images.length < 2) return
    setImageIndex((nextIndex + images.length) % images.length)
  }

  // Phones: drag the sheet header down to dismiss
  const startDrag = (event) => {
    if (window.innerWidth > 700 || event.target.closest('button')) return
    dragRef.current = { startY: event.clientY, offset: 0 }
    sheetRef.current.classList.add('is-dragging')
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const moveDrag = (event) => {
    if (!dragRef.current) return
    dragRef.current.offset = Math.max(0, event.clientY - dragRef.current.startY)
    sheetRef.current.style.transform = `translateY(${dragRef.current.offset}px)`
  }
  const endDrag = () => {
    if (!dragRef.current) return
    const { offset } = dragRef.current
    dragRef.current = null
    const sheet = sheetRef.current
    sheet.classList.remove('is-dragging')
    if (offset > 110) {
      sheet.style.transform = 'translateY(100%)'
      window.setTimeout(() => onClose({ instant: true }), 260)
    } else {
      sheet.style.transform = ''
    }
  }

  const dragHandlers = { onPointerDown: startDrag, onPointerMove: moveDrag, onPointerUp: endDrag, onPointerCancel: endDrag }

  return createPortal(
    <div className={`product-modal ${closing ? 'is-closing' : ''} ${playIntro ? '' : 'no-intro'}`}>
      <div className="product-modal-backdrop" onClick={() => onClose()} />

      <div
        ref={sheetRef}
        className={`product-modal-sheet product-modal-${badge}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        data-vt="sheet"
      >
        <div className="product-modal-grab" aria-hidden="true" {...dragHandlers} />

        <header className={`product-modal-bar ${scrolled ? 'is-scrolled' : ''}`} {...dragHandlers}>
          <div className="product-modal-bar-left">
            <div className="product-modal-crumb">
              <span className="product-modal-crumb-trail">
                <button type="button" onClick={() => onCategoryCrumb('all')}>Products</button>
                <span aria-hidden="true">›</span>
                <button type="button" onClick={() => onCategoryCrumb(category)}>{getCategoryTitle(category)}</button>
                <span aria-hidden="true">›</span>
              </span>
              <b>{brand}</b>
            </div>
            <div className="product-modal-compact-title" aria-hidden="true">
              {brand} <small>{product.product}</small>
            </div>
          </div>

          <div className="product-modal-tools">
            {index >= 0 && (
              <span className="product-modal-position">
                {index + 1} of {products.length}
              </span>
            )}
            <button type="button" className="product-modal-icon-btn" onClick={() => onNavigate(previous, 'prev')} disabled={!previous} aria-label={previous ? `Previous product: ${previous.brand}` : 'No previous product'}>
              <Icon path="m15 18-6-6 6-6" />
            </button>
            <button type="button" className="product-modal-icon-btn" onClick={() => onNavigate(next, 'next')} disabled={!next} aria-label={next ? `Next product: ${next.brand}` : 'No next product'}>
              <Icon path="m9 18 6-6-6-6" />
            </button>
            <button ref={closeRef} type="button" className="product-modal-icon-btn is-close" onClick={() => onClose()} aria-label="Close product details">
              <Icon path="M6 6l12 12M18 6 6 18" />
            </button>
          </div>
        </header>

        <div className="product-modal-body" ref={bodyRef}>
          <div key={key} className={`product-modal-hero ${direction ? `slide-${direction}` : ''}`}>
            <div className="product-modal-gallery">
              <div
                className="product-modal-stage"
                onPointerDown={(event) => {
                  swipeRef.current = { x: event.clientX, y: event.clientY }
                  swipedRef.current = false
                }}
                onPointerUp={(event) => {
                  if (!swipeRef.current) return
                  const dx = event.clientX - swipeRef.current.x
                  const dy = event.clientY - swipeRef.current.y
                  swipeRef.current = null
                  if (images.length > 1 && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                    swipedRef.current = true
                    showImage(imageIndex + (dx < 0 ? 1 : -1))
                  }
                }}
              >
                <button
                  type="button"
                  className={`product-modal-image ${images.length ? 'is-photo' : ''}`}
                  data-vt="media"
                  disabled={!images.length}
                  onClick={() => {
                    if (!swipedRef.current) setZoomIndex(imageIndex)
                  }}
                  aria-label={images.length ? `Enlarge ${brand} image` : undefined}
                >
                  {images.length ? (
                    <img key={images[imageIndex]} src={images[imageIndex]} alt={`${brand} pack, image ${imageIndex + 1} of ${images.length}`} draggable="false" />
                  ) : (
                    <PackShot product={product} />
                  )}
                </button>
                {images.length > 1 && (
                  <span className="product-modal-image-count">
                    {imageIndex + 1} / {images.length}
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="product-modal-thumbs">
                  {images.map((src, thumbIndex) => (
                    <button
                      key={src + thumbIndex}
                      type="button"
                      className="product-modal-thumb"
                      aria-current={thumbIndex === imageIndex}
                      aria-label={`Show image ${thumbIndex + 1} of ${images.length}`}
                      onClick={() => showImage(thumbIndex)}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-modal-info">
              <div className="product-modal-head" style={{ '--i': 0 }}>
                <div className="product-modal-eyebrow">
                  <span className={`product-category-badge badge-${badge}`}>{getCategoryLabel(product.category)}</span>
                  {formulation && <span className="product-form-code">{formulation}</span>}
                </div>
                <h2 id="product-modal-title" ref={titleRef} className="product-modal-title" data-vt="title">
                  {brand}
                </h2>
                <p className="product-modal-technical">{product.product}</p>
              </div>

              {composition.length > 0 && (
                <section className="product-modal-block" style={{ '--i': 1 }}>
                  <h3>Composition</h3>
                  <div className="product-modal-composition">
                    {composition.map((ingredient) => (
                      <div key={ingredient.name} className="product-modal-ingredient">
                        <span className="product-modal-ingredient-name">{ingredient.name}</span>
                        <span className="product-modal-ingredient-percent">{ingredient.percent}%</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(packs.length > 0 || product.packing) && (
                <section className="product-modal-block" style={{ '--i': 2 }}>
                  <h3>{product.fieldLabels?.packSizes || 'Pack sizes'}</h3>
                  {packs.length > 0 ? (
                    <div className="product-modal-packs">
                      {packs.map((pack, packIndex) => (
                        <div key={`${pack.size}-${packIndex}`} className="product-modal-pack">
                          <b>{pack.size}</b>
                          {pack.perCase.length > 0 && <span>{pack.perCase.join(' or ')} per case</span>}
                          {pack.mrp != null && <span className="product-modal-pack-mrp">MRP {formatPrice(pack.mrp)}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="product-modal-text">{product.packing}</p>
                  )}
                </section>
              )}

              {crops.length > 0 && (
                <section className="product-modal-block" style={{ '--i': 3 }}>
                  <h3>{product.fieldLabels?.crops || 'Crops'}</h3>
                  {shouldShowTargetsAsText(crops) ? (
                    <p className="product-modal-description">{String(product.crops).trim()}</p>
                  ) : (
                    <div className="product-modal-targets">
                      {crops.map((crop) => (
                        <span key={crop} className="product-modal-target">
                          {crop}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {targets.length > 0 && (
                <section className="product-modal-block" style={{ '--i': 4 }}>
                  <h3>{product.fieldLabels?.pests || 'Target Pests'}</h3>
                  {shouldShowTargetsAsText(targets) ? (
                    <p className="product-modal-description">{String(product.pests).trim()}</p>
                  ) : (
                    <div className="product-modal-targets">
                      {targets.map((target) => (
                        <span key={target} className="product-modal-target">
                          {target}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* Any other field added to the Contentful product model */}
              {extraFields.map((field, fieldIndex) => {
                const texts = field.items.filter((item) => typeof item === 'string')
                const files = field.items.filter((item) => typeof item === 'object')
                return (
                  <section key={field.id} className="product-modal-block" style={{ '--i': 5 + fieldIndex }}>
                    <h3>{field.label}</h3>
                    {texts.length === 1 || shouldShowTargetsAsText(texts) ? (
                      texts.map((text) => (
                        <p key={text} className="product-modal-description">
                          {text}
                        </p>
                      ))
                    ) : (
                      texts.length > 0 && (
                        <div className="product-modal-targets">
                          {texts.map((text) => (
                            <span key={text} className="product-modal-target">
                              {text}
                            </span>
                          ))}
                        </div>
                      )
                    )}
                    {files.length > 0 && (
                      <div className="product-modal-targets">
                        {files.map((file) => (
                          <a key={file.href} className="product-modal-target" href={file.href} target="_blank" rel="noopener noreferrer">
                            {file.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          </div>

          {related.length > 0 && (
            <section className="product-modal-related">
              <h3>More {getCategoryTitle(category).toLowerCase()}</h3>
              <ProductCards products={related} onOpen={(item) => onNavigate(item, 'next')} />
            </section>
          )}
        </div>
      </div>

      {zoomIndex !== null && images.length > 0 && (
        <ProductImageLightbox images={images} productName={brand} initialIndex={zoomIndex} onClose={() => setZoomIndex(null)} />
      )}
    </div>,
    document.body
  )
}

export default ProductDetailModal
