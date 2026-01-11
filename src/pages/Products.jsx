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

    setFilteredProducts(products)
  }, [selectedCategory, searchQuery])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchParams({ category })
  }

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
              {/* Search and View Toggle */}
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
              </div>

              {/* Products Display */}
              {filteredProducts.length > 0 ? (
                viewMode === 'table' ? (
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

