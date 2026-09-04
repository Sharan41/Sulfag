export const PRODUCT_CATEGORY_SLUGS = [
  'insecticides',
  'fungicides',
  'herbicides',
  'specialty',
]

const CATEGORY_ALIASES = {
  insecticide: 'insecticides',
  insecticides: 'insecticides',
  fungicide: 'fungicides',
  fungicides: 'fungicides',
  herbicide: 'herbicides',
  herbicides: 'herbicides',
  herbocide: 'herbicides',
  herbocides: 'herbicides',
  weedicide: 'herbicides',
  weedicides: 'herbicides',
  specialty: 'specialty',
  specialties: 'specialty',
  other: 'specialty',
  'plant-growth-regulator': 'specialty',
  'plant-growth-regulators': 'specialty',
  pgr: 'specialty',
}

/**
 * Normalize Contentful/local category values to slug: insecticides | fungicides | herbicides | specialty
 */
export const normalizeCategory = (value) => {
  if (value == null || value === '') return 'insecticides'

  const raw = Array.isArray(value) ? value[0] : value
  const normalized = String(raw).trim().toLowerCase().replace(/[_\s]+/g, '-')

  if (PRODUCT_CATEGORY_SLUGS.includes(normalized)) {
    return normalized
  }

  if (CATEGORY_ALIASES[normalized]) {
    return CATEGORY_ALIASES[normalized]
  }

  if (normalized.includes('herb') || normalized.includes('weed')) return 'herbicides'
  if (normalized.includes('fung')) return 'fungicides'
  if (normalized.includes('insect')) return 'insecticides'
  if (normalized.includes('growth') || normalized.includes('special')) return 'specialty'

  return 'insecticides'
}

/** Singular slug for badge CSS classes (badge-herbicide, product-card-herbicide) */
export const getCategoryBadgeSlug = (category) => {
  const slug = normalizeCategory(category)
  const badgeMap = {
    insecticides: 'insecticide',
    fungicides: 'fungicide',
    herbicides: 'herbicide',
    specialty: 'specialty',
  }
  return badgeMap[slug] || 'insecticide'
}

export const getCategoryLabel = (category) => {
  const badge = getCategoryBadgeSlug(category)
  return badge.charAt(0).toUpperCase() + badge.slice(1)
}

export const groupProductsByCategory = (products) => {
  const grouped = {
    insecticides: [],
    fungicides: [],
    herbicides: [],
    specialty: [],
  }

  products.forEach((product) => {
    const category = normalizeCategory(product.category)
    grouped[category].push({ ...product, category })
  })

  return grouped
}

/** Stamp category onto products loaded from local JSON buckets */
export const stampProductsWithCategory = (productsData) => ({
  insecticides: (productsData.insecticides || []).map((product) => ({
    ...product,
    category: normalizeCategory(product.category || 'insecticides'),
  })),
  fungicides: (productsData.fungicides || []).map((product) => ({
    ...product,
    category: normalizeCategory(product.category || 'fungicides'),
  })),
  herbicides: (productsData.herbicides || []).map((product) => ({
    ...product,
    category: normalizeCategory(product.category || 'herbicides'),
  })),
  specialty: (productsData.specialty || []).map((product) => ({
    ...product,
    category: normalizeCategory(product.category || 'specialty'),
  })),
})
