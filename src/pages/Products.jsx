import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductSidebar from '../components/ProductSidebar'
import ProductTable from '../components/ProductTable'
import ProductCards from '../components/ProductCards'
import productsData from '../data/products.json'
import './Products.css'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Initialize with all products immediately
  const getAllProducts = () => [
    ...productsData.insecticides,
    ...productsData.fungicides,
    ...productsData.herbicides,
    ...productsData.specialty
  ]
  
  const [filteredProducts, setFilteredProducts] = useState(getAllProducts())
  const [viewMode, setViewMode] = useState('cards') // 'table' or 'cards'
  const [sortBy, setSortBy] = useState('alphabetical-az') // Default sort
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768
    }
    return false
  })
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const [isContentVisible, setIsContentVisible] = useState(true)
  const heroRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  // Get category name for sorting
  const getCategoryName = (productId) => {
    if (productsData.fungicides?.some(p => p.id === productId)) return 'fungicides'
    if (productsData.herbicides?.some(p => p.id === productId)) return 'herbicides'
    if (productsData.specialty?.some(p => p.id === productId)) return 'specialty'
    return 'insecticides'
  }

  // Sort products based on selected sort option
  const sortProducts = (products, sortOption) => {
    const sorted = [...products]
    
    switch (sortOption) {
      case 'alphabetical-az':
        return sorted.sort((a, b) => a.product.localeCompare(b.product))
      
      case 'alphabetical-za':
        return sorted.sort((a, b) => b.product.localeCompare(a.product))
      
      case 'category':
        return sorted.sort((a, b) => {
          const categoryOrder = { insecticides: 1, fungicides: 2, herbicides: 3, specialty: 4 }
          const catA = getCategoryName(a.id)
          const catB = getCategoryName(b.id)
          if (categoryOrder[catA] !== categoryOrder[catB]) {
            return categoryOrder[catA] - categoryOrder[catB]
          }
          return a.product.localeCompare(b.product)
        })
      
      case 'crop-type':
        return sorted.sort((a, b) => {
          const cropA = a.crops.split(',')[0].trim().toLowerCase()
          const cropB = b.crops.split(',')[0].trim().toLowerCase()
          if (cropA !== cropB) {
            return cropA.localeCompare(cropB)
          }
          return a.product.localeCompare(b.product)
        })
      
      default:
        return sorted
    }
  }

  useEffect(() => {
    // Reset sort if "By Category" is selected but user filters to specific category
    if (selectedCategory !== 'all' && sortBy === 'category') {
      setSortBy('alphabetical-az')
    }
  }, [selectedCategory])

  useEffect(() => {
    let products = []
    
    if (selectedCategory === 'all') {
      products = getAllProducts()
    } else {
      products = productsData[selectedCategory] || []
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(product => 
        product.product.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.crops.toLowerCase().includes(query) ||
        product.pests.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    products = sortProducts(products, sortBy)

    setFilteredProducts(products)
  }, [selectedCategory, searchQuery, sortBy])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchParams({ category })
  }

  // Detect mobile viewport and force cards view
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      // Force cards view on mobile
      if (mobile) {
        setViewMode('cards')
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="products-page">
      {/* Page Hero */}
      <section className="products-hero" ref={heroRef}>
        <div className="products-hero-overlay"></div>
        <div className={`products-hero-content ${isHeroVisible ? 'animate-in' : ''}`}>
          <h1 className="products-hero-title">Our Products</h1>
          <nav className="breadcrumb">
            <a href="/">Home</a> <span> &gt; </span> Products
          </nav>
        </div>
      </section>

      {/* Products Content */}
      <section className={`products-content ${isContentVisible ? 'animate-in' : ''}`} ref={contentRef}>
        <div className="products-container">
          <div className="products-layout">
            {/* Sidebar */}
            <ProductSidebar 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            {/* Main Content */}
            <div className="products-main">
              {/* Search, Sort, and View Toggle */}
              <div className="products-controls">
                <div className="products-search">
                  <input
                    type="text"
                    placeholder="Search by product, brand, or crop..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="products-controls-right">
                  {/* Sort Dropdown */}
                  <div className="products-sort">
                    <label htmlFor="sort-select" className="sort-label">
                      <span className="sort-icon">⇅</span>
                      <span className="sort-text">Sort:</span>
                    </label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                      aria-label="Sort products"
                    >
                      <option value="alphabetical-az">A-Z (Alphabetical)</option>
                      <option value="alphabetical-za">Z-A (Reverse)</option>
                      {selectedCategory === 'all' && (
                        <option value="category">By Category</option>
                      )}
                      <option value="crop-type">By Crop Type</option>
                    </select>
                  </div>
                  
                  {!isMobile && (
                    <div className={`view-toggle ${viewMode}-mode`}>
                      <button
                        className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                        onClick={() => setViewMode('cards')}
                        aria-label="Card view"
                      >
                        Cards
                      </button>
                      <button
                        className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                        aria-label="Table view"
                      >
                        Table
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Display */}
              {filteredProducts.length > 0 ? (
                (viewMode === 'table' && !isMobile) ? (
                  <ProductTable products={filteredProducts} />
                ) : (
                  <ProductCards products={filteredProducts} />
                )
              ) : (
                <div className="products-empty">
                  <p>Loading products...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Products

