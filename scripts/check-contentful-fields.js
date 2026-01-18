/**
 * Check Contentful Field IDs
 * 
 * This script checks the actual field IDs in Contentful
 * to ensure they match our code
 */

import { createClient } from 'contentful'

const spaceId = 'kvec8c4ex2a6'
const accessToken = 'RPvP3c3p8PokHs6-kjLK-1TZL2C45gZX87dxwmIUG98'

const client = createClient({
  space: spaceId,
  accessToken: accessToken
})

console.log('🔍 Checking Contentful field structure...\n')

try {
  const contentTypes = await client.getContentTypes()
  const productType = contentTypes.items.find(ct => ct.sys.id === 'product')
  
  if (!productType) {
    console.log('❌ Product content type not found!')
    process.exit(1)
  }

  console.log('📋 Product Content Type Fields:\n')
  productType.fields.forEach(field => {
    console.log(`   Field Name: "${field.name}"`)
    console.log(`   Field ID:   "${field.id}"`)
    console.log(`   Type:       ${field.type}`)
    console.log(`   Required:   ${field.required ? 'Yes' : 'No'}`)
    console.log('')
  })

  console.log('\n✅ Field check complete!')
  console.log('\n💡 Make sure these field IDs match your code:')
  console.log('   - productName (for product name)')
  console.log('   - brand')
  console.log('   - packing')
  console.log('   - crops')
  console.log('   - targetPests (for pests)')
  console.log('   - category')
  console.log('   - productId or id (for product ID)')

} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}

