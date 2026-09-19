/** The four categories the site has always had; any other Contentful category is used as-is */
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

const slugifyCategory = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const titleCaseSlug = (slug) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

/**
 * Normalize a Contentful/local category to a slug. Known categories map to the four
 * slugs above; a category added in Contentful (e.g. "Bio Stimulants") becomes its own
 * slug ("bio-stimulants") so it shows up on the site without a code change.
 * Products with no category fall into "specialty" (shown as "Other Products").
 */
export const normalizeCategory = (value) => {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw == null || String(raw).trim() === '') return 'specialty'

  const normalized = slugifyCategory(raw)
  if (PRODUCT_CATEGORY_SLUGS.includes(normalized)) return normalized
  if (CATEGORY_ALIASES[normalized]) return CATEGORY_ALIASES[normalized]

  if (normalized.includes('herb') || normalized.includes('weed')) return 'herbicides'
  if (normalized.includes('fung')) return 'fungicides'
  if (normalized.includes('insect')) return 'insecticides'
  if (normalized.includes('growth') || normalized.includes('special')) return 'specialty'

  return normalized || 'specialty'
}

/** Singular slug for accent colours (product-card-herbicide); new categories reuse the specialty accent */
export const getCategoryBadgeSlug = (category) =>
  ({
    insecticides: 'insecticide',
    fungicides: 'fungicide',
    herbicides: 'herbicide',
    specialty: 'specialty',
  })[normalizeCategory(category)] || 'specialty'

/** Badge text on cards: "Insecticide", "Bio Stimulants" */
export const getCategoryLabel = (category) => {
  const slug = normalizeCategory(category)
  return (
    {
      insecticides: 'Insecticide',
      fungicides: 'Fungicide',
      herbicides: 'Herbicide',
      specialty: 'Specialty',
    }[slug] || titleCaseSlug(slug)
  )
}

/** Page and section headings: "Insecticides", "Other Products", "Bio Stimulants" */
export const getCategoryTitle = (category) => {
  if (category === 'all') return 'Our Products'
  const slug = normalizeCategory(category)
  return (
    {
      insecticides: 'Insecticides',
      fungicides: 'Fungicides',
      herbicides: 'Herbicides',
      specialty: 'Other Products',
    }[slug] || titleCaseSlug(slug)
  )
}

/** Categories that actually have products: the known four first, then any new ones alphabetically */
export const getCategorySlugs = (products) => {
  const present = new Set(products.map((product) => normalizeCategory(product.category)))
  return [
    ...PRODUCT_CATEGORY_SLUGS.filter((slug) => present.has(slug)),
    ...[...present].filter((slug) => !PRODUCT_CATEGORY_SLUGS.includes(slug)).sort(),
  ]
}

export const groupProductsByCategory = (products) => {
  const grouped = Object.fromEntries(PRODUCT_CATEGORY_SLUGS.map((slug) => [slug, []]))

  products.forEach((product) => {
    const category = normalizeCategory(product.category)
    if (!grouped[category]) grouped[category] = []
    grouped[category].push({ ...product, category })
  })

  return grouped
}

/** Stamp category onto products loaded from local JSON buckets */
export const stampProductsWithCategory = (productsData) =>
  Object.fromEntries(
    Object.entries(productsData).map(([slug, list]) => [
      slug,
      (list || []).map((product) => ({ ...product, category: normalizeCategory(product.category || slug) })),
    ])
  )
