import { createClient } from 'contentful'
import { groupProductsByCategory, normalizeCategory } from '../utils/categoryUtils'

// Contentful client configuration
// Get credentials from environment variables
const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN

// Create Contentful client if credentials are available
export const client = spaceId && accessToken
  ? createClient({
      space: spaceId,
      accessToken: accessToken,
      environment: 'master' // Use default environment
    })
  : null

// Check if Contentful is configured
export const isContentfulConfigured = () => {
  return client !== null
}

/**
 * Resolve Contentful Asset field(s) into absolute image URLs (no limit).
 * Supports:
 * - fields.images (Array of Assets) — preferred
 * - fields.image / fields.image2 (single Assets) — fallback
 */
const resolveProductImages = (fields) => {
  const urls = []

  const pushAsset = (asset) => {
    if (!asset || typeof asset !== 'object') return
    const fileUrl = asset.fields?.file?.url
    if (!fileUrl || typeof fileUrl !== 'string') return
    const absolute = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl
    if (!urls.includes(absolute)) urls.push(absolute)
  }

  if (Array.isArray(fields.images)) {
    fields.images.forEach(pushAsset)
  }

  pushAsset(fields.image)
  pushAsset(fields.image2)

  return urls
}

// Fields already mapped onto the product object and shown in their own sections
const MAPPED_FIELDS = ['productName', 'brand', 'packing', 'packSizes', 'crops', 'targetPests', 'category', 'id', 'images', 'image', 'image2']

/** Linked Pack Size entries → [{ size: '1 L', unitsPerCase: 10, mrp: 1250 }]; unpublished links are skipped */
const resolvePackSizes = (fields) =>
  (Array.isArray(fields.packSizes) ? fields.packSizes : [])
    .map((entry) => entry?.fields)
    .filter((pack) => pack && String(pack.size || '').trim())
    .map((pack) => ({
      size: String(pack.size).trim(),
      unitsPerCase: Number.isInteger(pack.unitsPerCase) ? pack.unitsPerCase : null,
      mrp: typeof pack.mrp === 'number' ? pack.mrp : null,
    }))

const humanizeFieldId = (id) =>
  id.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/^./, (char) => char.toUpperCase())

const richTextToPlain = (node) => {
  if (!node) return ''
  if (node.nodeType === 'text') return node.value || ''
  const children = node.content || []
  const separator = node.nodeType === 'document' || node.nodeType?.endsWith('list') ? '\n' : ''
  return children.map(richTextToPlain).join(separator)
}

/**
 * Turns any Contentful field value into display items:
 * strings for text, { href, label } for file assets. Returns [] when there is nothing to show.
 */
const toDisplayItems = (value) => {
  if (value == null || value === '') return []
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim() ? [String(value).trim()] : []
  if (typeof value === 'boolean') return [value ? 'Yes' : 'No']
  if (Array.isArray(value)) return value.flatMap(toDisplayItems)
  if (typeof value !== 'object') return []
  if (value.nodeType === 'document') return toDisplayItems(richTextToPlain(value))
  if (value.fields?.file?.url) {
    const url = value.fields.file.url
    return [{ href: url.startsWith('//') ? `https:${url}` : url, label: value.fields.title || value.fields.file.fileName || 'Download' }]
  }
  if (value.fields) {
    const text = Object.values(value.fields).find((fieldValue) => typeof fieldValue === 'string' && fieldValue.trim())
    return text ? [text.trim()] : []
  }
  if (typeof value.lat === 'number' && typeof value.lon === 'number') return [`${value.lat}, ${value.lon}`]
  return []
}

/** Every populated field that is not mapped above, in the order set in the Contentful content model */
const resolveExtraFields = (fields, contentType) => {
  const definitions = contentType?.fields?.filter((field) => !field.disabled && !field.omitted)
  const ordered = definitions ? definitions.map((field) => ({ id: field.id, label: field.name })) : []
  Object.keys(fields).forEach((id) => {
    if (!ordered.some((field) => field.id === id)) ordered.push({ id, label: humanizeFieldId(id) })
  })

  return ordered
    .filter(({ id }) => !MAPPED_FIELDS.includes(id))
    .map(({ id, label }) => ({ id, label: label || humanizeFieldId(id), items: toDisplayItems(fields[id]) }))
    .filter((field) => field.items.length > 0)
}

// Helper function to fetch products from Contentful
export const fetchProductsFromContentful = async () => {
  if (!client) {
    throw new Error('Contentful is not configured. Please set VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN')
  }

  try {
    // Fetch all products (include linked assets for image fields) and the content model for field labels
    const [response, contentType] = await Promise.all([
      client.getEntries({
        content_type: 'product',
        order: 'fields.productName',
        include: 2,
        limit: 1000
      }),
      client.getContentType('product').catch(() => null)
    ])

    // Section headings use the field names as written in the Contentful content model
    const labelOf = (id) => contentType?.fields?.find((field) => field.id === id)?.name
    const fieldLabels = { crops: labelOf('crops'), pests: labelOf('targetPests'), packSizes: labelOf('packSizes') }

    // Transform Contentful entries to match your product structure
    const products = response.items.map((item) => {
      const fields = item.fields
      const category = normalizeCategory(fields.category)

      return {
        sysId: item.sys.id,
        id: fields.id || item.sys.id,
        product: fields.productName || '',
        brand: fields.brand || '',
        packing: fields.packing || '',
        packSizes: resolvePackSizes(fields),
        crops: fields.crops || '',
        pests: fields.targetPests || '',
        category,
        images: resolveProductImages(fields),
        extraFields: resolveExtraFields(fields, contentType),
        fieldLabels,
      }
    })

    return groupProductsByCategory(products)
  } catch (error) {
    console.error('Error fetching products from Contentful:', error)
    throw error
  }
}

// Real-time sync function (for future use)
export const syncProducts = async (syncToken = null) => {
  if (!client) {
    throw new Error('Contentful is not configured')
  }

  try {
    const response = syncToken
      ? await client.sync({ nextSyncToken: syncToken })
      : await client.sync({ initial: true, type: 'Entry', content_type: 'product' })

    return response
  } catch (error) {
    console.error('Error syncing products:', error)
    throw error
  }
}

export default client

