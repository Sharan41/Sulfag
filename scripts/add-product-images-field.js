/**
 * Add an `images` field (Array of Assets, max 2) to the Contentful `product` content type.
 *
 * Requires a Content Management API token with content type edit rights:
 *   CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-...
 *   VITE_CONTENTFUL_SPACE_ID=...   (or CONTENTFUL_SPACE_ID)
 *
 * Usage:
 *   CONTENTFUL_MANAGEMENT_TOKEN=... node scripts/add-product-images-field.js
 */

import contentfulManagement from 'contentful-management'

const spaceId =
  process.env.CONTENTFUL_SPACE_ID ||
  process.env.VITE_CONTENTFUL_SPACE_ID
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN

if (!spaceId || !managementToken) {
  console.error('❌ Missing CONTENTFUL_SPACE_ID (or VITE_CONTENTFUL_SPACE_ID) and CONTENTFUL_MANAGEMENT_TOKEN')
  process.exit(1)
}

const FIELD_ID = 'images'

const client = contentfulManagement.createClient({
  accessToken: managementToken,
})

try {
  const space = await client.getSpace(spaceId)
  const environment = await space.getEnvironment('master')
  const contentType = await environment.getContentType('product')

  const existing = contentType.fields.find((f) => f.id === FIELD_ID)
  if (existing) {
    console.log(`✅ Field "${FIELD_ID}" already exists on product content type.`)
    console.log(`   Type: ${existing.type}${existing.items ? ` of ${existing.items.type}` : ''}`)
    process.exit(0)
  }

  contentType.fields.push({
    id: FIELD_ID,
    name: 'Images',
    type: 'Array',
    localized: false,
    required: false,
    disabled: false,
    omitted: false,
    items: {
      type: 'Link',
      linkType: 'Asset',
      validations: [
        {
          linkMimetypeGroup: ['image'],
        },
      ],
    },
    validations: [
      {
        size: {
          max: 2,
        },
      },
    ],
  })

  const updated = await contentType.update()
  await updated.publish()

  console.log('✅ Added and published "Images" field (id: images) on product content type.')
  console.log('   • Type: Array of Assets (images only)')
  console.log('   • Max: 2 images per product')
  console.log('   • Optional — products without images still work')
  console.log('\nNext: In Contentful, open a product → Media → upload/link up to 2 images → Publish.')
} catch (error) {
  console.error('❌ Failed to add images field:', error.message || error)
  process.exit(1)
}
