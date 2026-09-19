import React from 'react'
import { Link } from 'react-router-dom'
import PackShot from './PackShot'
import HighlightText from './HighlightText'
import { getCategoryBadgeSlug, getCategoryLabel, hasCategory } from '../utils/categoryUtils'
import {
  getCropSummary,
  getFormulation,
  getProductKey,
  getProductPath,
  parsePackSizes,
} from '../utils/productDisplay'
import './ProductCards.css'

const isPlainLeftClick = (event) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey

// Soft light that follows the pointer across a card's image
const trackSpotlight = (event) => {
  const media = event.target.closest?.('.product-card-media')
  if (!media) return
  const rect = media.getBoundingClientRect()
  media.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
  media.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
}

const ProductCards = ({ products, query = '', onOpen, linkState, animateIn = false }) => (
  <div className={`product-cards-grid ${animateIn ? 'animate-in' : ''}`} onPointerMove={trackSpotlight}>
    {products.map((product, index) => {
      const key = getProductKey(product)
      const badge = getCategoryBadgeSlug(product.category)
      const image = (product.images || []).find(Boolean)
      const formulation = getFormulation(product.product)
      const packs = [...new Set((product.packSizes?.length ? product.packSizes : parsePackSizes(product.packing)).map((pack) => pack.size))]
      const crops = getCropSummary(product.crops)
      const brand = String(product.brand || '').trim()

      return (
        <Link
          key={key}
          to={getProductPath(product)}
          state={linkState}
          className={`product-card product-card-${badge}`}
          data-product-key={key}
          style={{ '--i': Math.min(index, 12) }}
          onClick={(event) => {
            if (!onOpen || !isPlainLeftClick(event)) return
            event.preventDefault()
            onOpen(product, event.currentTarget)
          }}
        >
          <div className="product-card-media">
            {hasCategory(product.category) && (
              <span className={`product-category-badge badge-${badge}`}>{getCategoryLabel(product.category)}</span>
            )}
            {formulation && <span className="product-form-code">{formulation}</span>}
            <div className={`product-card-image ${image ? 'is-photo' : ''}`} data-vt="media">
              {image ? <img src={image} alt={`${brand} pack`} loading="lazy" draggable="false" /> : <PackShot product={product} />}
            </div>
          </div>

          <div className="product-card-body">
            <h3 className="product-card-brand" data-vt="title">
              <HighlightText text={brand} query={query} />
            </h3>
            <p className="product-card-technical">
              <HighlightText text={product.product} query={query} />
            </p>
            {packs.length > 0 && (
              <div className="product-card-packs">
                {packs.slice(0, 3).map((size) => (
                  <span key={size} className="product-pack-chip">
                    {size}
                  </span>
                ))}
              </div>
            )}
            {crops && <p className="product-card-crops">{crops}</p>}
          </div>

          <div className="product-card-footer">
            <span>View details</span>
            <span className="product-card-arrow" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </Link>
      )
    })}
  </div>
)

export const ProductCardSkeletons = ({ count = 8 }) => (
  <div className="product-cards-grid" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="product-card product-card-skeleton">
        <div className="product-card-media skeleton-shimmer" />
        <div className="product-card-body">
          <span className="skeleton-line skeleton-shimmer" style={{ width: '62%', height: 20 }} />
          <span className="skeleton-line skeleton-shimmer" style={{ width: '90%' }} />
          <span className="skeleton-line skeleton-shimmer" style={{ width: '40%' }} />
        </div>
        <div className="product-card-footer">
          <span className="skeleton-line skeleton-shimmer" style={{ width: '35%' }} />
        </div>
      </div>
    ))}
  </div>
)

export default ProductCards
