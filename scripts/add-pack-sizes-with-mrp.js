/**
 * Adds per-pack-size MRP to Contentful:
 *   1. Creates a `packSize` content type (Size, Units per case, MRP (₹))
 *   2. Adds a `packSizes` field (references to Pack Size) on `product`
 *   3. Creates Pack Size entries from each product's existing Packing text and links them
 *      (MRP left empty for the client to fill in). Products that already have pack sizes are skipped.
 *
 * Previews by default; pass --apply to write.
 *
 * Usage:
 *   set -a && . ./.env && set +a
 *   node scripts/add-pack-sizes-with-mrp.js            # preview
 *   node scripts/add-pack-sizes-with-mrp.js --apply    # write to Contentful
 */

import contentfulManagement from 'contentful-management'

const spaceId =
  process.env.CONTENTFUL_SPACE_ID ||
  process.env.VITE_CONTENTFUL_SPACE_ID
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const apply = process.argv.includes('--apply')

if (!spaceId || !managementToken) {
  console.error('❌ Missing CONTENTFUL_SPACE_ID (or VITE_CONTENTFUL_SPACE_ID) and CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

const PACK_TYPE_ID = 'packSize'
const PRODUCT_FIELD_ID = 'packSizes'

const UNITS = {
  LTR: { label: 'L', base: 1000 },
  LT: { label: 'L', base: 1000 },
  L: { label: 'L', base: 1000 },
  ML: { label: 'ml', base: 1 },
  KG: { label: 'kg', base: 1000 },
  GM: { label: 'g', base: 1 },
  G: { label: 'g', base: 1 },
}

/** "10X1 LTR; 20 X 500GM" → [{ size: '1 L', unitsPerCase: 10 }, { size: '500 g', unitsPerCase: 20 }] */
const parsePacking = (packing = '') => {
  const packs = new Map()
  const pattern = /(?:(\d+)\s*[X×]\s*)?(\d+(?:\.\d+)?)\s*(LTR|LT|ML|KG|GM|G|L)\b/g
  for (const [, perCase, amount, unitCode] of String(packing).toUpperCase().matchAll(pattern)) {
    const unit = UNITS[unitCode]
    const value = parseFloat(amount)
    const size = `${value} ${unit.label}`
    const unitsPerCase = perCase ? Number(perCase) : null
    const key = `${size}|${unitsPerCase}`
    if (!packs.has(key)) packs.set(key, { size, unitsPerCase, amount: value * unit.base })
  }
  return [...packs.values()].sort((a, b) => b.amount - a.amount)
}

const client = contentfulManagement.createClient({ accessToken: managementToken })

try {
  const space = await client.getSpace(spaceId)
  const environment = await space.getEnvironment('master')
  const locale = (await environment.getLocales()).items.find((item) => item.default).code

  // 1. Pack Size content type
  let packType = await environment.getContentType(PACK_TYPE_ID).catch(() => null)
  if (packType) {
    console.log(`✅ Content type "${PACK_TYPE_ID}" already exists.`)
  } else {
    console.log(`➕ Create content type "Pack Size" (${PACK_TYPE_ID}): Size, Units per case, MRP (₹)`)
    if (apply) {
      packType = await environment.createContentTypeWithId(PACK_TYPE_ID, {
        name: 'Pack Size',
        displayField: 'size',
        description: 'One pack size of a product with its MRP. Add these from the product\'s Pack Sizes field.',
        fields: [
          { id: 'size', name: 'Size', type: 'Symbol', required: true, localized: false, validations: [] },
          { id: 'unitsPerCase', name: 'Units per case', type: 'Integer', required: false, localized: false, validations: [{ range: { min: 1 } }] },
          { id: 'mrp', name: 'MRP (₹)', type: 'Number', required: false, localized: false, validations: [{ range: { min: 0 } }] },
        ],
      })
      await packType.publish()
    }
  }

  // 2. Pack Sizes field on Product
  const productType = await environment.getContentType('product')
  if (productType.fields.some((field) => field.id === PRODUCT_FIELD_ID)) {
    console.log(`✅ Field "${PRODUCT_FIELD_ID}" already exists on product.`)
  } else {
    console.log(`➕ Add field "Pack Sizes" (${PRODUCT_FIELD_ID}) to product: references to Pack Size`)
    if (apply) {
      productType.fields.push({
        id: PRODUCT_FIELD_ID,
        name: 'Pack Sizes',
        type: 'Array',
        localized: false,
        required: false,
        disabled: false,
        omitted: false,
        items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: [PACK_TYPE_ID] }] },
        validations: [],
      })
      const updated = await productType.update()
      await updated.publish()
    }
  }

  // 3. Pack Size entries from existing Packing text
  const products = await environment.getEntries({ content_type: 'product', limit: 1000 })
  let created = 0
  const skipped = []
  const leftAsDraft = []

  for (const product of products.items) {
    const brand = String(product.fields.brand?.[locale] || product.sys.id).trim()
    if (product.fields[PRODUCT_FIELD_ID]?.[locale]?.length) {
      skipped.push(`${brand} (already has pack sizes)`)
      continue
    }
    const packs = parsePacking(product.fields.packing?.[locale])
    if (!packs.length) {
      skipped.push(`${brand} (packing not readable: "${product.fields.packing?.[locale] || ''}")`)
      continue
    }

    console.log(`   ${brand}: ${packs.map((pack) => `${pack.size}${pack.unitsPerCase ? ` ×${pack.unitsPerCase}` : ''}`).join(', ')}`)
    created += packs.length
    if (!apply) continue

    const links = []
    for (const pack of packs) {
      const fields = { size: { [locale]: pack.size } }
      if (pack.unitsPerCase) fields.unitsPerCase = { [locale]: pack.unitsPerCase }
      const entry = await environment.createEntry(PACK_TYPE_ID, { fields })
      await entry.publish()
      links.push({ sys: { type: 'Link', linkType: 'Entry', id: entry.sys.id } })
    }

    // Only republish products that had no unpublished edits, so drafts are not pushed live
    const publishedWithoutEdits = product.isPublished() && !product.isUpdated()
    product.fields[PRODUCT_FIELD_ID] = { [locale]: links }
    const updated = await product.update()
    if (publishedWithoutEdits) await updated.publish()
    else leftAsDraft.push(brand)
  }

  console.log(`\n${apply ? '✅ Created' : 'Would create'} ${created} pack size entries across ${products.items.length - skipped.length} products.`)
  if (skipped.length) console.log(`Skipped:\n   ${skipped.join('\n   ')}`)
  if (leftAsDraft.length) console.log(`Linked but not published (they had unpublished edits), publish in Contentful:\n   ${leftAsDraft.join('\n   ')}`)
  if (!apply) console.log('\nPreview only. Run again with --apply to write to Contentful.')
} catch (error) {
  console.error('❌ Failed to add pack sizes:', error.message || error)
  process.exit(1)
}
