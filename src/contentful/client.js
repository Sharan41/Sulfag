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

// Helper function to fetch products from Contentful
export const fetchProductsFromContentful = async () => {
  if (!client) {
    throw new Error('Contentful is not configured. Please set VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN')
  }

  try {
    // Fetch all products (include linked assets for image fields)
    const response = await client.getEntries({
      content_type: 'product',
      order: 'fields.productName',
      include: 2
    })

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
        crops: fields.crops || '',
        pests: fields.targetPests || '',
        category,
        images: resolveProductImages(fields),
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

