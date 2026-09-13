import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ProductFilterBar from '../components/ProductFilterBar'
import ProductTable from '../components/ProductTable'
import ProductCards, { ProductCardSkeletons } from '../components/ProductCards'
import ProductDetailModal from '../components/ProductDetailModal'
import AnimatedNumber from '../components/AnimatedNumber'
import productsData from '../data/products.json'
import { fetchProductsFromContentful, isContentfulConfigured } from '../contentful/client'
import { normalizeCategory, PRODUCT_CATEGORY_SLUGS, stampProductsWithCategory } from '../utils/categoryUtils'
import { getCropList, getProductKey, getProductPath, withSlugs } from '../utils/productDisplay'
import { canUseViewTransitions, isInViewport, prefersReducedMotion, transitionUpdate } from '../utils/viewTransition'
import './Products.css'

const CATEGORY_TITLES = {
  all: 'Our Products',
  insecticides: 'Insecticides',
  fungicides: 'Fungicides',
  herbicides: 'Herbicides',
  specialty: 'Other Products',
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Products' },
  { id: 'insecticides', label: 'Insecticides' },
  { id: 'fungicides', label: 'Fungicides' },
  { id: 'herbicides', label: 'Herbicides' },
  { id: 'specialty', label: 'Other' },
]

const CATEGORY_ORDER = { insecticides: 1, fungicides: 2, herbicides: 3, specialty: 4 }
const PAGE_TITLE = 'AG-GROW PRODUCTS LIMITED'

const categoryPath = (category) => (category === 'all' ? '/products' : `/products/${category}`)
const flattenProducts = (grouped) => withSlugs(PRODUCT_CATEGORY_SLUGS.flatMap((slug) => grouped[slug] || []))
const brandOf = (product) => String(product.brand || '').trim()

const sortProducts = (products, sortOption) => {
  const sorted = [...products]
  const byBrand = (a, b) => brandOf(a).localeCompare(brandOf(b))

  switch (sortOption) {
    case 'alphabetical-za':
      return sorted.sort((a, b) => byBrand(b, a))
    case 'category':
      return sorted.sort(
        (a, b) => CATEGORY_ORDER[normalizeCategory(a.category)] - CATEGORY_ORDER[normalizeCategory(b.category)] || byBrand(a, b)
      )
    case 'crop-type':
      return sorted.sort((a, b) => (getCropList(a.crops)[0] || '').localeCompare(getCropList(b.crops)[0] || '') || byBrand(a, b))
    default:
      return sorted.sort(byBrand)
  }
}

const matchesQuery = (product, query) =>
  !query || [product.product, product.brand, product.crops, product.pests].some((value) => String(value || '').toLowerCase().includes(query))

const Products = () => {
  const { category: categoryParam, slug } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [useContentful, setUseContentful] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('alphabetical-az')
  const [viewMode, setViewMode] = useState('cards')
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768)
  const [isStuck, setIsStuck] = useState(false)
  const [gridAnimationKey, setGridAnimationKey] = useState(0)
  const [pendingCategory, setPendingCategory] = useState(null)
  const [activeProduct, setActiveProduct] = useState(null)
  const [modalState, setModalState] = useState({ direction: null, closing: false, playIntro: true })

  const heroBgRef = useRef(null)
  const dockRef = useRef(null)
  const resultsRef = useRef(null)
  const expectedSlugRef = useRef(undefined)
  const closeTimerRef = useRef(null)
  const triggerRef = useRef(null)

  // The listing stays on the category it was opened from while a product is showing
  const routeCategory = PRODUCT_CATEGORY_SLUGS.includes(categoryParam) ? categoryParam : 'all'
  const routeListCategory = slug ? location.state?.listCategory ?? routeCategory : routeCategory
  const listCategory = pendingCategory ?? routeListCategory

  useEffect(() => {
    if (pendingCategory && pendingCategory === routeListCategory) setPendingCategory(null)
  }, [pendingCategory, routeListCategory])

  // Old links such as /products?category=herbicides
  useEffect(() => {
    const legacy = searchParams.get('category')
    if (!legacy || categoryParam) return
    navigate(legacy === 'all' ? '/products' : categoryPath(normalizeCategory(legacy)), { replace: true })
  }, [searchParams, categoryParam, navigate])

  // Fetch products from Contentful or use JSON fallback
  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      const localById = new Map(PRODUCT_CATEGORY_SLUGS.flatMap((slugName) => productsData[slugName] || []).map((p) => [p.id, p]))

      // Prefer Contentful image URLs; fall back to local JSON images (e.g. KITE demo)
      const mergeLocalImages = (list) =>
        list.map((product) => {
          if (product.images?.length) return product
          const local = localById.get(product.id)
          return local?.images?.length ? { ...product, images: local.images } : product
        })

      if (isContentfulConfigured()) {
        try {
          const contentfulProducts = await fetchProductsFromContentful()
          if (cancelled) return
          setAllProducts(mergeLocalImages(flattenProducts(stampProductsWithCategory(contentfulProducts))))
          setUseContentful(true)
          setLoading(false)
          setGridAnimationKey((key) => key + 1)
          return
        } catch (error) {
          console.warn('Failed to load from Contentful, using JSON fallback:', error)
        }
      }

      if (cancelled) return
      setAllProducts(flattenProducts(stampProductsWithCategory(productsData)))
      setUseContentful(false)
      setLoading(false)
      setGridAnimationKey((key) => key + 1)
    }

    loadProducts()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    // Reset sort if "By Category" is selected but user filters to specific category
    if (listCategory !== 'all' && sortBy === 'category') setSortBy('alphabetical-az')
  }, [listCategory, sortBy])

  // Detect mobile viewport and force cards view
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) setViewMode('cards')
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Hero parallax and the "stuck" state of the filter bar
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      if (heroBgRef.current && !prefersReducedMotion()) {
        heroBgRef.current.style.transform = `translate3d(0, ${Math.min(y, 480) * 0.3}px, 0)`
      }
      const dock = dockRef.current
      if (dock) {
        const stickyTop = parseFloat(getComputedStyle(dock).top) || 0
        setIsStuck(y > 0 && dock.getBoundingClientRect().top <= stickyTop + 1)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), [])

  const query = searchQuery.trim().toLowerCase()

  const filteredProducts = useMemo(() => {
    const inCategory = allProducts.filter((p) => listCategory === 'all' || normalizeCategory(p.category) === listCategory)
    return sortProducts(inCategory.filter((p) => matchesQuery(p, query)), sortBy)
  }, [allProducts, listCategory, query, sortBy])

  const categoryTabs = useMemo(
    () =>
      CATEGORY_TABS.filter(
        (tab) => tab.id === 'all' || tab.id === listCategory || allProducts.some((p) => normalizeCategory(p.category) === tab.id)
      ).map((tab) => ({
        ...tab,
        count: allProducts.filter((p) => (tab.id === 'all' || normalizeCategory(p.category) === tab.id) && matchesQuery(p, query)).length,
      })),
    [allProducts, listCategory, query]
  )

  const scopeCount = allProducts.filter((p) => listCategory === 'all' || normalizeCategory(p.category) === listCategory).length
  const routeProduct = useMemo(() => (slug ? allProducts.find((p) => p.slug === slug) || null : null), [allProducts, slug])

  // Glide cards to their new places when the list changes (falls back to a staggered entrance)
  const animateListChange = useCallback(
    (update) => {
      const grid = resultsRef.current
      if (viewMode !== 'cards' || !grid || !canUseViewTransitions()) {
        update()
        setGridAnimationKey((key) => key + 1)
        return
      }
      const names = {}
      grid.querySelectorAll('.product-card[data-product-key]').forEach((card) => {
        if (!isInViewport(card)) return
        const key = card.dataset.productKey
        names[`product-card-${key.replace(/[^a-zA-Z0-9-]/g, '')}`] = {
          from: card,
          to: () => grid.querySelector(`[data-product-key="${CSS.escape(key)}"]`),
        }
      })
      transitionUpdate(update, names)
    },
    [viewMode]
  )

  const handleCategoryChange = (category) => {
    if (category === listCategory) return
    animateListChange(() => {
      setPendingCategory(category)
      navigate(categoryPath(category))
    })
    // Bring the top of the results back into view if the list was scrolled
    const results = resultsRef.current
    const dock = dockRef.current
    if (results && dock) {
      const target = results.getBoundingClientRect().top + window.scrollY - dock.offsetHeight - 40
      if (window.scrollY > target) window.scrollTo({ top: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
  }

  const handleSortChange = (value) => animateListChange(() => setSortBy(value))

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    setGridAnimationKey((key) => key + 1)
  }

  // ---------- Product detail (routed modal) ----------
  const openProduct = useCallback(
    (product, source) => {
      triggerRef.current = source
      expectedSlugRef.current = product.slug
      const morph = canUseViewTransitions() && source?.matches('.product-card') && isInViewport(source)
      const update = () => {
        setModalState({ direction: null, closing: false, playIntro: !morph })
        setActiveProduct(product)
        navigate(getProductPath(product), { state: { listCategory, fromList: true } })
      }
      if (!morph) {
        update()
        return
      }
      transitionUpdate(update, {
        'product-media': { from: source.querySelector('[data-vt="media"]'), to: () => document.querySelector('.product-modal-image') },
        'product-title': { from: source.querySelector('[data-vt="title"]'), to: () => document.getElementById('product-modal-title') },
        'product-sheet': { from: null, to: () => document.querySelector('.product-modal-sheet') },
      })
    },
    [listCategory, navigate]
  )

  const showProduct = useCallback(
    (product, direction) => {
      if (!product) return
      expectedSlugRef.current = product.slug
      setModalState({ direction, closing: false, playIntro: false })
      setActiveProduct(product)
      navigate(getProductPath(product), { replace: true, state: location.state ?? { listCategory } })
    },
    [listCategory, location.state, navigate]
  )

  const closeProduct = useCallback(
    ({ instant = false } = {}) => {
      if (!activeProduct) return
      const key = getProductKey(activeProduct)
      const card = resultsRef.current?.querySelector(`[data-product-key="${CSS.escape(key)}"]`)

      const leaveRoute = () => {
        expectedSlugRef.current = ''
        if (location.state?.fromList) navigate(-1)
        else navigate(categoryPath(listCategory), { replace: true })
      }
      const finish = () => {
        setActiveProduct(null)
        setModalState((state) => ({ ...state, closing: false }))
        leaveRoute()
      }
      const restoreFocus = () => (card || triggerRef.current)?.focus?.({ preventScroll: true })

      if (!instant && canUseViewTransitions() && card?.matches('.product-card') && isInViewport(card)) {
        transitionUpdate(finish, {
          'product-media': { from: document.querySelector('.product-modal-image'), to: () => card.querySelector('[data-vt="media"]') },
          'product-title': { from: document.getElementById('product-modal-title'), to: () => card.querySelector('[data-vt="title"]') },
          'product-sheet': { from: document.querySelector('.product-modal-sheet'), to: () => null },
        }).then(restoreFocus)
        return
      }

      if (instant || prefersReducedMotion()) {
        finish()
        restoreFocus()
        return
      }

      setModalState((state) => ({ ...state, closing: true }))
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = window.setTimeout(() => {
        finish()
        restoreFocus()
      }, 280)
    },
    [activeProduct, listCategory, location.state, navigate]
  )

  const handleCrumb = (category) => {
    expectedSlugRef.current = ''
    setActiveProduct(null)
    setPendingCategory(category)
    setGridAnimationKey((key) => key + 1)
    navigate(categoryPath(category), { replace: true })
  }

  // Keep the dialog in step with the address bar (shared links, Back and Forward)
  useEffect(() => {
    if (loading) return
    const urlSlug = slug || ''

    if (expectedSlugRef.current !== undefined) {
      if (expectedSlugRef.current === urlSlug) expectedSlugRef.current = undefined
      return
    }

    if (urlSlug && !routeProduct) {
      navigate(categoryPath(routeCategory), { replace: true })
      return
    }

    const activeSlug = activeProduct?.slug || ''
    if (urlSlug === activeSlug) return

    if (routeProduct) {
      setModalState({ direction: activeProduct ? 'next' : null, closing: false, playIntro: true })
      setActiveProduct(routeProduct)
    } else if (activeProduct) {
      setModalState((state) => ({ ...state, closing: true }))
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = window.setTimeout(() => {
        setActiveProduct(null)
        setModalState((state) => ({ ...state, closing: false }))
      }, prefersReducedMotion() ? 0 : 280)
    }
  }, [slug, loading, routeProduct, routeCategory, activeProduct, navigate])

  useEffect(() => {
    if (!activeProduct) return undefined
    document.title = `${brandOf(activeProduct)} | ${PAGE_TITLE}`
    return () => {
      document.title = PAGE_TITLE
    }
  }, [activeProduct])

  const showTable = viewMode === 'table' && !isMobile

  return (
    <div className="products-page">
      {/* Page Hero */}
      <section className="products-hero">
        <div className="products-hero-bg" ref={heroBgRef} aria-hidden="true" />
        <div className="products-hero-overlay"></div>
        <div className="products-hero-content animate-in">
          <h1 key={listCategory} className="products-hero-title">
            {CATEGORY_TITLES[listCategory]}
          </h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span> &gt; </span>
            {listCategory === 'all' ? (
              'Products'
            ) : (
              <>
                <Link to="/products">Products</Link> <span> &gt; </span> {CATEGORY_TITLES[listCategory]}
              </>
            )}
          </nav>
          <span className="products-hero-count">
            {loading ? (
              'Loading products…'
            ) : (
              <>
                <AnimatedNumber value={scopeCount} /> products
              </>
            )}
          </span>
        </div>
      </section>

      {/* Search, category, sort and view controls */}
      <div className="products-filter-dock" ref={dockRef}>
        <div className="products-container">
          <ProductFilterBar
            categories={categoryTabs}
            selectedCategory={listCategory}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            showViewToggle={!isMobile}
            isStuck={isStuck}
          />
        </div>
      </div>

      {/* Products */}
      <section className="products-content">
        <div className="products-container">
          <div className="products-status" aria-live="polite">
            {loading ? (
              <span>Loading products…</span>
            ) : (
              <>
                <span>
                  Showing <b>{filteredProducts.length}</b> of <b>{scopeCount}</b>{' '}
                  {listCategory === 'all' ? 'products' : CATEGORY_TITLES[listCategory].toLowerCase()}
                </span>
                {searchQuery.trim() && (
                  <span className="products-search-token">
                    “{searchQuery.trim()}”
                    <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </span>
                )}
              </>
            )}
          </div>

          <div ref={resultsRef}>
            {loading ? (
              <ProductCardSkeletons />
            ) : filteredProducts.length === 0 ? (
              <div className="products-empty-state">
                <strong>No products found</strong>
                <span>{useContentful ? 'Try a different search, or refresh the page.' : 'Try a different search or category.'}</span>
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')}>
                    Clear search
                  </button>
                )}
              </div>
            ) : showTable ? (
              <ProductTable products={filteredProducts} onOpen={openProduct} />
            ) : (
              <ProductCards
                key={gridAnimationKey}
                products={filteredProducts}
                query={searchQuery}
                onOpen={openProduct}
                linkState={{ listCategory, fromList: true }}
                animateIn={gridAnimationKey > 0}
              />
            )}
          </div>
        </div>
      </section>

      {activeProduct && (
        <ProductDetailModal
          product={activeProduct}
          products={filteredProducts}
          allProducts={allProducts}
          direction={modalState.direction}
          closing={modalState.closing}
          playIntro={modalState.playIntro}
          onClose={closeProduct}
          onNavigate={showProduct}
          onCategoryCrumb={handleCrumb}
        />
      )}
    </div>
  )
}

export default Products
