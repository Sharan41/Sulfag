import { normalizeCategory } from './categoryUtils'

/**
 * Display helpers derived only from existing Contentful fields
 * (productName, brand, packing, crops, targetPests, category).
 */

export const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const getProductKey = (product) => String(product.sysId || product.id)

const toTitleCase = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/(^|[\s(/-])([a-z])/g, (_, before, letter) => before + letter.toUpperCase())

/** Adds a URL slug from the brand; brands that collide get the product id appended. */
export const withSlugs = (products) => {
  const baseOf = (product) => slugify(product.brand) || slugify(product.product) || slugify(getProductKey(product))
  const counts = new Map()
  products.forEach((product) => {
    const base = baseOf(product)
    counts.set(base, (counts.get(base) || 0) + 1)
  })
  return products.map((product) => {
    const base = baseOf(product)
    const slug = counts.get(base) > 1 ? `${base}-${slugify(String(product.id || product.sysId))}` : base
    return { ...product, slug }
  })
}

export const getProductPath = (product) => `/products/${normalizeCategory(product.category)}/${product.slug}`

const UNITS = {
  LTR: { label: 'L', base: 1000, liquid: true },
  LT: { label: 'L', base: 1000, liquid: true },
  L: { label: 'L', base: 1000, liquid: true },
  ML: { label: 'ml', base: 1, liquid: true },
  KG: { label: 'kg', base: 1000, liquid: false },
  GM: { label: 'g', base: 1, liquid: false },
  G: { label: 'g', base: 1, liquid: false },
}

/**
 * "10X1 LTR; 20 X 500GM" → [{ size: '1 L', perCase: [10] }, { size: '500 g', perCase: [20] }]
 * Tolerates spacing, missing separators and notes such as "(PET / TIN)".
 */
export const parsePackSizes = (packing = '') => {
  const sizes = new Map()
  const pattern = /(?:(\d+)\s*[X×]\s*)?(\d+(?:\.\d+)?)\s*(LTR|LT|ML|KG|GM|G|L)\b/g

  for (const match of String(packing).toUpperCase().matchAll(pattern)) {
    const [, perCase, amount, unitCode] = match
    const unit = UNITS[unitCode]
    const value = parseFloat(amount)
    const key = `${unit.label}-${value}`
    const entry = sizes.get(key) || {
      size: `${value} ${unit.label}`,
      amount: value * unit.base,
      liquid: unit.liquid,
      perCase: [],
    }
    if (perCase && !entry.perCase.includes(Number(perCase))) entry.perCase.push(Number(perCase))
    sizes.set(key, entry)
  }

  return [...sizes.values()].sort((a, b) => b.amount - a.amount)
}

/** "ACEPHATE 75% SP" → "SP", "PHENTHOATE 50 EC" → "EC" */
export const getFormulation = (productName = '') => {
  const match = String(productName).trim().match(/\d(?:\.\d+)?\s*%?\s*([A-Z]{1,4})$/i)
  return match ? match[1].toUpperCase() : ''
}

/** "ACEPHATE 25% + FENVALERATE 3% ML" → [{ name: 'Acephate', percent: 25 }, { name: 'Fenvalerate', percent: 3 }] */
export const getComposition = (productName = '') => {
  const formulation = getFormulation(productName)
  let base = String(productName).trim()
  if (formulation) base = base.replace(new RegExp(`\\s*${formulation}$`, 'i'), '')

  const parts = base.split('+').map((part) => {
    const match = part.trim().match(/^(.*?)\s*(\d+(?:\.\d+)?)\s*%?$/)
    if (!match || !match[1].trim()) return null
    const percent = parseFloat(match[2])
    return percent > 0 && percent <= 100 ? { name: toTitleCase(match[1]), percent } : null
  })

  return parts.every(Boolean) ? parts : []
}

const LIQUID_FORMULATIONS = ['EC', 'SC', 'SL', 'ML', 'RTU', 'EW', 'CS', 'OD', 'ME']
const SOLID_FORMULATIONS = ['SP', 'WP', 'WG', 'WDG', 'WDP', 'SG', 'G', 'GR', 'DP', 'DF']

export const isLiquidProduct = (product) => {
  const formulation = getFormulation(product.product)
  if (LIQUID_FORMULATIONS.includes(formulation)) return true
  if (SOLID_FORMULATIONS.includes(formulation)) return false
  const packs = parsePackSizes(product.packing)
  return packs.length > 0 && packs.filter((pack) => pack.liquid).length >= packs.length / 2
}

// Splits on commas/semicolons that are not inside brackets: "Field Crops (Cotton, Maize), Rice"
const splitList = (value = '') => {
  const items = []
  let depth = 0
  let current = ''
  for (const char of String(value)) {
    if (char === '(') depth += 1
    if (char === ')') depth = Math.max(0, depth - 1)
    if (depth === 0 && (char === ',' || char === ';')) {
      items.push(current)
      current = ''
    } else {
      current += char
    }
  }
  items.push(current)
  return items.map((item) => item.trim().replace(/^(and|&)\s+/i, '').trim()).filter(Boolean)
}

const isShortPhrase = (text, maxWords) => text.split(/\s+/).length <= maxWords

const CROP_ALIASES = {
  Paddy: 'Rice',
  'Transplanted Paddy': 'Rice',
  Bhindi: 'Okra',
  Grape: 'Grapes',
  Chillies: 'Chilli',
  Soybeans: 'Soybean',
  Peanuts: 'Groundnut',
  Redgram: 'Red Gram',
  'Pigeon Pea': 'Red Gram',
  Jowar: 'Sorghum',
}

export const getCropList = (crops = '') => [
  ...new Set(
    splitList(crops).map((crop) => {
      const titled = toTitleCase(crop)
      return CROP_ALIASES[titled] || titled
    })
  ),
]

/** Short line for cards: "Cotton · Rice +4" (sentence-style entries are left out) */
export const getCropSummary = (crops = '', visible = 2) => {
  const list = getCropList(crops).filter((crop) => isShortPhrase(crop, 4) && crop.length <= 32)
  const extra = list.length - visible
  return `${list.slice(0, visible).join(' · ')}${extra > 0 ? ` +${extra}` : ''}`
}

/** Splits target pests into chips; "whiteflies and Bollworms" splits, "Blast and sheath blight in rice" stays whole. */
export const getTargetList = (pests = '') => [
  ...new Set(
    splitList(pests)
      .flatMap((item) => {
        const parts = item.split(/\s+and\s+/i)
        return parts.length === 2 && parts.every((part) => part.trim().split(/\s+/).length <= 2) ? parts : [item]
      })
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
  ),
]

/** Chips read well for short names; sentence-style descriptions are better shown as text */
export const shouldShowTargetsAsText = (targets) => targets.some((target) => !isShortPhrase(target, 6))

export const getRelatedProducts = (product, allProducts, limit = 4) => {
  const crops = getCropList(product.crops)
  const category = normalizeCategory(product.category)
  return allProducts
    .filter((other) => normalizeCategory(other.category) === category && getProductKey(other) !== getProductKey(product))
    .map((other) => ({ other, shared: getCropList(other.crops).filter((crop) => crops.includes(crop)).length }))
    .sort((a, b) => b.shared - a.shared || a.other.brand.localeCompare(b.other.brand))
    .slice(0, limit)
    .map(({ other }) => other)
}
