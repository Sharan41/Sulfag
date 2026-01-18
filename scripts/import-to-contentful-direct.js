/**
 * Direct Import to Contentful
 * 
 * This script imports products directly to Contentful using the Management API
 * No CLI login required - uses access token directly
 */

import contentfulManagement from 'contentful-management'
const { createClient } = contentfulManagement
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Contentful credentials
const SPACE_ID = 'kvec8c4ex2a6'
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN || ''

// Note: You need a Management API token, not the Content Delivery API token
// Get it from: https://app.contentful.com/spaces/kvec8c4ex2a6/api/keys

console.log('🚀 Starting direct import to Contentful...\n')

if (!MANAGEMENT_TOKEN) {
  console.error('❌ Error: CONTENTFUL_MANAGEMENT_TOKEN not set!')
  console.error('\n📋 To get your Management API token:')
  console.error('   1. Go to https://app.contentful.com/spaces/kvec8c4ex2a6/api/keys')
  console.error('   2. Click "Content management tokens"')
  console.error('   3. Generate a new token or use existing one')
  console.error('   4. Set it as: export CONTENTFUL_MANAGEMENT_TOKEN="your_token"')
  console.error('\n   Or run: CONTENTFUL_MANAGEMENT_TOKEN=your_token node scripts/import-to-contentful-direct.js')
  process.exit(1)
}

const client = createClient({
  accessToken: MANAGEMENT_TOKEN
})

// Read products from JSON
const productsPath = path.join(__dirname, '../src/data/products.json')
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'))

// Flatten all products
const allProducts = [
  ...productsData.insecticides.map(p => ({ ...p, category: 'insecticides' })),
  ...productsData.fungicides.map(p => ({ ...p, category: 'fungicides' })),
  ...productsData.herbicides.map(p => ({ ...p, category: 'herbicides' })),
  ...(productsData.specialty || []).map(p => ({ ...p, category: 'specialty' }))
]

console.log(`📦 Found ${allProducts.length} products to import\n`)

async function importProducts() {
  try {
    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment('master')
    
    console.log(`✅ Connected to space: ${space.name}`)
    console.log(`✅ Environment: master\n`)

    let successCount = 0
    let errorCount = 0
    const errors = []

    for (const product of allProducts) {
      try {
        // Create entry
        const entry = await environment.createEntry('product', {
          fields: {
            productName: {
              'en-US': product.product
            },
            brand: {
              'en-US': product.brand
            },
            packing: {
              'en-US': product.packing
            },
            crops: {
              'en-US': product.crops
            },
            targetPests: {
              'en-US': product.pests
            },
            category: {
              'en-US': [product.category] // Array format
            },
            id: {
              'en-US': product.id
            }
          }
        })

        // Publish entry
        await entry.publish()
        
        successCount++
        console.log(`✅ Imported: ${product.product} (ID: ${product.id})`)
      } catch (error) {
        errorCount++
        const errorMsg = `Failed to import ${product.product}: ${error.message}`
        errors.push(errorMsg)
        console.error(`❌ ${errorMsg}`)
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✅ Import complete!`)
    console.log(`   Success: ${successCount}`)
    console.log(`   Errors: ${errorCount}`)
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:')
      errors.forEach(err => console.log(`   - ${err}`))
    }

    console.log('\n🎉 Products are now live in Contentful!')
    console.log('   Visit: https://app.contentful.com/spaces/kvec8c4ex2a6/entries')

  } catch (error) {
    console.error('\n❌ Import failed:', error.message)
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.data, null, 2))
    }
    process.exit(1)
  }
}

importProducts()

