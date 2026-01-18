/**
 * Test Contentful Connection
 * 
 * This script tests if Contentful credentials are working
 */

import { createClient } from 'contentful'

const spaceId = 'kvec8c4ex2a6'
const accessToken = 'RPvP3c3p8PokHs6-kjLK-1TZL2C45gZX87dxwmIUG98'

const client = createClient({
  space: spaceId,
  accessToken: accessToken
})

console.log('🔍 Testing Contentful connection...\n')

try {
  // Test 1: Get space info
  console.log('1️⃣ Testing space connection...')
  const space = await client.getSpace()
  console.log(`   ✅ Connected to space: "${space.name}"`)
  console.log(`   📦 Space ID: ${space.sys.id}\n`)

  // Test 2: Check content types
  console.log('2️⃣ Checking content types...')
  const contentTypes = await client.getContentTypes()
  console.log(`   ✅ Found ${contentTypes.items.length} content type(s)`)
  
  const productType = contentTypes.items.find(ct => ct.sys.id === 'product')
  if (productType) {
    console.log(`   ✅ Product content type found!`)
    console.log(`   📋 Fields: ${productType.fields.map(f => f.name).join(', ')}\n`)
  } else {
    console.log(`   ⚠️  Product content type not found`)
    console.log(`   💡 You need to create the Product content type first\n`)
  }

  // Test 3: Check products
  let productCount = 0
  if (productType) {
    console.log('3️⃣ Checking products...')
    try {
      const entries = await client.getEntries({
        content_type: 'product'
      })
      productCount = entries.total
      console.log(`   ✅ Found ${entries.total} product(s)`)
      if (entries.items.length > 0) {
        console.log(`   📦 Sample product: "${entries.items[0].fields.productName}"`)
      } else {
        console.log(`   ⚠️  No products found - ready to import!`)
      }
    } catch (error) {
      console.log(`   ⚠️  Error fetching products: ${error.message}`)
      console.log(`   💡 Products may not be imported yet`)
    }
  }

  console.log('\n✅ Connection test complete!')
  console.log('\n📋 Next steps:')
  if (!productType) {
    console.log('   1. Create Product content type in Contentful')
    console.log('   2. Import products using: node scripts/import-products-to-contentful.js')
  } else if (productCount === 0) {
    console.log('   1. Import products using Contentful CLI:')
    console.log('      contentful space import --space-id kvec8c4ex2a6 --content-file products-contentful-import.json')
    console.log('   2. Or add products manually in Contentful web app')
  } else {
    console.log('   1. Test locally: npm run dev')
    console.log('   2. Products should load from Contentful!')
  }

} catch (error) {
  console.error('\n❌ Connection failed!')
  console.error(`   Error: ${error.message}`)
  console.error('\n💡 Check:')
  console.error('   - Space ID is correct')
  console.error('   - Access token is correct')
  console.error('   - Token has read permissions')
  process.exit(1)
}

