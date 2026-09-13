import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import AnimatedNumber from './AnimatedNumber'
import { prefersReducedMotion } from '../utils/viewTransition'
import './ProductFilterBar.css'

const ProductFilterBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showViewToggle,
  isStuck,
}) => {
  const tabsRef = useRef(null)
  const indicatorRef = useRef(null)
  const inputRef = useRef(null)
  const hasPlacedRef = useRef(false)

  // Slide the highlight under the active category
  const placeIndicator = useCallback((animate) => {
    const tabs = tabsRef.current
    const indicator = indicatorRef.current
    if (!tabs || !indicator) return
    const active = tabs.querySelector('[aria-pressed="true"]')
    if (!active) {
      indicator.style.opacity = '0'
      return
    }
    if (!animate) indicator.style.transition = 'none'
    indicator.style.opacity = '1'
    indicator.style.width = `${active.offsetWidth}px`
    indicator.style.transform = `translateX(${active.offsetLeft}px)`
    if (!animate) {
      void indicator.offsetWidth
      indicator.style.transition = ''
    }
  }, [])

  useLayoutEffect(() => {
    placeIndicator(hasPlacedRef.current)
    hasPlacedRef.current = true

    // Keep the active category in view when the row scrolls on small screens
    const tabs = tabsRef.current
    const active = tabs?.querySelector('[aria-pressed="true"]')
    if (!tabs || !active) return
    const padding = 24
    const hiddenLeft = active.offsetLeft < tabs.scrollLeft + padding
    const hiddenRight = active.offsetLeft + active.offsetWidth > tabs.scrollLeft + tabs.clientWidth - padding
    if (hiddenLeft || hiddenRight) {
      tabs.scrollTo({ left: active.offsetLeft - padding, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
  }, [selectedCategory, categories, placeIndicator])

  useEffect(() => {
    const tabs = tabsRef.current
    if (!tabs || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => placeIndicator(false))
    observer.observe(tabs)
    return () => observer.disconnect()
  }, [placeIndicator])

  const clearSearch = () => {
    onSearchChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={`product-filter-bar ${isStuck ? 'is-stuck' : ''}`}>
      <div className="filter-row filter-row-top">
        <label className="filter-search">
          <svg className="filter-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className="filter-search-input"
            placeholder="Search by brand, product, crop or pest"
            aria-label="Search products"
            autoComplete="off"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && searchQuery) {
                event.preventDefault()
                onSearchChange('')
              }
            }}
          />
          <button
            type="button"
            className={`filter-search-clear ${searchQuery ? 'is-visible' : ''}`}
            onClick={clearSearch}
            aria-label="Clear search"
            tabIndex={searchQuery ? 0 : -1}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </label>

        <select className="filter-sort" value={sortBy} onChange={(event) => onSortChange(event.target.value)} aria-label="Sort products">
          <option value="alphabetical-az">A-Z (Brand)</option>
          <option value="alphabetical-za">Z-A (Reverse)</option>
          {selectedCategory === 'all' && <option value="category">By Category</option>}
          <option value="crop-type">By Crop Type</option>
        </select>

        {showViewToggle && (
          <div className={`view-toggle ${viewMode}-mode`} role="group" aria-label="Layout">
            <button type="button" className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`} aria-pressed={viewMode === 'cards'} onClick={() => onViewModeChange('cards')}>
              Cards
            </button>
            <button type="button" className={`view-btn ${viewMode === 'table' ? 'active' : ''}`} aria-pressed={viewMode === 'table'} onClick={() => onViewModeChange('table')}>
              Table
            </button>
          </div>
        )}
      </div>

      <div className="filter-row">
        <div className="filter-tabs" ref={tabsRef} role="group" aria-label="Product category">
          <span className="filter-tab-indicator" ref={indicatorRef} aria-hidden="true" />
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="filter-tab"
              aria-pressed={selectedCategory === category.id}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
              <span className="filter-tab-count">
                <AnimatedNumber value={category.count} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductFilterBar
